import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useProjects } from '../../hooks/useProjects';
import { useTasks } from '../../hooks/useTasks';
import useAuth from '../../hooks/useAuth';
import Loader from '../../components/common/Loader';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import MemberList from '../../components/projects/MemberList';
import TaskBoard from '../../components/tasks/TaskBoard';
import TaskForm from '../../components/tasks/TaskForm';
import ProjectForm from '../../components/projects/ProjectForm';
import { ArrowLeft, Pencil, Plus } from 'lucide-react';

const TASK_FILTERS = ['all', 'todo', 'in-progress', 'done'];

const normalizeTaskStatus = (status) => String(status ?? '').trim().toLowerCase().replace(/[\s-]+/g, '_');

export const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const {
    currentProject,
    loading: projectLoading,
    error: projectError,
    loadProject,
    clearProject,
    editProject,
    removeProject,
    addMember,
    removeMember,
  } = useProjects();

  const {
    tasks,
    loading: tasksLoading,
    loadTasks,
    clearProjectTasks,
    addTask,
    editTask,
    removeTask,
    changeStatus,
  } = useTasks();

  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [isEditProjectOpen, setIsEditProjectOpen] = useState(false);
  const [taskFilter, setTaskFilter] = useState('all');
  const project = currentProject;
  const members = project?.members ?? [];
  const currentUserId = user?.id ?? user?._id;

  useEffect(() => {
    if (id) {
      loadProject(id);
      loadTasks(id);
    }
    return () => {
      clearProject();
      clearProjectTasks();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const isAdmin = project?.my_role === 'admin';

  const handleTaskFormSubmit = async (data) => {
    try {
      if (editingTask) {
        await editTask(editingTask.id ?? editingTask._id, data);
        toast.success('Task updated successfully!');
      } else {
        await addTask({ ...data, project_id: id });
        toast.success('Task created successfully!');
      }
      setIsTaskModalOpen(false);
      setEditingTask(null);
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
        err?.message ||
        'Something went wrong'
      );
    }
  };

  const handleEditProjectSubmit = async (data) => {
    try {
      await editProject(id, data);
      toast.success('Project updated successfully!');
      await loadProject(id);
      setIsEditProjectOpen(false);
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
        err?.message ||
        'Something went wrong'
      );
    }
  };

  const handleDeleteProject = async () => {
    if (window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      try {
        await removeProject(id);
        toast.success('Project deleted successfully.');
        navigate('/projects');
      } catch (err) {
        toast.error(
          err?.response?.data?.message ||
          err?.message ||
          'Something went wrong'
        );
      }
    }
  };

  const handleStatusChange = useCallback(async (taskId, status) => {
    try {
      await changeStatus(taskId, status);
      toast.success('Task status updated.');
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
        err?.message ||
        'Something went wrong'
      );
    }
  }, [changeStatus]);

  const handleTaskDelete = useCallback(async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await removeTask(taskId);
        toast.success('Task deleted successfully.');
      } catch (err) {
        toast.error(
          err?.response?.data?.message ||
          err?.message ||
          'Something went wrong'
        );
      }
    }
  }, [removeTask]);

  const openEditTaskModal = (task) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  const filteredTasks = tasks.filter(task => {
    if (taskFilter === 'all') return true;
    return normalizeTaskStatus(task.status) === normalizeTaskStatus(taskFilter);
  });

  // Ensure non-admin members only see tasks assigned to them as a client-side safeguard
  const displayedTasks = isAdmin ? filteredTasks : filteredTasks.filter(t => String(t.assigned_to) === String(currentUserId));

  // Render page layout immediately; show section-level loaders when data is loading
  if (projectError) {
    // Assuming 404 is returned for not found
    if (projectError.includes('404')) {
        navigate('/projects');
        return null;
    }
    return <div className="text-center text-red-500 p-8">Error loading project: {projectError}</div>;
  }
  if (!project) return null; // Or a not found component

  return (
    <div className="px-4 sm:px-6 lg:px-8 pt-2 pb-6">
      <div className="mb-5">
        <Link to="/projects" className="inline-flex items-center text-sm text-slate-500 hover:text-violet-600 transition-colors mb-3">
          <ArrowLeft className="h-4 w-4 mr-1.5" />
          Back to Projects
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            {projectLoading ? (
              <div className="animate-pulse">
                <div className="h-8 w-56 bg-slate-200 rounded-md mb-2" />
              </div>
            ) : (
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">{project.name}</h1>
            )}
            {!projectLoading && <Badge color={isAdmin ? 'green' : 'blue'}>{isAdmin ? 'Admin' : 'Member'}</Badge>}
          </div>
          {isAdmin && (
            <div className="flex items-center gap-2 mt-3 sm:mt-0">
              <Button variant="outline" onClick={() => setIsEditProjectOpen(true)}>
                <Pencil className="h-4 w-4 mr-1.5" /> Edit
              </Button>
              <Button variant="danger" onClick={handleDeleteProject}>
                 Delete
              </Button>
            </div>
          )}
        </div>
        {projectLoading ? (
          <div className="mt-2">
            <div className="h-3 w-80 bg-slate-200 rounded-md animate-pulse" />
          </div>
        ) : (
          project.description && (
            <p className="mt-2 text-slate-500 text-sm sm:text-base">{project.description}</p>
          )
        )}
      </div>

      {/* Members */}
      <div className="mb-5">
        <MemberList
          members={members}
          isAdmin={isAdmin}
          onAdd={async (memberData) => {
            try {
              await addMember(id, {
                email: memberData.email,
                role: memberData.role,
              });
              await loadProject(id);
              toast.success('Member added!');
            } catch (err) {
              toast.error(
                err?.response?.data?.message ||
                err?.message ||
                'Something went wrong'
              );
            }
          }}
          onRemove={async (memberId) => {
            try {
              await removeMember(id, memberId);
              await loadProject(id);
              toast.success('Member removed!');
            } catch (err) {
              toast.error(
                err?.response?.data?.message ||
                err?.message ||
                'Something went wrong'
              );
            }
          }}
        />
      </div>

      {/* Tasks */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-900">Tasks ({displayedTasks.length})</h2>
          <div className="flex flex-wrap items-center gap-2 mt-3 sm:mt-0">
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
              {TASK_FILTERS.map(filter => (
                <Button
                  key={filter}
                  size="sm"
                  variant={taskFilter === filter ? 'solid' : 'ghost'}
                  onClick={() => setTaskFilter(filter)}
                  className="capitalize"
                >
                  {filter.replace('-', ' ')}
                </Button>
              ))}
            </div>
            {isAdmin && (
              <Button onClick={() => setIsTaskModalOpen(true)}>
                <Plus className="h-5 w-5 mr-2" />
                Add Task
              </Button>
            )}
          </div>
        </div>
        {tasksLoading ? (
          <div className="min-h-[240px] flex items-center justify-center p-8">
            <Loader />
          </div>
        ) : (
          <TaskBoard
            tasks={displayedTasks}
            onStatusChange={handleStatusChange}
            onEdit={openEditTaskModal}
            onDelete={handleTaskDelete}
            currentUserId={currentUserId}
            isAdmin={isAdmin}
          />
        )}
      </div>

      {/* Task Modal */}
      <Modal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setEditingTask(null);
        }}
        title={editingTask ? 'Edit Task' : 'Create New Task'}
      >
        <TaskForm
          onSubmit={handleTaskFormSubmit}
          members={members}
          projectId={id}
          defaultValues={editingTask || {}}
          isEdit={!!editingTask}
          userRole={isAdmin ? 'admin' : 'member'}
        />
      </Modal>

      {/* Edit Project Modal */}
      <Modal
        isOpen={isEditProjectOpen}
        onClose={() => setIsEditProjectOpen(false)}
        title="Edit Project"
      >
        <ProjectForm
          onSubmit={handleEditProjectSubmit}
          defaultValues={project}
          isEdit
        />
      </Modal>
    </div>
  );
};

export default ProjectDetail;
