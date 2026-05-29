import pool from '../config/db.js';
import { errorResponse } from '../utils/response.utils.js';

async function requireAdmin(req, res, next) {
	try {
		const projectId = req.params.id;
		const userId = req.user.id;

		const [rows] = await pool.execute(
			'SELECT role FROM project_members WHERE project_id = ? AND user_id = ?',
			[projectId, userId]
		);

		if (!rows.length) {
			return errorResponse(res, 'Not a project member', 403);
		}

		if (rows[0].role !== 'admin') {
			return errorResponse(res, 'Admin access required', 403);
		}

		return next();
	} catch (error) {
		return errorResponse(res, 'Admin access required', 403);
	}
}

export {
	requireAdmin,
};
