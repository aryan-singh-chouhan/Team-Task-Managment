import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Users, Calendar, Trash2 } from 'lucide-react';
import { formatDate } from '../../utils/formatDate';
import Badge from '../common/Badge';

const GRADIENT_ACCENTS = [
  'linear-gradient(135deg, #8b5cf6, #6366f1)',
  'linear-gradient(135deg, #3b82f6, #2563eb)',
  'linear-gradient(135deg, #10b981, #059669)',
  'linear-gradient(135deg, #f59e0b, #d97706)',
  'linear-gradient(135deg, #ec4899, #db2777)',
  'linear-gradient(135deg, #06b6d4, #0891b2)',
];

const BG_HOVER_TINTS = [
  'hover:shadow-[0_12px_28px_-8px_rgba(139,92,246,0.18)]',
  'hover:shadow-[0_12px_28px_-8px_rgba(59,130,246,0.18)]',
  'hover:shadow-[0_12px_28px_-8px_rgba(16,185,129,0.18)]',
  'hover:shadow-[0_12px_28px_-8px_rgba(245,158,11,0.18)]',
  'hover:shadow-[0_12px_28px_-8px_rgba(236,72,153,0.18)]',
  'hover:shadow-[0_12px_28px_-8px_rgba(6,182,212,0.18)]',
];

const ProjectCard = React.memo(({ project, onDelete, index = 0 }) => {
  const { id, name, description, my_role, task_count, member_count, created_at } = project;
  const gradientIdx = (typeof index === 'number' ? index : 0) % GRADIENT_ACCENTS.length;

  return (
    <Link to={`/projects/${id}`} className="block group animate-card-in" style={{ animationDelay: `${gradientIdx * 60}ms` }}>
      <div className={`project-card h-full flex flex-col ${BG_HOVER_TINTS[gradientIdx]}`}>

        <div
          className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl transition-all duration-300 group-hover:h-1.5"
          style={{ background: GRADIENT_ACCENTS[gradientIdx] }}
        />

        <div className="flex items-start justify-between gap-2 mb-3 pt-1">
          <h3 className="font-semibold text-slate-900 group-hover:text-violet-600 transition-colors line-clamp-1 text-base">
            {name}
          </h3>
          <div className="flex items-center gap-2 flex-shrink-0">
            <Badge color={my_role === 'admin' ? 'violet' : 'gray'}>
              {my_role}
            </Badge>
            {my_role === 'admin' && (
              <button
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); onDelete(id); }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        <p className="text-sm text-slate-500 line-clamp-2 flex-1 mb-4">
          {description || 'No description'}
        </p>

        <div className="flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-100">
          <span className="flex items-center gap-1.5 group-hover:text-violet-500 transition-colors">
            <Briefcase className="w-3.5 h-3.5" />
            {task_count ?? 0} tasks
          </span>
          <span className="flex items-center gap-1.5 group-hover:text-indigo-500 transition-colors">
            <Users className="w-3.5 h-3.5" />
            {member_count ?? 0} members
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            {formatDate(created_at)}
          </span>
        </div>
      </div>
    </Link>
  );
});

ProjectCard.displayName = 'ProjectCard';
export default ProjectCard;