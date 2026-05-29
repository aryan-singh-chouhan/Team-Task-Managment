import React from 'react';

const colorSchemes = {
  violet: {
    bg: 'bg-gradient-to-br from-violet-600 to-indigo-700',
    iconBg: 'bg-white/15',
    ring: 'ring-violet-400/20',
  },
  emerald: {
    bg: 'bg-gradient-to-br from-emerald-500 to-teal-700',
    iconBg: 'bg-white/15',
    ring: 'ring-emerald-400/20',
  },
  amber: {
    bg: 'bg-gradient-to-br from-amber-500 to-orange-600',
    iconBg: 'bg-white/15',
    ring: 'ring-amber-400/20',
  },
  red: {
    bg: 'bg-gradient-to-br from-rose-500 to-red-700',
    iconBg: 'bg-white/15',
    ring: 'ring-rose-400/20',
  },
};

const StatsCard = React.memo(({ title, value, icon: Icon, color = 'violet', description, index = 0 }) => {
  const scheme = colorSchemes[color] || colorSchemes.violet;

  return (
    <div
      className={`stats-card ${scheme.bg} animate-card-in`}
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div className="absolute top-0 right-0 w-20 h-20 sm:w-24 sm:h-24 bg-white/10 rounded-full -translate-y-8 translate-x-8" />
      <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-full translate-y-6 -translate-x-6" />

      <div className="relative">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-white/75 text-xs sm:text-sm font-medium">{title}</p>
            <p className="text-2xl sm:text-3xl font-bold mt-1 tabular-nums text-white">{value ?? 0}</p>
            {description && <p className="text-white/60 text-xs mt-1 hidden sm:block">{description}</p>}
          </div>
          {Icon && (
            <div className={`${scheme.iconBg} p-2 sm:p-2.5 rounded-xl backdrop-blur-sm`}>
              <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

StatsCard.displayName = 'StatsCard';
export default StatsCard;
