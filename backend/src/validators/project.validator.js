import { body } from 'express-validator';

const projectValidator = [
	body('name')
		.trim()
		.notEmpty().withMessage('Project name is required')
		.isLength({ max: 100 }).withMessage('Max 100 chars'),

	body('description')
		.optional()
		.isLength({ max: 500 }).withMessage('Max 500 chars'),
];

export {
	projectValidator,
};
