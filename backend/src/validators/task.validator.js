import { body } from 'express-validator';

const taskValidator = [
	body('project_id')
		.if((value, { req }) => req.method === 'POST')
		.notEmpty().withMessage('Project ID is required')
		.bail()
		.isInt().withMessage('Project ID must be an integer'),

	body('title')
		.trim()
		.notEmpty().withMessage('Title is required')
		.isLength({ max: 200 }).withMessage('Max 200 chars'),

	body('status')
		.optional()
		.isIn(['todo', 'in_progress', 'done'])
		.withMessage('Invalid status'),

	body('priority')
		.optional()
		.isIn(['low', 'medium', 'high'])
		.withMessage('Invalid priority'),

	body('due_date')
		.optional({ nullable: true })
		.isDate().withMessage('Invalid date format'),
];

export {
	taskValidator,
};
