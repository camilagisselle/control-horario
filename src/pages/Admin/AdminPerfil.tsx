import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminPerfil.css";

const AdminPerfil: React.FC = () => {
  const navigate = useNavigate();

  // Leer sesión para mostrar nombre y rol
  const stored = typeof window !== "undefined" ? localStorage.getItem("user") : null;
  const adminData = stored
    ? (() => {
        try {
          const u = JSON.parse(stored) as { name?: string; role?: string };
          return { name: u?.name ?? "Francisca Andrade", role: u?.role ?? "admin" };
        } catch {
          return { name: "Francisca Andrade", role: "admin" };
        }
      })()
    : { name: "Francisca Andrade", role: "admin" };

  const adminAvatarSrc = typeof window !== "undefined" ? localStorage.getItem("avatar") || "/avatar.jpeg" : "/avatar.jpeg";

  // Estado del menú desplegable del avatar
  const [menuAvatarOpen, setMenuAvatarOpen] = useState(false);
  const menuAvatarRef = useRef<HTMLDivElement>(null);

  // Estado del sidebar (hamburger)
  const [menuOpen, setMenuOpen] = useState(false);

  // Estados del formulario
  const [nombre, setNombre] = useState(adminData.name);
  const [correo] = useState("admin@indracompany.cl");
  const [password, setPassword] = useState("********");
  const [avatar, setAvatar] = useState(adminAvatarSrc);

  const cambiarAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setAvatar(result);
      if (typeof window !== "undefined") {
        localStorage.setItem("avatar", result);
      }
    };
    reader.readAsDataURL(file);
  };

  const logout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  // Cerrar menú del avatar al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuAvatarRef.current && !menuAvatarRef.current.contains(event.target as Node)) {
        setMenuAvatarOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuAvatarOpen(false);
      }
    };

    if (menuAvatarOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [menuAvatarOpen]);

  // Tooltips / touch behavior
  useEffect(() => {
    const onTouchStart = (e: TouchEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const tooltipEl = target.closest(".has-tooltip") as HTMLElement | null;
      const visibles = document.querySelectorAll(".has-tooltip.tooltip-visible");
      visibles.forEach((el) => el.classList.remove("tooltip-visible"));
      if (tooltipEl) tooltipEl.classList.add("tooltip-visible");
    };
    document.addEventListener("touchstart", onTouchStart, { passive: true });

    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const tooltipEl = target?.closest(".has-tooltip") as HTMLElement | null;
      if (!tooltipEl) {
        const visibles = document.querySelectorAll(".has-tooltip.tooltip-visible");
        visibles.forEach((el) => el.classList.remove("tooltip-visible"));
      }
    };
    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("touchstart", onTouchStart);
      document.removeEventListener("click", onClick);
    };
  }, []);

  return (
    <div className="layout">
      <aside className={`sidebar ${menuOpen ? "open" : ""}`}>
        <div className="sidebar-info">
          <div>👩 {adminData.name}</div>
          <div className="role">Administrador</div>
        </div>

        <a href="/admin/perfil" className="menu active has-tooltip" data-tooltip="Ver perfil">👤 Perfil</a>
        <a href="/admin/usuarios" className="menu has-tooltip" data-tooltip="Ir a usuarios">👥 Usuarios</a>
        <a href="/admin/historial" className="menu has-tooltip" data-tooltip="Ir al historial">📄 Historial</a>

        <div className="logout has-tooltip" data-tooltip="Cerrar sesión" onClick={logout}>🚪 Cerrar sesión</div>
      </aside>

      <main className="content">
        <header className="header">
          <button className="hamburger has-tooltip" onClick={() => setMenuOpen(!menuOpen)} data-tooltip="Abrir menú">☰</button>

          <div className="perfil-top">
            <h1>Perfil</h1>
          </div>

          <div className="header-avatar-container" ref={menuAvatarRef}>
            <button 
              className="header-avatar-button" 
              onClick={() => setMenuAvatarOpen(!menuAvatarOpen)}
              aria-label="Abrir menú de usuario"
            >
              <img src={avatar} alt="Avatar" className="header-avatar-img" />
            </button>

            {menuAvatarOpen && (
              <div className="avatar-dropdown-menu">
                <div className="avatar-dropdown-header">
                  <div className="avatar-dropdown-name">{adminData.name}</div>
                  <div className="avatar-dropdown-role">Administrador</div>
                </div>
                <div className="avatar-dropdown-divider"></div>
                <button onClick={() => navigate("/admin/perfil")} className="avatar-dropdown-item">👤 Perfil</button>
                <button onClick={() => navigate("/admin/usuarios")} className="avatar-dropdown-item">👥 Usuarios</button>
                <button onClick={() => navigate("/admin/historial")} className="avatar-dropdown-item">📄 Historial</button>
                <div className="avatar-dropdown-divider"></div>
                <button onClick={logout} className="avatar-dropdown-item avatar-dropdown-logout">🚪 Cerrar sesión</button>
              </div>
            )}
          </div>

          <img src="/krono2.1.png" className="logo" alt="Krono logo" />
        </header>

        <section className="card">
          <div className="perfil-card">
            <div className="perfil-avatar-grande">
              <label htmlFor="avatarInput">
                <img src={avatar} alt="Avatar grande" />
                <span>✏</span>
              </label>
              <input
                id="avatarInput"
                type="file"
                accept="image/*"
                hidden
                onChange={cambiarAvatar}
              />
            </div>

            <div className="perfil-info">
              <div>
                <label>Nombre</label>
                <input
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                />
              </div>

              <div>
                <label>Correo</label>
                <input value={correo} disabled />
              </div>

              <div>
                <label>Contraseña</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AdminPerfil;
