#!/usr/bin/env node

import { MongoClient } from 'mongodb';

class DBClient {
  constructor() {
    this.host = process.env.DB_HOST || 'localhost';
    this.port = process.env.DB_PORT || 27017;
    this.database = process.env.DB_DATABASE || 'files_manager';
    this.url = `mongodb://${this.host}:${this.port}`;
    this.client = new MongoClient(this.url, { useUnifiedTopology: true });
    this.isConnected = false;
    // this.db = this.client.db(this.database);
  }

  async makeConnection() {
    try {
      await this.client.connect();
      this.isConnected = true;
    } catch (error) {
      console.log(error.message);
      this.isConnected = false;
    }
  }

  isAlive() {
    // console.log('isConnected: ', this.isConnected);
    return this.isConnected;
  }

  async nbUsers() {
    try {
      if (this.isConnected === false) {
        await this.makeConnection();
      }
      const collection = await this.db.collection('users');
      const users = await collection.countDocuments();

      return users;
    } catch (error) {
      console.log(error.message);
      return null;
    } finally {
      // Close the connection
      await this.client.close();
    }
  }

  async nbFiles() {
    try {
      if (this.isConnected === false) {
        await this.makeConnection();
      }
      const collection = await this.db.collection('files');
      const files = await collection.countDocuments();

      return files;
    } catch (error) {
      console.log(error.message);
      return null;
    } finally {
      // Close the connection
      await this.client.close();
    }
  }
}
const dbClient = new DBClient();
module.exports = dbClient;
