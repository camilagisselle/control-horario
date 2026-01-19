import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login/Login";
import RecuperarPassword from "./pages/Recuperarcontrasena/Recuperarpassword";
import Registro from "./pages/Registros/Registro";
import Historial from "./pages/Historial/Historialpaginas";
import Perfil from "./pages/Perfil/Perfil";

// Admin pages
import AdminHistorial from "./pages/Admin/AdminHistorial";
import AdminUsuarios from "./pages/Admin/AdminUsuarios";
import AdminPerfil from "./pages/Admin/AdminPerfil";

/**
 * RequireAuth:
 * - Checks session from localStorage ("user")
 * - If there's no session, redirects to login ("/")
 * - If a `role` is passed, and the role doesn't match, redirect to login
 */
const RequireAuth: React.FC<{ role?: "admin" | "user"; children: React.ReactElement }> = ({ role, children }) => {
  const stored = typeof window !== "undefined" ? localStorage.getItem("user") : null;
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

        {/* Routes for Normal Users */}
        <Route
          path="/registro"
          element={
            <RequireAuth role="user">
              <Registro />
            </RequireAuth>
          }
        />
        <Route
          path="/historial"
          element={
            <RequireAuth>
              <Historial />
            </RequireAuth>
          }
        />
        <Route
          path="/perfil"
          element={
            <RequireAuth>
              <Perfil />
            </RequireAuth>
          }
        />

        {/* Admin Only Routes */}
        <Route
          path="/admin/usuarios"
          element={
            <RequireAuth role="admin">
              <AdminUsuarios />
            </RequireAuth>
          }
        />
        <Route
          path="/admin/historial"
          element={
            <RequireAuth role="admin">
              <AdminHistorial />
            </RequireAuth>
          }
        />
        <Route
          path="/admin/perfil"
          element={
            <RequireAuth role="admin">
              <AdminPerfil />
            </RequireAuth>
          }
        />

        {/* Catch-All: Redirect to Login */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;