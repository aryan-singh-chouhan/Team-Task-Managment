import React, { useState, useMemo } from 'react';
import TaskCard from './TaskCard';
import { TASK_STATUS, STATUS_LABELS } from '../../utils/constants';

const TAB_COLORS = {
  all: {
    active: 'bg-violet-600 text-white shadow-sm ring-1 ring-violet-900/10',
    inactive: 'text-slate-600 hover:bg-slate-100',
    badge: 'slate',
  },
  [TASK_STATUS.TODO]: {
    active: 'bg-slate-900 text-white shadow-sm ring-1 ring-slate-900/10',
    inactive: 'text-slate-600 hover:bg-slate-100',
    badge: 'violet',
  },
  [TASK_STATUS.IN_PROGRESS]: {
    active: 'bg-indigo-700 text-white shadow-sm ring-1 ring-indigo-900/10',
    inactive: 'text-slate-600 hover:bg-slate-100',
    badge: 'blue',
  },
  [TASK_STATUS.DONE]: {
    active: 'bg-emerald-700 text-white shadow-sm ring-1 ring-emerald-900/10',
    inactive: 'text-slate-600 hover:bg-slate-100',
    badge: 'green',
  },
};

const TaskBoard = React.memo(({ tasks, onStatusChange, onEdit, onDelete, currentUserId, isAdmin, taskFilter, showTabs = true }) => {
  // default to 'all' so users see all tasks initially
  const [activeTab, setActiveTab] = useState('all');

  // Sync active tab with parent filter when provided
  React.useEffect(() => {
    if (!taskFilter) return;
    // normalize incoming filter values (e.g., 'in-progress' -> 'in_progress')
    const normalized = String(taskFilter).trim().toLowerCase().replace(/[-\s]+/g, '_');
    if (normalized === 'all') {
      setActiveTab('all');
    } else if (Object.values(TASK_STATUS).includes(normalized)) {
      setActiveTab(normalized);
    }
  }, [taskFilter]);

  const filteredTasks = useMemo(() => {
    const todo = tasks.filter(task => task.status === TASK_STATUS.TODO);
    const inProgress = tasks.filter(task => task.status === TASK_STATUS.IN_PROGRESS);
    const done = tasks.filter(task => task.status === TASK_STATUS.DONE);
    return {
      [TASK_STATUS.TODO]: todo,
      [TASK_STATUS.IN_PROGRESS]: inProgress,
      [TASK_STATUS.DONE]: done,
    };
  }, [tasks]);

  const tabs = [
    { id: 'all', title: 'All', tasks },
    { id: TASK_STATUS.TODO, title: STATUS_LABELS.todo, tasks: filteredTasks.todo },
    { id: TASK_STATUS.IN_PROGRESS, title: STATUS_LABELS.in_progress, tasks: filteredTasks.in_progress },
    { id: TASK_STATUS.DONE, title: STATUS_LABELS.done, tasks: filteredTasks.done },
  ];

  const renderTaskList = (tasks) => (
    <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
      {tasks.length > 0 ? (
        tasks.map(task => (
          <TaskCard
            key={task.id}
            task={task}
            onStatusChange={onStatusChange}
            onEdit={onEdit}
            onDelete={onDelete}
            currentUserId={currentUserId}
            isAdmin={isAdmin}
          />
        ))
      ) : (
        <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-200 lg:col-span-2">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <p className="font-medium text-slate-600 text-sm">No tasks in this category</p>
          <p className="text-xs text-slate-400 mt-1">Tasks will appear here when added</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="w-full">
      {showTabs && (
        <div className="mb-4 rounded-2xl border border-slate-200 bg-white p-2">
          <div className="grid grid-cols-3 gap-2 sm:flex sm:gap-2">
            {tabs.map((tab) => {
              const colors = TAB_COLORS[tab.id] || { active: 'bg-slate-900 text-white', inactive: 'text-slate-600', badge: 'slate' };
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex w-full sm:w-auto sm:min-w-max items-center justify-center gap-1 px-2.5 sm:px-4 py-2.5 rounded-xl text-[9px] sm:text-sm font-semibold leading-tight transition-all duration-200 cursor-pointer whitespace-nowrap text-center ${
                    isActive ? colors.active : colors.inactive
                  }`}
                >
                  <span className="whitespace-nowrap">{tab.title}</span>
                  <span
                    className={`inline-flex items-center justify-center min-w-[18px] h-5 px-1 rounded-full text-[10px] font-bold ${
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {tab.tasks.length}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="animate-fade-in">{renderTaskList(tabs.find((t) => t.id === activeTab)?.tasks || [])}</div>
    </div>
  );
});

export default TaskBoard;
