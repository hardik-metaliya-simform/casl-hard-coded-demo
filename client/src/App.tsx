import { Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Layout } from "./components/Layout";
import { Notifications } from "./components/Notifications";

// Auth pages
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Dashboard } from "./pages/Dashboard";
import { MyProfile } from "./pages/MyProfile";

// Employee pages
import { EmployeeList } from "./pages/Employees/EmployeeList";
import { EmployeeForm } from "./pages/Employees/EmployeeForm";
import { EmployeeDetail } from "./pages/Employees/EmployeeDetail";

// Department pages
import { DepartmentList } from "./pages/Departments/DepartmentList";
import { DepartmentForm } from "./pages/Departments/DepartmentForm";

// Team pages
import { TeamList } from "./pages/Teams/TeamList";
import { TeamForm } from "./pages/Teams/TeamForm";

// Note pages
import { NoteList } from "./pages/Notes/NoteList";
import { NoteForm } from "./pages/Notes/NoteForm";

// Managed Department pages
import { ManagedDepartmentList } from "./pages/ManagedDepartments/ManagedDepartmentList";
import { ManagedDepartmentForm } from "./pages/ManagedDepartments/ManagedDepartmentForm";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Notifications />
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Layout>
                <MyProfile />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Employee routes */}
        <Route
          path="/employees"
          element={
            <ProtectedRoute>
              <Layout>
                <EmployeeList />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/employees/new"
          element={
            <ProtectedRoute>
              <Layout>
                <EmployeeForm />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/employees/:id"
          element={
            <ProtectedRoute>
              <Layout>
                <EmployeeDetail />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/employees/:id/edit"
          element={
            <ProtectedRoute>
              <Layout>
                <EmployeeForm />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Department routes */}
        <Route
          path="/departments"
          element={
            <ProtectedRoute>
              <Layout>
                <DepartmentList />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/departments/new"
          element={
            <ProtectedRoute>
              <Layout>
                <DepartmentForm />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/departments/:id/edit"
          element={
            <ProtectedRoute>
              <Layout>
                <DepartmentForm />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Team routes */}
        <Route
          path="/teams"
          element={
            <ProtectedRoute>
              <Layout>
                <TeamList />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/teams/new"
          element={
            <ProtectedRoute>
              <Layout>
                <TeamForm />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/teams/:id/edit"
          element={
            <ProtectedRoute>
              <Layout>
                <TeamForm />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Note routes */}
        <Route
          path="/notes"
          element={
            <ProtectedRoute>
              <Layout>
                <NoteList />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/notes/new"
          element={
            <ProtectedRoute>
              <Layout>
                <NoteForm />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/notes/:id/edit"
          element={
            <ProtectedRoute>
              <Layout>
                <NoteForm />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Managed Department routes */}
        <Route
          path="/managed-departments"
          element={
            <ProtectedRoute>
              <Layout>
                <ManagedDepartmentList />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/managed-departments/new"
          element={
            <ProtectedRoute>
              <Layout>
                <ManagedDepartmentForm />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/managed-departments/:id/edit"
          element={
            <ProtectedRoute>
              <Layout>
                <ManagedDepartmentForm />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Catch all - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
