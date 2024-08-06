import fs from 'fs';
import path from 'path';
import { ObjectId } from 'mongodb';
import dbClient from '../utils/db';
import redisClient from '../utils/redis';
import { uuidV4 } from 'mongodb/lib/core/utils';

class FileController {
  static async postUpload(req, res) {
    const { token } = req;
    if (!token) { return res.status(401).json({ error: 'Unauthorized' }); }
    const key = `auth_${token}`;
    const userId = await redisClient.get(key);
    if (!userId) { return res.status(401).json({ error: 'Unauthorized' }); }
    const user = await dbClient.userCollection.findOne({ _id: ObjectId(userId) });
    if (!user) { return res.status(401).json({ error: 'Unauthorized' }); }
    const fileInfo = req.body;
    // console.log(fileInfo, typeof fileInfo);

    const allowedTypes = ['folder', 'file', 'image'];
    if (!fileInfo.name) { return res.status(400).json({ error: 'Missing name' }); }
    if (!fileInfo.type || !allowedTypes.includes(fileInfo.type)) { return res.status(400).json({ error: 'Missing type' }); }
    if (!fileInfo.data && fileInfo.type !== 'folder') { return res.status(400).json({ error: 'Missing data' }); }

    // Check parent id for file
    if (fileInfo.parentId) {
      const parentFile = await dbClient.fileCollection.findOne({ parentId: fileInfo.parentId });
      if (!parentFile) { return res.status(400).json({ error: 'Parent not found' }); }
      if (parentFile.type !== 'folder') { return res.status(400).json({ error: 'Parent is not a folder' }); }
    }
    if (fileInfo.type === 'folder') {
      // Add file and return the new file wth 201 status code
      const newFolder = await dbClient.fileCollection.insertOne({
        name: fileInfo.name,
        type: fileInfo.type,
        parentId: fileInfo.parentId || '0',
        isPublic: fileInfo.isPublic || false,
        userId,
      });
      const result = newFolder.ops[0];
      console.log(result);
      return res.status(201).json(result);
    }
    // file type image or file

    const dirPath = process.env.FOLDER_PATH || '/tmp/files_manager';
    if (!fs.existsSync(dirPath)) { fs.mkdirSync(dirPath); }
    const fileName = `${uuidV4()}`;
    const filePath = path.join(dirPath, fileName);

    try {
      const fileData = Buffer.from(fileInfo.data, 'base64');
      fs.writeFileSync(filePath, fileData);
    } catch (error) {
      console.log(error.message);
    }
    const newFile = {
      name: fileInfo.name,
      type: fileInfo.type,
      path: filePath,
      parentId: fileInfo.parentId || '0',
      isPublic: fileInfo.isPublic || false,
      userId,
      localPath: filePath,
    };

    const result = (await dbClient.fileCollection.insertOne(newFile)).ops[0];
    console.log(result);
    // Temporary success message below
    return res.status(200).json(result);
  }
}
export default FileController;
