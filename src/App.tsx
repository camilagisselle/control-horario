import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// Public pages
import Login from "./pages/Login/Login";
import RecuperarPassword from "./pages/Recuperarcontrasena/Recuperarpassword";

// User pages
import Registro from "./pages/Registros/Registro";
import Historial from "./pages/Historial/Historialpaginas";
import Perfil from "./pages/Perfil/Perfil";

// Admin pages
import AdminUsuarios from "./pages/Admin/AdminUsuarios";
import AdminHistorial from "./pages/Admin/AdminHistorial";
import AdminPerfil from "./pages/Admin/AdminPerfil";
import { AuthProvider } from "./auth/auth.context"; 
// Layout único
import Layout from "./Layout/Layout";
/**
 * RequireAuth:
 * - Checks session from localStorage ("user")
 * - If there's no session, redirects to login ("/")
 * - If a `role` is passed, and the role doesn't match, redirect to login
 */
const RequireAuth: React.FC<{
  role?: "ROLE_ADMIN" | "ROLE_USER";
  children: React.ReactElement;
}> = ({ role, children }) => {
  const stored = localStorage.getItem("user");
  if (!stored) return <Navigate to="/" replace />;

  let user: { role?: string } | null = null;

  try {
    user = JSON.parse(stored);
  } catch {
    localStorage.removeItem("user");
    return <Navigate to="/" replace />;
  }

  if (role && user?.role !== role) return <Navigate to="/" replace />;

  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Login />} />
          <Route path="/recuperarpassword" element={<RecuperarPassword />} />

          {/* Todas las páginas protegidas usan el mismo Layout */}
          <Route
            element={
              <RequireAuth>
                <Layout />
              </RequireAuth>
            }
          >
            {/* User */}
            <Route path="/registro" element={<Registro />} />
            <Route path="/historial" element={<Historial />} />
            <Route path="/perfil" element={<Perfil />} />

            {/* Admin */}
            <Route
              path="/admin/usuarios"
              element={
                <RequireAuth role="ROLE_ADMIN">
                  <AdminUsuarios />
                </RequireAuth>
              }
            />
            <Route
              path="/admin/historial"
              element={
                <RequireAuth role="ROLE_ADMIN">
                  <AdminHistorial />
                </RequireAuth>
              }
            />
            <Route
              path="/admin/perfil"
              element={
                <RequireAuth role="ROLE_ADMIN">
                  <AdminPerfil />
                </RequireAuth>
              }
            />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
