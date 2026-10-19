import express from 'express';

import {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
} from '../controllers/task.controller.js';

const taskRoutes = express.Router();


taskRoutes.route('/')
  .post(createTask)
  .get(getAllTasks);


taskRoutes.route('/:id')
  .get(getTaskById)
  .put(updateTask)
  .delete(deleteTask);

export {taskRoutes};
