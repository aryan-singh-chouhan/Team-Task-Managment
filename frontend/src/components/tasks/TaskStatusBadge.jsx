import React from 'react';

const STATUS_CONFIG = {
  todo:        { label: 'To Do',       class: 'bg-slate-100 text-slate-600 ring-1 ring-slate-200' },
  in_progress: { label: 'In Progress', class: 'bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200' },
  done:        { label: 'Done',        class: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200' },
};

const TaskStatusBadge = React.memo(({ status }) => {
  const config = STATUS_CONFIG[status] || { label: status, class: 'bg-slate-100 text-slate-500' };
  return (
    <span className={`inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full ${config.class}`}>
      {config.label}
    </span>
  );
});

TaskStatusBadge.displayName = 'TaskStatusBadge';
export default TaskStatusBadge;
