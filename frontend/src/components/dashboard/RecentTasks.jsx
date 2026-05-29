import React, { memo, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { List } from 'lucide-react';
import TaskStatusBadge from '../tasks/TaskStatusBadge';
import Badge from '../common/Badge';
import { formatDate, isOverdue } from '../../utils/formatDate';

const getTaskId = (task) => task?.id ?? task?._id;
const getProjectId = (task) => task?.project_id ?? task?.project?.id ?? task?.project?._id;
const getProjectName = (task) => task?.project_name ?? task?.project?.name ?? 'Project';
const getDueDate = (task) => task?.due_date ?? task?.dueDate;

const PRIORITY_DOT = {
  high: 'bg-red-500',
  medium: 'bg-amber-500',
  low: 'bg-emerald-500',
};

const RecentTasks = memo(({ tasks = [] }) => {
  const navigate = useNavigate();
  const recentTasks = tasks.slice(0, 10);

  const openProject = useCallback((projectId) => {
    if (projectId) {
      navigate(`/projects/${projectId}`);
    }
  }, [navigate]);

  const handleRowKeyDown = useCallback((event, projectId) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openProject(projectId);
    }
  }, [openProject]);

  if (recentTasks.length === 0) {
    return (
      <div className="p-8 text-center">
        <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3">
          <List className="h-7 w-7 text-slate-400" />
        </div>
        <h3 className="text-sm font-semibold text-slate-700">No recent tasks</h3>
        <p className="mt-1 text-sm text-slate-400">New tasks will appear here.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between px-4 sm:px-5 pt-4 pb-3">
        <h2 className="text-base font-semibold text-slate-800">Recent Tasks</h2>
        <span className="text-xs font-medium text-slate-400">{recentTasks.length} tasks</span>
      </div>
      
      {/* Mobile View — Card-based */}
      <div className="sm:hidden divide-y divide-slate-100">
        {recentTasks.map(task => (
          <Link
            to={`/projects/${getProjectId(task)}`}
            key={getTaskId(task)}
            className="block px-4 py-3 transition-colors hover:bg-violet-50/50 active:bg-violet-100/50"
          >
            <div className="flex justify-between items-start gap-2">
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-sm text-slate-800 truncate">{task.title}</p>
                <p className="text-xs text-slate-400 mt-0.5">{getProjectName(task)}</p>
              </div>
              <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${PRIORITY_DOT[task.priority] || PRIORITY_DOT.medium}`} />
            </div>
            <div className="flex justify-between items-center mt-2">
              <TaskStatusBadge status={task.status} />
              <span className={`text-xs ${isOverdue(getDueDate(task)) ? 'text-red-600 font-semibold' : 'text-slate-400'}`}>
                {formatDate(getDueDate(task))}
              </span>
            </div>
          </Link>
        ))}
      </div>

      {/* Desktop View — Table */}
      <div className="hidden sm:block">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-slate-100">
              <th scope="col" className="px-5 py-2.5 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Title</th>
              <th scope="col" className="px-5 py-2.5 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Project</th>
              <th scope="col" className="px-5 py-2.5 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
              <th scope="col" className="px-5 py-2.5 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Priority</th>
              <th scope="col" className="px-5 py-2.5 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Due Date</th>
            </tr>
          </thead>
          <tbody>
            {recentTasks.map(task => (
              <tr
                key={getTaskId(task)}
                role="link"
                tabIndex={0}
                aria-label={`Open project ${getProjectName(task)}`}
                onClick={() => openProject(getProjectId(task))}
                onKeyDown={(event) => handleRowKeyDown(event, getProjectId(task))}
                className="border-b border-slate-50 transition-colors table-row-hover group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-200 focus-visible:ring-inset"
              >
                <td className="px-5 py-3 whitespace-nowrap">
                  <Link to={`/projects/${getProjectId(task)}`} className="text-sm font-medium text-violet-600 hover:text-violet-800 transition-colors">
                    {task.title}
                  </Link>
                </td>
                <td className="px-5 py-3 whitespace-nowrap text-sm text-slate-500">{getProjectName(task)}</td>
                <td className="px-5 py-3 whitespace-nowrap">
                  <TaskStatusBadge status={task.status} />
                </td>
                <td className="px-5 py-3 whitespace-nowrap">
                  <div className="flex items-center gap-1.5">
                    <div className={`w-2 h-2 rounded-full ${PRIORITY_DOT[task.priority] || PRIORITY_DOT.medium}`} />
                    <span className="text-sm text-slate-600 capitalize">{task.priority}</span>
                  </div>
                </td>
                <td className={`px-5 py-3 whitespace-nowrap text-sm ${isOverdue(getDueDate(task)) ? 'text-red-600 font-semibold' : 'text-slate-500'}`}>
                  {formatDate(getDueDate(task))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
});

RecentTasks.displayName = 'RecentTasks';

export default RecentTasks;
