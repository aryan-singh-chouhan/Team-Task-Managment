import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import { requireAdmin } from '../middleware/role.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { projectValidator } from '../validators/project.validator.js';
import {
	getProjects,
	getProject,
	createProject,
	updateProject,
	deleteProject,
	addMember,
	removeMember,
} from '../controllers/project.controller.js';

const router = express.Router();

router.get('/', protect, getProjects);
router.post('/', protect, projectValidator, validate, createProject);
router.get('/:id', protect, getProject);
router.put('/:id', protect, requireAdmin, projectValidator, validate, updateProject);
router.delete('/:id', protect, requireAdmin, deleteProject);
router.post('/:id/members', protect, requireAdmin, addMember);
router.delete('/:id/members/:uid', protect, requireAdmin, removeMember);

export default router;
