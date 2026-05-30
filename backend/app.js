import 'dotenv/config';

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

import { errorResponse } from './src/utils/response.utils.js';
import authRoutes from './src/routes/auth.routes.js';
import projectRoutes from './src/routes/project.routes.js';
import taskRoutes from './src/routes/task.routes.js';
import dashboardRoutes from './src/routes/dashboard.routes.js';
import userRoutes from './src/routes/user.routes.js';

const app = express();

const allowedOrigins = (process.env.CLIENT_URL || '')
	.split(',')
	.map(origin => origin.trim())
	.filter(Boolean);

const authLimiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: 60,
	message: { success: false, message: 'Too many attempts, try again later' },
});

const globalLimiter = rateLimit({
	windowMs: 1 * 60 * 1000,
	max: 500,
	message: { success: false, message: 'Too many requests, try again later' },
});

app.use(helmet());
app.use('/api/', globalLimiter);

app.set('trust proxy', 1);

app.use(
	cors({
		origin: (origin, callback) => {
			if (!origin) {
				return callback(null, true);
			}

			if (allowedOrigins.includes(origin)) {
				return callback(null, true);
			}

			return callback(new Error(`CORS blocked for origin: ${origin}`));
		},
		credentials: true,
	})
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/api/health', (req, res) => {
	res.json({ success: true, message: 'Server is running' });
});

app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/users', userRoutes);

app.use((req, res) => errorResponse(res, 'Route not found', 404));

app.use((err, req, res, next) => {
	console.error(err.stack);
	errorResponse(res, 'Internal server error', 500);
});

export default app;