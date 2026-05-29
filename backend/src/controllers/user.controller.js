import * as userModel from '../models/user.model.js';
import { successResponse, errorResponse } from '../utils/response.utils.js';

async function searchUser(req, res) {
	try {
		const email = req.query.email;
		const currentUserId = req.user && req.user.id ? req.user.id : 0;

		if (!email) {
			return successResponse(res, 'Users retrieved successfully', []);
		}

		const rows = await userModel.searchByEmail(email, currentUserId);

		return successResponse(res, 'Users retrieved successfully', rows);
	} catch (error) {
		return errorResponse(res, 'Failed to search users', 500);
	}
}

export {
	searchUser,
};
