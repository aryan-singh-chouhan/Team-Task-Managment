import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import PageSkeleton from './components/common/PageSkeleton';
import ProtectedRoute from './components/common/ProtectedRoute';
import Navbar from './components/common/Navbar';
import useAuth from './hooks/useAuth';

const Login = lazy(() => import('./pages/auth/Login'));
const Register = lazy(() => import('./pages/auth/Register'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const MyTasks = lazy(() => import('./pages/tasks/MyTasks'));
const Projects = lazy(() => import('./pages/projects/Projects'));
const ProjectDetail = lazy(() => import('./pages/projects/ProjectDetail'));
const NotFound = lazy(() => import('./pages/NotFound'));

const AppLayout = ({ children }) => (
  <div className="min-h-screen bg-slate-50">
    <Navbar />
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
      {children}
    </main>
  </div>
);

function App() {
  const { isAuthenticated } = useAuth();
  return (
    <div className="min-h-screen bg-slate-50">
      {isAuthenticated && <Navbar />}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <Suspense fallback={<PageSkeleton />}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/my-tasks" element={<ProtectedRoute><MyTasks /></ProtectedRoute>} />
            <Route path="/projects" element={<ProtectedRoute><Projects /></ProtectedRoute>} />
            <Route path="/projects/:id" element={<ProtectedRoute><ProjectDetail /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
    </div>
  );
}

export default App;