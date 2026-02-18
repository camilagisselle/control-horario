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

// Layout
import Layout from "./Layout/Layout";
import PublicRoute from "./auth/public.Route";
import RequireAuth from "./auth/require.Auth";
import RecupContrasena from "./pages/Recuperarcontrasena/Recupcontrasena";

function App() {
  return (
    <Router>
      <Routes>
        {/* PUBLICAS */}
        <Route
          path="/"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        <Route
          path="/recuperarpassword"
          element={
            <PublicRoute>
              <RecuperarPassword />
            </PublicRoute>
          }
        />

        <Route
          path="/recupcontrasena"
          element={
            <PublicRoute>
              <RecupContrasena />
            </PublicRoute>
          }
        />

        {/* PRIVADAS CON LAYOUT */}
        <Route
          element={
            <RequireAuth>
              <Layout />
            </RequireAuth>
          }
        >
          {/* USER */}
          <Route path="/registro" element={<Registro />} />
          <Route path="/historial" element={<Historial />} />
          <Route path="/perfil" element={<Perfil />} />

          {/* ADMIN */}
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

        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </Router>
  );
}

export default App;