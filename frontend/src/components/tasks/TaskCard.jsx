import React, { useState, useRef, useEffect } from 'react';
import { Calendar, User, MoreVertical, Pencil, Trash2, AlertCircle, PlayCircle, CheckCircle2, ArrowLeftCircle } from 'lucide-react';
import TaskStatusBadge from './TaskStatusBadge';
import { formatDate } from '../../utils/formatDate';
import { TASK_STATUS } from '../../utils/constants';

const PRIORITY_STYLES = {
  low: {
    label: 'Low',
    badge: 'text-emerald-700 bg-emerald-50 ring-1 ring-emerald-200',
    card: 'task-item priority-low',
  },
  medium: {
    label: 'Medium',
    badge: 'text-amber-700 bg-amber-50 ring-1 ring-amber-200',
    card: 'task-item priority-medium',
  },
  high: {
    label: 'High',
    badge: 'text-red-700 bg-red-50 ring-1 ring-red-200',
    card: 'task-item priority-high',
  },
};

const STATUS_NEXT = {
  [TASK_STATUS.TODO]:        [TASK_STATUS.IN_PROGRESS],
  [TASK_STATUS.IN_PROGRESS]: [TASK_STATUS.TODO, TASK_STATUS.DONE],
  [TASK_STATUS.DONE]:        [TASK_STATUS.IN_PROGRESS],
};

const STATUS_LABEL = {
  [TASK_STATUS.TODO]: 'Start',
  [TASK_STATUS.IN_PROGRESS]: 'Mark Done',
  [TASK_STATUS.DONE]: 'Reopen',
};

const TaskCard = React.memo(({ task, onStatusChange, onEdit, onDelete, currentUserId, isAdmin }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const { id, title, description, status, priority, due_date, assigned_to, assigned_to_name, created_by } = task;

  const isOverdue = due_date && new Date(due_date) < new Date() && status !== TASK_STATUS.DONE;
  const canEditDelete = isAdmin || String(created_by) === String(currentUserId);
  const canChangeStatus = canEditDelete || String(assigned_to) === String(currentUserId);
  const pStyle = PRIORITY_STYLES[priority] || PRIORITY_STYLES.medium;
  const nextStatuses = STATUS_NEXT[status] || [];

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className={`${pStyle.card} animate-fade-in`}>
      <div className="mb-2 flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0 flex-1 flex-wrap">
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ${pStyle.badge}`}>
            {pStyle.label}
          </span>
          <h4 className="text-sm font-semibold text-slate-800 leading-snug truncate">
            {title}
          </h4>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <TaskStatusBadge status={status} />
          {canEditDelete && (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <MoreVertical className="w-4 h-4" />
              </button>
              {menuOpen && (
                <div className="absolute right-0 top-full mt-1 w-36 bg-white rounded-xl shadow-modal border border-slate-100 py-1 z-10 animate-fade-in">
                  <button
                    onClick={() => { onEdit(task); setMenuOpen(false); }}
                    className="w-full flex items-center gap-2.5 px-3.5 py-2 text-sm text-slate-700 hover:bg-violet-50 hover:text-violet-700 transition-colors cursor-pointer"
                  >
                    <Pencil className="w-3.5 h-3.5" /> Edit
                  </button>
                  <button
                    onClick={() => { onDelete(id); setMenuOpen(false); }}
                    className="w-full flex items-center gap-2.5 px-3.5 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {description && (
        <p className="text-sm text-slate-500 line-clamp-2 mb-2.5">{description}</p>
      )}

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs sm:text-sm">
        <span className="flex items-center gap-1.5 text-slate-500">
          <User className="w-3.5 h-3.5 text-slate-400" />
          <span className={`font-medium ${assigned_to_name ? 'text-slate-700' : 'text-slate-400 italic'}`}>
            {assigned_to_name || 'Unassigned'}
          </span>
        </span>

        {due_date && (
          <span className={`flex items-center gap-1.5 ${isOverdue ? 'text-red-600 font-semibold' : 'text-slate-500'}`}>
            <Calendar className="w-3.5 h-3.5" />
            {formatDate(due_date)}
            {isOverdue && <AlertCircle className="w-3 h-3 text-red-500" />}
          </span>
        )}
      </div>

      {canChangeStatus && nextStatuses.length > 0 && (
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-100">
          {status === TASK_STATUS.IN_PROGRESS ? (
            <>
              <button
                onClick={() => onStatusChange(id, TASK_STATUS.TODO)}
                className="flex items-center justify-center gap-1.5 flex-1 text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
              >
                <ArrowLeftCircle className="w-3.5 h-3.5" />
                Re-Open
              </button>
              <button
                onClick={() => onStatusChange(id, TASK_STATUS.DONE)}
                className="flex items-center justify-center gap-1.5 flex-1 text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-colors shadow-sm cursor-pointer"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                Mark Done
              </button>
            </>
          ) : (
            nextStatuses.map((s) => (
              <button
                key={s}
                onClick={() => onStatusChange(id, s)}
                className="flex items-center justify-center gap-1.5 flex-1 text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-900 text-white transition-colors shadow-sm cursor-pointer"
              >
                {s === TASK_STATUS.IN_PROGRESS && <PlayCircle className="w-3.5 h-3.5" />}
                {s === TASK_STATUS.DONE && <CheckCircle2 className="w-3.5 h-3.5" />}
                {STATUS_LABEL[s] || s}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
});

TaskCard.displayName = 'TaskCard';
export default TaskCard;
