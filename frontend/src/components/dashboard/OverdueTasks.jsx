import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, CheckCircle } from 'lucide-react';
import TaskStatusBadge from '../tasks/TaskStatusBadge';
import { formatDate } from '../../utils/formatDate';

const getTaskId = (task) => task?.id ?? task?._id;
const getProjectId = (task) => task?.project_id ?? task?.project?.id ?? task?.project?._id;
const getProjectName = (task) => task?.project_name ?? task?.project?.name ?? 'Project';
const getDueDate = (task) => task?.due_date ?? task?.dueDate;

const OverdueTasks = memo(({ tasks = [] }) => {
  const overdueTasks = tasks.slice(0, 5);

  return (
    <div className="p-4 sm:p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-1.5 rounded-lg bg-red-100">
          <AlertTriangle className="h-4 w-4 text-red-600" />
        </div>
        <h2 className="text-base font-semibold text-slate-800">Overdue Tasks</h2>
        {overdueTasks.length > 0 && (
          <span className="ml-auto text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
            {overdueTasks.length}
          </span>
        )}
      </div>
      
      {overdueTasks.length === 0 ? (
        <div className="text-center py-6">
          <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-3">
            <CheckCircle className="h-7 w-7 text-emerald-500" />
          </div>
          <h3 className="text-sm font-semibold text-slate-700">All caught up!</h3>
          <p className="mt-1 text-xs text-slate-400">No overdue tasks. Keep it up! 🎉</p>
        </div>
      ) : (
        <ul className="space-y-2">
          {overdueTasks.map(task => (
            <li key={getTaskId(task)}>
              <Link
                to={`/projects/${getProjectId(task)}`}
                className="block p-3 rounded-xl border border-transparent transition-all duration-200 hover:bg-red-50/50 hover:border-red-100 hover:shadow-sm group"
              >
                <div className="flex justify-between items-start gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-sm text-slate-800 group-hover:text-red-700 transition-colors truncate">
                      {task.title}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">{getProjectName(task)}</p>
                  </div>
                  <TaskStatusBadge status={task.status} />
                </div>
                <p className="text-xs font-semibold text-red-600 mt-2 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                  Due: {formatDate(getDueDate(task))}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
});

OverdueTasks.displayName = 'OverdueTasks';

export default OverdueTasks;
