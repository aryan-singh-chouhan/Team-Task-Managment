import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { CheckSquare, AlertTriangle } from 'lucide-react';

import { getMyTasks, deleteTask, updateTaskStatus, updateTask } from '../../api/task.api';
import TaskBoard from '../../components/tasks/TaskBoard';
import TaskForm from '../../components/tasks/TaskForm';
import Modal from '../../components/common/Modal';
import PageSkeleton from '../../components/common/PageSkeleton';
import Button from '../../components/common/Button';
import useAuth from '../../hooks/useAuth';
import { useProjects } from '../../hooks/useProjects';

const MyTasks = () => {
  const { user } = useAuth();
  const { currentProject, loadProject, clearProject } = useProjects();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    let isActive = true;

    const loadTasks = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getMyTasks();

        if (!isActive) {
          return;
        }

        setTasks(response.data ?? []);
      } catch (err) {
        if (!isActive) {
          return;
        }

        const message = err?.response?.data?.message || 'Failed to load your tasks.';
        setError(message);
        toast.error(message);
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    loadTasks();

    return () => {
      isActive = false;
    };
  }, []);

  const handleStatusChange = useCallback(async (taskId, status) => {
    try {
      await updateTaskStatus(taskId, status);
      setTasks((currentTasks) =>
        currentTasks.map((task) =>
          String(task.id ?? task._id) === String(taskId) ? { ...task, status } : task
        )
      );
      toast.success('Task status updated.');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to update status.');
    }
  }, []);

  const handleEdit = useCallback(async (task) => {
    try {
      await loadProject(task.project_id);
      setEditingTask(task);
      setIsEditOpen(true);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to load task details.');
    }
  }, [loadProject]);

  const handleDelete = useCallback(async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }

    try {
      await deleteTask(taskId);
      setTasks((currentTasks) => currentTasks.filter((task) => String(task.id ?? task._id) !== String(taskId)));
      toast.success('Task deleted successfully.');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to delete task.');
    }
  }, []);

  const handleTaskUpdate = useCallback(async (data) => {
    if (!editingTask) {
      return;
    }

    try {
      const taskId = editingTask.id ?? editingTask._id;
      await updateTask(taskId, data);
      setTasks(prev => prev.map(t => 
        String(t.id ?? t._id) === String(taskId) 
          ? { ...t, ...data } 
          : t
      ));
      setIsEditOpen(false);
      setEditingTask(null);
      clearProject();
      toast.success('Task updated successfully.');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to update task.');
    }
  }, [clearProject, editingTask]);

  const handleRetry = useCallback(() => {
    window.location.reload();
  }, []);

  if (loading) {
    return <PageSkeleton variant="tasks" />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <AlertTriangle className="w-16 h-16 text-red-500" />
        <h2 className="mt-4 text-2xl font-semibold text-gray-800">Could not load My Tasks</h2>
        <p className="mt-2 text-gray-600">{error}</p>
        <Button onClick={handleRetry} className="mt-6">
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 pt-2 pb-6">
      <header className="mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-violet-100">
            <CheckSquare className="h-6 w-6 text-violet-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">My Tasks</h1>
            <p className="text-sm text-slate-500">Tasks assigned to you across your projects</p>
          </div>
        </div>
      </header>

      <div>
        <TaskBoard
          tasks={tasks}
          onStatusChange={handleStatusChange}
          onEdit={handleEdit}
          onDelete={handleDelete}
          currentUserId={user?.id ?? user?._id}
          userRole={user?.role || 'member'}
        />
      </div>

      <Modal
        isOpen={isEditOpen}
        onClose={() => {
          setIsEditOpen(false);
          setEditingTask(null);
          clearProject();
        }}
        title="Edit Task"
      >
        <TaskForm
          onSubmit={handleTaskUpdate}
          defaultValues={editingTask || {}}
          members={currentProject?.members ?? []}
          projectId={editingTask?.project_id}
          isEdit
        />
      </Modal>
    </div>
  );
};

export default MyTasks;