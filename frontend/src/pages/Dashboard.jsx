import { useLayoutEffect, useMemo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-hot-toast';
import { FolderKanban, CheckSquare, Clock, AlertTriangle, Sparkles } from 'lucide-react';

import {
  fetchDashboard,
  selectDashboardStats,
  selectDashboardLoading,
  selectDashboardError,
  selectRecentTasks,
  selectOverdueList,
} from '../features/dashboard/dashboardSlice';
import StatsCard from '../components/dashboard/StatsCard';
import RecentTasks from '../components/dashboard/RecentTasks';
import OverdueTasks from '../components/dashboard/OverdueTasks';
import PageSkeleton from '../components/common/PageSkeleton';
import useAuth from '../hooks/useAuth';
import Button from '../components/common/Button';

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
};

const Dashboard = () => {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const stats = useSelector(selectDashboardStats);
  const recentTasks = useSelector(selectRecentTasks);
  const overdueTasks = useSelector(selectOverdueList);
  const loading = useSelector(selectDashboardLoading);
  const error = useSelector(selectDashboardError);

  useLayoutEffect(() => {
    dispatch(fetchDashboard());
  }, [dispatch]);

  const handleRetry = useCallback(() => {
    dispatch(fetchDashboard());
  }, [dispatch]);

  useLayoutEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const greeting = useMemo(() => getGreeting(), []);

  const statsCards = useMemo(() => [
    {
      title: 'Total Projects',
      value: stats.total_projects,
      icon: FolderKanban,
      color: 'violet',
    },
    {
      title: 'Total Tasks',
      value: stats.total_tasks,
      icon: CheckSquare,
      color: 'emerald',
    },
    {
      title: 'My Tasks',
      value: stats.my_tasks,
      icon: Clock,
      color: 'amber',
      description: 'Assigned to me',
    },
    {
      title: 'Overdue',
      value: stats.overdue_tasks,
      icon: AlertTriangle,
      color: 'red',
      description: 'Need attention',
    },
  ], [stats]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-6 bg-slate-50">
        <AlertTriangle className="w-16 h-16 text-red-500" />
        <h2 className="mt-4 text-2xl font-semibold text-slate-800">
          Something went wrong
        </h2>
        <p className="mt-2 text-slate-600">{error}</p>
        <Button onClick={handleRetry} className="mt-6">
          Try Again
        </Button>
      </div>
    );
  }

  if (loading) {
    return <PageSkeleton variant="dashboard" />;
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 pt-2 pb-6 bg-slate-50 min-h-full">
      <header className="mb-5">
        <div className="relative z-10">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-slate-900">
            {greeting}, {user?.name}! <span className="inline-block animate-bounce">👋</span>
          </h1>
          <p className="mt-1 text-slate-500 text-sm sm:text-base font-medium">Here's what's happening with your projects today.</p>
        </div>
      </header>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 lg:gap-5 mb-6">
        {statsCards.map((stat, idx) => (
          <StatsCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            color={stat.color}
            description={stat.description}
            index={idx}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-3">
        <div className="lg:col-span-2 dashboard-section">
          <RecentTasks tasks={recentTasks} />
        </div>
        <div className="lg:col-span-1 dashboard-section">
          <OverdueTasks tasks={overdueTasks} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
