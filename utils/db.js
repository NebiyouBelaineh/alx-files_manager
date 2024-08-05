#!/usr/bin/env node

import { MongoClient } from 'mongodb';

class DBClient {
  constructor() {
    this.host = process.env.DB_HOST || 'localhost';
    this.port = process.env.DB_PORT || 27017;
    this.database = process.env.DB_DATABASE || 'files_manager';
    this.url = `mongodb://${this.host}:${this.port}`;
    this.client = new MongoClient(this.url, { useUnifiedTopology: true });
    this.db = null;
  }

  async makeConnection() {
    try {
      await this.client.connect();
      this.db = this.client.db(this.database);
      return true;
    } catch (error) {
      console.log(error.message);

      return false;
    }
  }

  isAlive() {
    if (!this.db) {
      this.makeConnection();
      return false;
    }
    return true;
  }

  async nbUsers() {
    try {
      const collection = await this.db.collection('users');
      const users = await collection.countDocuments();

      return users;
    } catch (error) {
      console.log(error.message);
      return null;
    }
  }

  async nbFiles() {
    try {
      const collection = await this.db.collection('files');
      const files = await collection.countDocuments();

      return files;
    } catch (error) {
      console.log(error.message);
      return null;
    }
  }
}
const dbClient = new DBClient();
module.exports = dbClient;
