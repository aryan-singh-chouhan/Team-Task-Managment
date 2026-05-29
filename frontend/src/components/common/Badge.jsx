import React from 'react';

const colorMap = {
  violet:  'bg-primary-100 text-primary-700',
  purple:  'bg-primary-100 text-primary-700',
  green:   'bg-accent-100 text-accent-600',
  emerald: 'bg-accent-100 text-accent-600',
  red:     'bg-danger-100 text-danger-600',
  rose:    'bg-danger-100 text-danger-600',
  amber:   'bg-warning-100 text-warning-600',
  yellow:  'bg-warning-100 text-warning-600',
  blue:    'bg-blue-100 text-blue-700',
  gray:    'bg-slate-100 text-slate-600',
  slate:   'bg-slate-100 text-slate-600',
  indigo:  'bg-indigo-100 text-indigo-700',
  admin:   'bg-primary-100 text-primary-700',
  member:  'bg-slate-100 text-slate-600',
  manager: 'bg-accent-100 text-accent-700',
};

const Badge = React.memo(({ children, color = 'gray', size = 'sm' }) => {
  const colorClass = colorMap[color] || colorMap.gray;
  const sizeClass = size === 'sm' ? 'text-xs px-2.5 py-0.5' : 'text-sm px-3 py-1';

  return (
    <span className={`inline-flex items-center font-semibold rounded-full ${colorClass} ${sizeClass}`}>
      {children}
    </span>
  );
});

Badge.displayName = 'Badge';
export default Badge;
