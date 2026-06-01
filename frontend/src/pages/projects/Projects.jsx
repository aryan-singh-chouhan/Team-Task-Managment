import { useState, useLayoutEffect, useCallback, useMemo } from 'react';
import { toast } from 'react-hot-toast';
import { useProjects } from '../../hooks/useProjects';
import useAuth from '../../hooks/useAuth';
import PageSkeleton from '../../components/common/PageSkeleton';
import ProjectCard from '../../components/projects/ProjectCard';
import Modal from '../../components/common/Modal';
import ProjectForm from '../../components/projects/ProjectForm';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import { Plus, Folder } from 'lucide-react';

const ROLE_FILTERS = ['all', 'admin', 'member'];

export const Projects = () => {
  const {
    projects,
    loading,
    error,
    loadProjects,
    addProject,
    removeProject,
  } = useProjects();
  const { user } = useAuth();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [roleFilter, setRoleFilter] = useState('all');

  useLayoutEffect(() => {
    loadProjects();
  }, []); 

  const filteredProjects = useMemo(() => {
    if (roleFilter === 'all') {
      return projects;
    }

    return projects.filter((project) => project.my_role === roleFilter);
  }, [projects, roleFilter]);

  const handleCreateProject = async (data) => {
    try {
      await addProject(data);
      toast.success('Project created successfully!');
      setIsCreateModalOpen(false);
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
        err?.message ||
        'Something went wrong'
      );
    }
  };

  const handleDelete = useCallback(
    async (id) => {
      if (window.confirm('Are you sure you want to delete this project?')) {
        try {
          await removeProject(id);
          toast.success('Project deleted successfully');
        } catch (err) {
          toast.error(
            err?.response?.data?.message ||
            err?.message ||
            'Something went wrong'
          );
        }
      }
    },
    [removeProject]
  );

  if (loading) {
    return <PageSkeleton variant="projects" />;
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-8">
        <p>Error: {error}</p>
        <Button onClick={loadProjects} className="mt-4">Retry</Button>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 pt-2 pb-6 bg-slate-50 min-h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-semibold text-slate-900">My Projects</h1>
          <Badge color="violet">{projects.length}</Badge>
        </div>
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2"
        >
          <Plus className="h-5 w-5" />
          <span className="hidden sm:inline">New Project</span>
        </Button>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        {ROLE_FILTERS.map((filter) => (
          <Button
            key={filter}
            type="button"
            variant={roleFilter === filter ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setRoleFilter(filter)}
            className="capitalize"
          >
            {filter}
          </Button>
        ))}
      </div>

      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
          {filteredProjects.map((project, idx) => {
            const projectId = project._id ?? project.id;

            return (
              <ProjectCard
                key={projectId}
                project={project}
                onDelete={() => handleDelete(projectId)}
                currentUser={user}
                index={idx}
              />
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 rounded-2xl bg-white border-2 border-dashed border-slate-200">
          <Folder className="mx-auto h-12 w-12 text-slate-400" />
          <h3 className="mt-2 text-sm font-medium text-slate-900">
            {roleFilter === 'all' ? 'No projects yet' : `No ${roleFilter} projects yet`}
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Get started by creating your first project.
          </p>
        </div>
      )}

      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Project"
      >
        <ProjectForm onSubmit={handleCreateProject} />
      </Modal>
    </div>
  );
};

export default Projects;
