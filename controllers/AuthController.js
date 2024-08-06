import sha1 from 'sha1';
import { v4 as uuidv4 } from 'uuid';
import redisClient from '../utils/redis';
import dbClient from '../utils/db';

class AuthController {
  static async getConnect(req, res) {
    const { email, password } = req.auth;
    const user = await dbClient.userCollection.findOne({ email });
    if (!user) { return res.status(401).json({ error: 'Unauthorized' }); }
    const passwordHash = sha1(password);
    if (passwordHash !== user.password) { return res.status(401).json({ error: 'Unauthorized' }); }
    const token = uuidv4();
    const key = `auth_${token}`;
    await redisClient.set(key, user._id.toString(), 86400);
    return res.status(200).json({ token });
  }
}

module.exports = AuthController;
