import * as taskModel from '../models/task.model.js';
import * as memberModel from '../models/member.model.js';
import { successResponse, errorResponse } from '../utils/response.utils.js';

async function getProjectTasks(req, res) {
	try {
		const { projectId } = req.params;
		const role = await memberModel.getMemberRole(projectId, req.user.id);

		if (!role) {
			return errorResponse(res, 'Access denied', 403);
		}

		let tasks;
		if (role === 'member') {
			tasks = await taskModel.getByProjectAndAssignee(projectId, req.user.id);
		} else {
			tasks = await taskModel.getByProject(projectId);
		}
		return successResponse(res, 'Tasks retrieved successfully', tasks);
	} catch (error) {
		return errorResponse(res, 'Failed to get project tasks', 500);
	}
}

async function getMyTasks(req, res) {
	try {
		const tasks = await taskModel.getByAssignee(req.user.id);
		return successResponse(res, 'My tasks retrieved successfully', tasks);
	} catch (error) {
		return errorResponse(res, 'Failed to get my tasks', 500);
	}
}

async function createTask(req, res) {
	try {
		const {
			title,
			description,
			project_id,
			assigned_to,
			status,
			priority,
			due_date,
		} = req.body;

		const role = await memberModel.getMemberRole(project_id, req.user.id);

		if (!role) {
			return errorResponse(res, 'Access denied', 403);
		}

		if (role !== 'admin') {
			return errorResponse(res, 'Only an admin can make these changes.', 403);
		}

		if (assigned_to) {
			const assignedRole = await memberModel.getMemberRole(project_id, assigned_to);

			if (!assignedRole) {
				return errorResponse(res, 'Assigned user is not a project member', 400);
			}
		}

		const newTaskId = await taskModel.create({
			title,
			description,
			project_id,
			assigned_to: assigned_to || null,
			created_by: req.user.id,
			status: status || 'todo',
			priority: priority || 'medium',
			due_date: due_date || null,
		});

		return successResponse(res, 'Task created successfully', {
			id: newTaskId,
			title,
			project_id,
		}, 201);
	} catch (error) {
		return errorResponse(res, 'Failed to create task', 500);
	}
}

async function updateTask(req, res) {
	try {
		const { id: taskId } = req.params;
		const task = await taskModel.getById(taskId);

		if (!task) {
			return errorResponse(res, 'Task not found', 404);
		}

		const role = await memberModel.getMemberRole(task.project_id, req.user.id);

		if (role !== 'admin') {
			return errorResponse(res, 'Only an admin can make these changes.', 403);
		}

		const {
			title,
			description,
			assigned_to,
			status,
			priority,
			due_date,
		} = req.body;

		await taskModel.update(taskId, {
			title,
			description,
			assigned_to: assigned_to || null,
			status,
			priority,
			due_date: due_date || null,
		});

		return successResponse(res, 'Task updated');
	} catch (error) {
		return errorResponse(res, 'Failed to update task', 500);
	}
}

async function updateTaskStatus(req, res) {
	try {
		const { id: taskId } = req.params;
		const { status } = req.body;
		const task = await taskModel.getById(taskId);

		if (!task) {
			return errorResponse(res, 'Task not found', 404);
		}

		const role = await memberModel.getMemberRole(task.project_id, req.user.id);
		const isCreator = String(task.created_by) === String(req.user.id);
		const isAssignee = String(task.assigned_to) === String(req.user.id);

		if (role !== 'admin' && !isCreator && !isAssignee) {
			return errorResponse(res, 'You are not authorized to update this task.', 403);
		}

		if (!['todo', 'in_progress', 'done'].includes(status)) {
			return errorResponse(res, 'Invalid status', 400);
		}

		await taskModel.updateStatus(taskId, status);
		return successResponse(res, 'Status updated');
	} catch (error) {
		return errorResponse(res, 'Failed to update task status', 500);
	}
}

async function deleteTask(req, res) {
	try {
		const { id: taskId } = req.params;
		const task = await taskModel.getById(taskId);

		if (!task) {
			return errorResponse(res, 'Task not found', 404);
		}

		const role = await memberModel.getMemberRole(task.project_id, req.user.id);

		if (role !== 'admin') {
			return errorResponse(res, 'Only an admin can make these changes.', 403);
		}

		await taskModel.deleteById(taskId);
		return successResponse(res, 'Task deleted');
	} catch (error) {
		return errorResponse(res, 'Failed to delete task', 500);
	}
}

export {
	getProjectTasks,
	getMyTasks,
	createTask,
	updateTask,
	updateTaskStatus,
	deleteTask,
};
