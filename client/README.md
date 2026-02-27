# RBAC Demo - React Frontend

A full-featured React frontend for the RBAC (Role-Based Access Control) demo system with Material-UI and role-aware navigation.

## Features Implemented

### Backend Enhancement

- **New Endpoint**: `GET /auth/abilities` - Returns structured permissions for the current user
  - Centralizes RBAC logic to prevent frontend/backend drift
  - Returns permissions for all resources (Employee, Department, Team, Note, ManagedDepartment)

### Frontend Features

#### Authentication & Authorization

- Login/Register pages with validation
- JWT token management with auto-injection
- Role-based UI enforcement (hide unauthorized elements)
- Protected routes with authentication guards

#### Navigation

- **Responsive Navbar** showing only accessible modules per role:
  - **CTO**: All modules
  - **TM**: Employees, Departments, Teams, Notes (in managed departments)
  - **RM**: Employees (direct reports only)
  - **Employee**: My Profile only
- Mobile-friendly drawer navigation

#### CRUD Modules

1. **Employees** - List, Create, Edit, Delete, Detail view
   - Salary field visible only to CTO
   - Role field editable by TM/CTO only
2. **Departments** - List, Create, Edit, Delete

3. **Teams** - List, Create, Edit, Delete

4. **Notes** - List, Create, Edit, Delete
   - Admin-only checkbox (TM/CTO can create admin-only notes)
   - Admin-only badge in list view

5. **Managed Departments** - Assign TMs to departments (CTO only)

6. **My Profile** - All users can edit their name and careerStartDate

## Setup

### Prerequisites

- Node.js 18+
- Backend server running on `http://localhost:3000`

### Installation

```bash
cd client
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`

## Usage

1. Register a new user or login with existing credentials
2. Navigate using the navbar based on your role
3. Each module respects RBAC permissions at UI level
4. All operations are validated by backend

## Technology Stack

- React 19 + TypeScript
- Material-UI (MUI) for components
- React Router for navigation
- Axios for API calls
- Context API for state management

## Project Structure

```
src/
├── api/                    # API clients
├── components/             # Reusable components (Navbar, Layout, etc.)
├── contexts/              # Auth & Snackbar contexts
├── pages/                 # Module pages (CRUD views)
├── types/                 # TypeScript types
├── App.tsx                # Main app with routing
└── main.tsx               # Entry point
```

## RBAC Rules

- **Field-level**: Salary (CTO only), Role (CTO/TM view, CTO/TM edit)
- **Admin-only notes**: Visible to CTO/TM only
- **UI enforcement**: Unauthorized buttons/routes hidden
- **Backend validation**: All permissions checked server-side
