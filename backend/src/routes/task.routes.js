import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { taskValidator } from '../validators/task.validator.js';
import {
	getProjectTasks,
	getMyTasks,
	createTask,
	updateTask,
	updateTaskStatus,
	deleteTask,
} from '../controllers/task.controller.js';

const router = express.Router();

router.get('/my', protect, getMyTasks);
router.get('/project/:projectId', protect, getProjectTasks);
router.post('/', protect, taskValidator, validate, createTask);
router.put('/:id', protect, taskValidator, validate, updateTask);
router.patch('/:id/status', protect, updateTaskStatus);
router.delete('/:id', protect, deleteTask);

export default router;
