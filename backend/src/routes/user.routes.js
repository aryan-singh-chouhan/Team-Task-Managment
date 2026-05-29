import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import { searchUser } from '../controllers/user.controller.js';

const router = express.Router();

router.get('/search', protect, searchUser);

export default router;
