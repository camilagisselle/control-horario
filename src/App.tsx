import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./pages/Login/Login";
import RecuperarPassword from "./pages/Recuperarcontrasena/Recuperarpassword";
import Registro from "./pages/Registros/Registro";
import Historial from "./pages/Historial/Historialpaginas";
import Perfil from "./pages/Perfil/Perfil";

// Admin pages
import AdminHistorial from "./pages/Admin/AdminHistorial";
import AdminUsuarios from "./pages/Admin/AdminUsuarios";
import AdminPerfil from "./pages/Admin/AdminPerfil";

// Layout
import Layout from "./Layout/Layout";
import AdminLayout from "./Layout/AdminLayout";

/**
 * RequireAuth:
 * - Checks session from localStorage ("user")
 * - If there's no session, redirects to login ("/")
 * - If a `role` is passed, and the role doesn't match, redirect to login
 */
const RequireAuth: React.FC<{
  role?: "admin" | "user";
  children: React.ReactElement;
}> = ({ role, children }) => {
  const stored =
    typeof window !== "undefined" ? localStorage.getItem("user") : null;

  if (!stored) return <Navigate to="/" replace />;

  try {
    const user = JSON.parse(stored) as { role?: string };
    if (role && user.role !== role) return <Navigate to="/" replace />;
  } catch {
    localStorage.removeItem("user");
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/recuperarpassword" element={<RecuperarPassword />} />

        {/* Routes with Layout for Regular Users */}
        <Route
          element={
            <RequireAuth>
              <Layout />
            </RequireAuth>
          }
        >
          <Route path="/registro" element={<Registro />} />
          <Route path="/historial" element={<Historial />} />
          <Route path="/perfil" element={<Perfil />} />
        </Route>

        {/* Admin Routes with AdminLayout */}
        <Route
          element={
            <RequireAuth role="admin">
              <AdminLayout />
            </RequireAuth>
          }
        >
          <Route path="/admin/usuarios" element={<AdminUsuarios />} />
          <Route path="/admin/historial" element={<AdminHistorial />} />
          <Route path="/admin/perfil" element={<AdminPerfil />} />
        </Route>

        {/* Catch-All: Redirect to Login */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
