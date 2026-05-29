import React from 'react';

const SkeletonBlock = ({ className = '' }) => (
  <div className={`animate-pulse rounded-xl bg-slate-200/80 ${className}`} />
);

const CardSkeleton = ({ lines = 2 }) => (
  <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
    <SkeletonBlock className="h-5 w-32" />
    <SkeletonBlock className="mt-4 h-8 w-20" />
    {lines > 0 && (
      <div className="mt-4 space-y-2">
        {Array.from({ length: lines }).map((_, index) => (
          <SkeletonBlock
            key={index}
            className={index === lines - 1 ? 'h-3 w-3/4' : 'h-3 w-full'}
          />
        ))}
      </div>
    )}
  </div>
);

const ListSkeleton = ({ items = 4, itemClassName = 'h-16' }) => (
  <div className="space-y-3">
    {Array.from({ length: items }).map((_, index) => (
      <SkeletonBlock key={index} className={`rounded-2xl ${itemClassName}`} />
    ))}
  </div>
);

const PageSkeleton = ({ variant = 'route' }) => {
  if (variant === 'dashboard') {
    return (
      <div className="px-4 sm:px-6 lg:px-8 pt-2 pb-6 min-h-[calc(100vh-4rem)] overflow-x-hidden">
        <div className="space-y-3 mb-6">
          <SkeletonBlock className="h-8 w-40 sm:h-10 sm:w-72" />
          <SkeletonBlock className="h-4 w-56 sm:w-96" />
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4 lg:gap-5 mb-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <CardSkeleton key={index} lines={0} />
          ))}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-3">
          <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-3 min-h-[240px] sm:min-h-[320px]">
            <SkeletonBlock className="h-5 w-40" />
            <ListSkeleton items={4} itemClassName="h-16" />
          </div>
          <div className="lg:col-span-1 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-3 min-h-[240px] sm:min-h-[320px]">
            <SkeletonBlock className="h-5 w-36" />
            <ListSkeleton items={3} itemClassName="h-16" />
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'projects') {
    return (
      <div className="px-4 sm:px-6 lg:px-8 pt-2 pb-6 min-h-[calc(100vh-4rem)] overflow-x-hidden">
        <div className="flex items-center justify-between mb-4">
          <div className="space-y-2">
            <SkeletonBlock className="h-7 w-32 sm:h-8 sm:w-44" />
            <SkeletonBlock className="h-4 w-40 sm:w-56" />
          </div>
          <SkeletonBlock className="h-9 w-24 sm:h-10 sm:w-36 rounded-xl" />
        </div>

        <div className="mb-4 flex flex-wrap items-center gap-2">
          {Array.from({ length: 3 }).map((_, index) => (
            <SkeletonBlock key={index} className="h-9 w-20 rounded-xl" />
          ))}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-3">
              <SkeletonBlock className="h-5 w-3/5" />
              <SkeletonBlock className="h-3 w-full" />
              <SkeletonBlock className="h-3 w-4/5" />
              <div className="flex items-center justify-between pt-2">
                <SkeletonBlock className="h-6 w-20 rounded-full" />
                <SkeletonBlock className="h-4 w-14" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (variant === 'tasks') {
    return (
      <div className="px-4 sm:px-6 lg:px-8 pt-2 pb-6 min-h-[calc(100vh-4rem)] overflow-x-hidden">
        <div className="mb-4 space-y-2">
          <SkeletonBlock className="h-7 w-32 sm:h-8 sm:w-48" />
          <SkeletonBlock className="h-4 w-48 sm:w-72" />
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, columnIndex) => (
            <div key={columnIndex} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <SkeletonBlock className="h-5 w-24" />
              <div className="mt-4 space-y-3">
                {Array.from({ length: 4 }).map((__, itemIndex) => (
                  <div key={itemIndex} className="rounded-2xl border border-slate-100 bg-slate-50 p-4 space-y-3">
                    <SkeletonBlock className="h-4 w-3/4" />
                    <SkeletonBlock className="h-3 w-full" />
                    <div className="flex items-center justify-between">
                      <SkeletonBlock className="h-6 w-20 rounded-full" />
                      <SkeletonBlock className="h-8 w-8 rounded-full" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (variant === 'project-detail') {
    return (
      <div className="px-4 sm:px-6 lg:px-8 pt-2 pb-6 min-h-[calc(100vh-4rem)] overflow-x-hidden">
        <div className="mb-5 space-y-4">
          <SkeletonBlock className="h-4 w-32" />
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-2">
              <SkeletonBlock className="h-8 w-44 sm:h-9 sm:w-72" />
              <SkeletonBlock className="h-4 w-full max-w-64 sm:max-w-96" />
            </div>
            <div className="flex gap-2">
              <SkeletonBlock className="h-9 w-16 sm:h-10 sm:w-20 rounded-xl" />
              <SkeletonBlock className="h-9 w-20 sm:h-10 sm:w-24 rounded-xl" />
            </div>
          </div>
        </div>

        <div className="mb-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-3">
          <SkeletonBlock className="h-5 w-28" />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="rounded-2xl border border-slate-100 bg-slate-50 p-3 space-y-2">
                <SkeletonBlock className="h-4 w-24" />
                <SkeletonBlock className="h-3 w-full" />
                <SkeletonBlock className="h-3 w-3/4" />
              </div>
            ))}
          </div>
        </div>

        <div className="mb-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-3">
          <SkeletonBlock className="h-5 w-32" />
          <ListSkeleton items={3} itemClassName="h-14" />
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-4">
          <div className="flex items-center justify-between gap-3">
            <SkeletonBlock className="h-5 w-28" />
            <div className="flex gap-2">
              <SkeletonBlock className="h-9 w-16 rounded-xl" />
              <SkeletonBlock className="h-9 w-16 rounded-xl" />
              <SkeletonBlock className="h-9 w-16 rounded-xl" />
            </div>
          </div>
          <ListSkeleton items={4} itemClassName="h-20" />
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 pt-2 pb-6 min-h-[calc(100vh-4rem)] overflow-x-hidden">
      <div className="space-y-3">
        <SkeletonBlock className="h-8 w-40 sm:h-10 sm:w-72" />
        <SkeletonBlock className="h-4 w-56 sm:w-96" />
      </div>
      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <SkeletonBlock className="h-4 w-40" />
        <SkeletonBlock className="mt-4 h-24 w-full" />
        <SkeletonBlock className="mt-4 h-24 w-full" />
      </div>
    </div>
  );
};

export default PageSkeleton;