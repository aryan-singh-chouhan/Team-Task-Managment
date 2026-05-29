CREATE INDEX IF NOT EXISTS idx_project_members_user  ON project_members (user_id);
CREATE INDEX IF NOT EXISTS idx_project_members_proj  ON project_members (project_id);
CREATE INDEX IF NOT EXISTS idx_tasks_project         ON tasks (project_id);
CREATE INDEX IF NOT EXISTS idx_tasks_assigned_to     ON tasks (assigned_to);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date_status ON tasks (due_date, status);
CREATE INDEX IF NOT EXISTS idx_users_email           ON users (email);
