#!/usr/bin/env node

import { Router } from 'express';
import AppController from '../controllers/AppController';
import UsersController from '../controllers/UsersController';

const router = Router();

router.use('/status', AppController.getStatus);
router.use('/stats', AppController.getStats);
router.use('/users', UsersController.postNew);

export default router;
