# TaskFlow — Team Task Manager

A full-stack web app where teams can create projects, assign tasks, and track progress together. Built as a full-stack assessment project.

**Live App:** https://frontend-production-41a3.up.railway.app

---

## What it does

- Anyone can sign up and create their own account
- When you create a project, you automatically become the Admin of that project
- As Admin, you can add team members to your project using their email
- Members can create and update tasks inside the project
- Every project is completely private — only people you invite can see it
- Multiple teams can use the same app without seeing each other's data

---

## Role System

There are only 2 roles, and they are per project (not global):

**Admin (Team Leader)**
- Create and delete the project
- Add or remove members
- Create, edit, and delete any task

**Member**
- View the project and its tasks
- Create tasks and assign them to teammates
- Edit or delete only their own tasks
- Update task status (Todo → In Progress → Done)

---

## Features

- Signup and Login with JWT stored in HTTP-only cookies
- Dashboard with stats — total projects, tasks, my tasks, overdue count
- Create multiple projects, each with its own team
- Add members by searching their email
- Kanban-style task board — Todo, In Progress, Done
- Task priority levels — Low, Medium, High
- Due dates with overdue highlighting
- My Tasks page — see all tasks assigned to you across projects
- Fully responsive — works on mobile and desktop

---

## Tech Stack

**Backend**
- Node.js + Express
- MySQL (hosted on Railway)
- JWT for authentication (stored in cookies)
- bcryptjs for password hashing

**Frontend**
- React.js (Vite)
- Redux Toolkit + RTK for state management
- Tailwind CSS for styling
- Axios for API calls
- React Hook Form
- React Hot Toast

---

## Project Structure

```
team-task-manager/
├── backend/
│   ├── src/
│   │   ├── config/          # DB connection + schema
│   │   ├── controllers/     # Business logic
│   │   ├── middleware/       # Auth + role checks
│   │   ├── models/          # MySQL query wrappers
│   │   ├── routes/          # API route definitions
│   │   ├── utils/           # JWT, hash, response helpers
│   │   └── validators/      # Input validation rules
│   ├── app.js
│   └── server.js
│
└── frontend/
    └── src/
        ├── api/             # All axios API calls
        ├── app/             # Redux store
        ├── components/      # Reusable UI components
        ├── context/         # Auth context
        ├── features/        # Redux slices
        ├── hooks/           # Custom hooks
        ├── pages/           # Page components
        └── utils/           # Helper functions
```

---

## API Endpoints

```
Auth
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/auth/me

Projects
GET    /api/projects
POST   /api/projects
GET    /api/projects/:id
PUT    /api/projects/:id
DELETE /api/projects/:id

Members
POST   /api/projects/:id/members
DELETE /api/projects/:id/members/:uid

Tasks
GET    /api/tasks/project/:projectId
GET    /api/tasks/my
POST   /api/tasks
PUT    /api/tasks/:id
PATCH  /api/tasks/:id/status
DELETE /api/tasks/:id

Dashboard
GET    /api/dashboard

Users
GET    /api/users/search?email=
```

---

## Running Locally

**1. Clone the repo**
```bash
git clone https://github.com/aryan-singh-chouhan/Team-Task-Managment
cd Team-Task-Managment
```

**2. Setup Backend**
```bash
cd backend
npm install
```

Create a `.env` file in the backend folder:
```
PORT=5000
DB_HOST=your_mysql_host
DB_PORT=3306
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=task_manager_db
DB_SSL=false
JWT_SECRET=your_secret_key_min_32_chars
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

Run the SQL schema to create tables (use MySQL Workbench or CLI):
```bash
# Run the file: backend/src/config/schema.sql
```

Start the backend:
```bash
npm run dev
```

**3. Setup Frontend**
```bash
cd frontend
npm install
```

Create a `.env` file in the frontend folder:
```
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:
```bash
npm run dev
```

**4. Open the app**
```
http://localhost:5173
```

---

## How to Use

1. Go to the live URL or run locally
2. Create an account (Sign up)
3. Create a new project — you'll be the Admin
4. Go to the project and add team members using their email (they need to register first)
5. Create tasks and assign them to members
6. Team members can log in and update task status
7. Dashboard shows a summary of everything

---

## Database Schema

```sql
users           — id, name, email, password
projects        — id, name, description, owner_id
project_members — id, project_id, user_id, role
tasks           — id, title, description, project_id,
                  assigned_to, created_by, status,
                  priority, due_date
```

---

## Deployment

Both frontend and backend are deployed on **Railway**.

- Backend runs as a Node.js service
- Frontend runs as a static Vite build
- MySQL database is also hosted on Railway

---

## Author

**Aryan Singh Chouhan**
GitHub: https://github.com/aryan-singh-chouhan

---
