import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
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
          {/* Avatar con menú desplegable */}
          <div className="admin-avatar-menu">
            <img 
              src={adminAvatar} 
              alt="Avatar" 
              className="admin-avatar-img"
              onClick={() => setMenuOpen(!menuOpen)}
              title="Abrir menú"
            />
            
            {menuOpen && (
              <div className="admin-dropdown">
                <button 
                  className="dropdown-item" 
                  onClick={() => { navigate("/admin/usuarios"); setMenuOpen(false); }}
                >
                  👥 Usuarios
                </button>
                <button 
                  className="dropdown-item" 
                  onClick={() => { navigate("/admin/historial"); setMenuOpen(false); }}
                >
                  📄 Historial
                </button>
                <button 
                  className="dropdown-item" 
                  onClick={() => { navigate("/admin/perfil"); setMenuOpen(false); }}
                >
                  👤 Perfil
                </button>
                <div className="dropdown-divider"></div>
                <button className="dropdown-item logout-item" onClick={cerrarSesion}>
                  🚪 Cerrar sesión
                </button>
              </div>
            )}
          </div>
          
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
      {menuOpen && <div className="dropdown-overlay" onClick={() => setMenuOpen(false)}></div>}

      {/* Contenido Principal */}
      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
