#!/usr/bin/env node

import express from 'express';
import indexRoutes from './routes/index';

const port = process.env.PORT || 5000;
const app = express();

app.use(express.json());
indexRoutes(app);

app.listen(port, () => console.log(`Server started on port ${port}`));
