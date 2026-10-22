import express from 'express';

import {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
} from '../controllers/task.controller.js';
import { validateUserHeader } from '../middleware/validateUserHeader.js';

const taskRoutes = express.Router();


taskRoutes.route('/')
  .post(validateUserHeader, createTask)
  .get(validateUserHeader, getAllTasks);



taskRoutes.route('/:id')
  .get(validateUserHeader, getTaskById)
  .put(validateUserHeader, updateTask)
  .delete(validateUserHeader, deleteTask);

export {taskRoutes};
