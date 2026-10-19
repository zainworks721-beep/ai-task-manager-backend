import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

import {taskRoutes} from './routes/task.routes.js';
import { aiRouter } from './routes/ai.routes.js';
import { notFoundHandler, errorHandler } from './middleware/errorHandler.js';

const app = express();
app.use(cors());

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'));

app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Task Manager API is running smoothly',
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/tasks', taskRoutes);
app.use('/api/ai', aiRouter);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;