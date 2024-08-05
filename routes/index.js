#!/usr/bin/env node

import AppController from '../controllers/AppController';

const indexRoutes = (app) => {
  app.get('/status', AppController.getStatus);
  app.get('/stats', AppController.getStats);
};

export default indexRoutes;
