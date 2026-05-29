import pool from '../config/db.js';

async function getStatsByUserMembership(userId) {
	const [rows] = await pool.execute(
		`SELECT
		COUNT(DISTINCT pm.project_id) AS total_projects,
		COUNT(t.id) AS total_tasks,
		SUM(CASE WHEN t.assigned_to = ? THEN 1 ELSE 0 END) AS my_tasks,
		SUM(CASE WHEN t.due_date < CURDATE() AND LOWER(t.status) != 'done' THEN 1 ELSE 0 END) AS overdue_tasks
		FROM project_members pm
		LEFT JOIN tasks t ON t.project_id = pm.project_id
		WHERE pm.user_id = ?`,
		[userId, userId]
	);

	return rows[0] || null;
}

async function getStatusBreakdownByAssignee(userId) {
	const [rows] = await pool.execute(
		'SELECT status, COUNT(*) as count FROM tasks WHERE assigned_to = ? GROUP BY status',
		[userId]
	);

	return rows;
}

async function getRecentTasksByUserMembership(userId) {
	const [rows] = await pool.execute(
		`SELECT t.*, p.name as project_name,
		u.name as assigned_to_name
		FROM tasks t
		JOIN projects p ON p.id = t.project_id
		JOIN project_members pm ON pm.project_id = t.project_id AND pm.user_id = ?
		LEFT JOIN users u ON u.id = t.assigned_to
		ORDER BY t.created_at DESC LIMIT 10`,
		[userId]
	);

	return rows;
}

async function getOverdueTasksByUserMembership(userId) {
	const [rows] = await pool.execute(
		`SELECT t.*, p.name as project_name,
		u.name as assigned_to_name
		FROM tasks t
		JOIN projects p ON p.id = t.project_id
		JOIN project_members pm ON pm.project_id = t.project_id AND pm.user_id = ?
		LEFT JOIN users u ON u.id = t.assigned_to
		WHERE t.due_date < CURDATE() AND LOWER(t.status) != 'done'
		ORDER BY t.due_date ASC LIMIT 5`,
		[userId]
	);

	return rows;
}

export {
	getStatsByUserMembership,
	getStatusBreakdownByAssignee,
	getRecentTasksByUserMembership,
	getOverdueTasksByUserMembership,
};