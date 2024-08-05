#!/usr/bin/env node

import redisClient from '../utils/redis';
import dbClient from '../utils/db';

class AppController {
  static getStatus(req, res) {
    if (redisClient.isAlive() && dbClient.isAlive()) {
      const status = {
        redis: true,
        db: true,
      };
      res.status(200).json(status);
    }
  }

  static async getStats(req, res) {
    if (dbClient.isAlive()) {
      const users = await dbClient.nbUsers();
      const files = await dbClient.nbFiles();
      const stats = {
        users,
        files,
      }
      res.status(200).json(stats);
    }
  }
}

module.exports = AppController;