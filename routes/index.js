#!/usr/bin/env node

import { Router } from 'express';
import AppController from '../controllers/AppController';

const router = Router();

router.use('/status', AppController.getStatus);
router.use('/stats', AppController.getStats);

module.exports = router;
