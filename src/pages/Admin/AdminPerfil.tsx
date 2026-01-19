import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminPerfil.css";

const AdminPerfil = () => {
  const navigate = useNavigate();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const stored = typeof window !== "undefined" ? localStorage.getItem("user") : null;
  const adminNombre = stored
    ? (() => {
        try {
          const u = JSON.parse(stored) as { name?: string };
          return u?.name ?? "Administrador";
        } catch {
          return "Administrador";
        }
      })()
    : "Administrador";

  const adminAvatarSrc =
    typeof window !== "undefined" ? localStorage.getItem("avatar") || "/avatar.jpeg" : "/avatar.jpeg";

  const [nombre, setNombre] = useState(adminNombre);
  const [correo] = useState("admin@correo.cl");
  const [password, setPassword] = useState("12345");
  const [avatar, setAvatar] = useState<string>(adminAvatarSrc);

  const cambiarAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setAvatar(result);
      try {
        localStorage.setItem("avatar", result);
      } catch {
        // ignore storage errors
      }
    };
    reader.readAsDataURL(file);
  };

  const logout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="ap-root">
      <button
        className="ap-btn-hamburguesa"
        aria-label="Abrir menú"
        onClick={() => setSidebarOpen(true)}
      >
        ☰
      </button>

      <div
        className={`ap-overlay ${sidebarOpen ? "active" : ""}`}
        onClick={() => setSidebarOpen(false)}
      />

      <aside className={`ap-sidebar ${sidebarOpen ? "active" : ""}`}>
        <div className="ap-sidebar-avatar" onClick={() => setMenuAbierto(!menuAbierto)}>
          <img src={avatar} alt="avatar admin" className="ap-admin-avatar" />
          <div className="ap-admin-info">
            <div>{nombre}</div>
            <div className="ap-role">Administrador</div>
          </div>
        </div>

        {menuAbierto && (
          <div className="ap-perfil-menu">
            <button onClick={() => navigate("/admin/usuarios")}>Usuarios</button>
            <button onClick={() => navigate("/admin/historial")}>Historial</button>
            <button onClick={() => navigate("/admin/perfil")}>Ver mi Perfil</button>
            <button onClick={logout}>Cerrar sesión</button>
          </div>
        )}

        <nav className="ap-nav">
          <button className="ap-nav-item" onClick={() => navigate("/admin/perfil")}>👤 Perfil</button>
          <button className="ap-nav-item" onClick={() => navigate("/admin/usuarios")}>👥 Usuarios</button>
          <button className="ap-nav-item" onClick={() => navigate("/admin/historial")}>📄 Historial</button>
        </nav>
      </aside>

      <main className="ap-contenido">
        <header className="ap-header">
          <h1>Perfil - Administrador</h1>
          <img src="/krono2.1.png" className="ap-logo" alt="logo" />
        </header>

        <section className="ap-card">
          <div className="ap-avatar-grande">
            <label htmlFor="avatarInput" className="ap-avatar-label">
              <img src={avatar} alt="avatar grande" />
              <span className="ap-edit-icon">✏</span>
            </label>
            <input id="avatarInput" type="file" accept="image/*" hidden onChange={cambiarAvatar} />
          </div>

          <div className="ap-info">
            <div className="ap-field">
              <label>Nombre</label>
              <input value={nombre} onChange={(e) => setNombre(e.target.value)} />
            </div>

            <div className="ap-field">
              <label>Correo</label>
              <input value={correo} disabled />
            </div>

            <div className="ap-field">
              <label>Contraseña</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AdminPerfil;