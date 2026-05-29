import { body } from 'express-validator';

const registerValidator = [
	body('name')
		.trim()
		.notEmpty().withMessage('Name is required')
		.isLength({ max: 100 }).withMessage('Max 100 chars'),

	body('email')
		.isEmail().withMessage('Valid email required')
		.normalizeEmail(),

	body('password')
		.isLength({ min: 6 }).withMessage('Min 6 characters'),
];

const loginValidator = [
	body('email')
		.isEmail().withMessage('Valid email required'),

	body('password')
		.notEmpty().withMessage('Password is required'),
];

export {
	registerValidator,
	loginValidator,
};
