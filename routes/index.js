#!/usr/bin/env node

import AppController from '../controllers/AppController';
import UserController from '../controllers/UsersController';

const indexRoutes = (app) => {
  app.get('/status', AppController.getStatus);
  app.get('/stats', AppController.getStats);
  app.post('/users', UserController.postNew);
};

export default indexRoutes;
