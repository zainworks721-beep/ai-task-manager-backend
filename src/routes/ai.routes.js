import express  from 'express';
import { planTask } from '../controllers/ai.controller.js';

const aiRouter = express.Router();


aiRouter.post('/plan-task', planTask);

export {aiRouter};
