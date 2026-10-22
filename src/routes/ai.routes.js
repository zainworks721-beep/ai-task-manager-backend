import express  from 'express';
import { planTask } from '../controllers/ai.controller.js';
import { validateUserHeader } from '../middleware/validateUserHeader.js';

const aiRouter = express.Router();


aiRouter.post('/plan-task', validateUserHeader, planTask);

export {aiRouter};
