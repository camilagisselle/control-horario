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

// Layout
import Layout from "./Layout/Layout";

/**
 * RequireAuth:
 * - Lee la sesión desde localStorage ("user")
 * - Si no hay sesión redirige al login ("/")
 * - Si se pasa `role` y el rol no coincide, redirige al login
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
        {/* ================= PUBLIC ================= */}
        <Route path="/" element={<Login />} />
        <Route path="/recuperarpassword" element={<RecuperarPassword />} />

        {/* ================= PRIVATE CON LAYOUT ================= */}
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

          {/* ===== ADMIN ===== */}
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
        </Route>

        {/* ================= FALLBACK ================= */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
