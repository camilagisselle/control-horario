import { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import "./AdminLayout.css";

const AdminLayout = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Obtener datos del admin desde localStorage
  const stored = typeof window !== "undefined" ? localStorage.getItem("user") : null;
  const adminData = stored
    ? (() => {
        try {
          const u = JSON.parse(stored) as { name?: string; email?: string };
          return { name: u?.name ?? "Francisca Andrade", email: u?.email ?? "admin@correo.cl" };
        } catch {
          return { name: "Francisca Andrade", email: "admin@correo.cl" };
        }
      })()
    : { name: "Francisca Andrade", email: "admin@correo.cl" };

  const adminAvatar = typeof window !== "undefined" ? localStorage.getItem("avatar") || "/avatar.jpeg" : "/avatar.jpeg";

  const cerrarSesion = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="admin-layout">
      {/* Header Superior */}
      <header className="admin-header">
        <div className="admin-header-left">
          {/* Avatar que abre el sidebar */}
          <img 
            src={adminAvatar} 
            alt="Avatar" 
            className="admin-avatar-img"
            onClick={() => setMenuOpen(!menuOpen)}
            title="Abrir menú lateral"
          />
          
          <div className="admin-title-section">
            <span className="admin-label">Administrador:</span>
            <span className="admin-name">{adminData.name}</span>
          </div>
        </div>
        <div className="admin-header-right">
          <img src="/krono2.1.png" alt="Logo Krono" className="admin-logo" />
        </div>
      </header>

      {/* Overlay para cerrar el menú al hacer clic fuera */}
      {menuOpen && <div className="sidebar-overlay" onClick={() => setMenuOpen(false)}></div>}

      {/* Sidebar */}
      <aside className={`admin-sidebar ${menuOpen ? "open" : ""}`}>
        <nav className="sidebar-nav">
          <NavLink 
            to="/admin/usuarios" 
            className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
            title="Administrar usuarios"
          >
            👥 Usuarios
          </NavLink>
          <NavLink 
            to="/admin/historial" 
            className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
            title="Ver historial"
          >
            📄 Historial
          </NavLink>
          <NavLink 
            to="/admin/perfil" 
            className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
            title="Ver perfil"
          >
            👤 Perfil
          </NavLink>
        </nav>

        <button className="sidebar-logout" onClick={cerrarSesion} title="Cerrar sesión">
          🚪 Cerrar sesión
        </button>
      </aside>

      {/* Contenido Principal */}
      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
