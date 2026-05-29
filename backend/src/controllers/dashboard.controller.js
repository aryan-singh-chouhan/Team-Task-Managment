import * as dashboardModel from '../models/dashboard.model.js';
import { successResponse, errorResponse } from '../utils/response.utils.js';

async function getDashboard(req, res) {
	try {
		const userId = req.user.id;
		const statsRow = await dashboardModel.getStatsByUserMembership(userId);

		const [statusRows, recentRows, overdueRows] = await Promise.all([
			dashboardModel.getStatusBreakdownByAssignee(userId),
			dashboardModel.getRecentTasksByUserMembership(userId),
			dashboardModel.getOverdueTasksByUserMembership(userId),
		]);

		const total_projects = Number(statsRow?.total_projects || 0);
		const total_tasks = Number(statsRow?.total_tasks || 0);
		const my_tasks = Number(statsRow?.my_tasks || 0);
		const overdue_tasks = Number(statsRow?.overdue_tasks || 0);

		const status_breakdown = statusRows.map((row) => ({
			status: row.status,
			count: Number(row.count || 0),
		}));

		return successResponse(res, 'Dashboard retrieved successfully', {
			stats: {
				total_projects,
				total_tasks,
				my_tasks,
				overdue_tasks,
			},
			status_breakdown,
			recent_tasks: recentRows,
			overdue_list: overdueRows,
		});
	} catch (error) {
		return errorResponse(res, 'Failed to get dashboard', 500);
	}
}

export {
	getDashboard,
};
