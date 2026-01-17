import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminPerfil.css";

const AdminPerfil: React.FC = () => {
  const navigate = useNavigate();

  // Leer sesión para mostrar nombre / avatar
  const stored = typeof window !== "undefined" ? localStorage.getItem("user") : null;
  const adminUser = stored
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

  const [menuOpen, setMenuOpen] = useState(false);
  const [avatarMenuOpen, setAvatarMenuOpen] = useState(false);
  const avatarMenuRef = useRef<HTMLDivElement>(null);

  // Estado del perfil
  const [nombre, setNombre] = useState(adminUser.name);
  const [correo] = useState("francisca@indracompany.cl");
  const [password, setPassword] = useState("••••••••");
  const [avatar, setAvatar] = useState(adminAvatarSrc);

  // Cerrar menú avatar al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (avatarMenuRef.current && !avatarMenuRef.current.contains(event.target as Node)) {
        setAvatarMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("avatar");
    navigate("/");
  };

  const cambiarAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setAvatar(result);
      localStorage.setItem("avatar", result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="layout">
      <aside className={`sidebar ${menuOpen ? "open" : ""}`}>
        <div className="sidebar-info">
          <div className="admin-info">
            <div>👩 {adminUser.name}</div>
            <div className="role">Administrador</div>
          </div>
        </div>

        <button onClick={() => navigate("/admin/perfil")} className="menu active has-tooltip" data-tooltip="Ver perfil">
          👤 Perfil
        </button>
        <button onClick={() => navigate("/admin/usuarios")} className="menu has-tooltip" data-tooltip="Ir a usuarios">
          👥 Usuarios
        </button>
        <button onClick={() => navigate("/admin/historial")} className="menu has-tooltip" data-tooltip="Ver historial">
          📄 Historial
        </button>

        <div className="logout has-tooltip" data-tooltip="Cerrar sesión" onClick={logout}>
          🚪 Cerrar sesión
        </div>
      </aside>

      <main className="content">
        <header className="header">
          <button className="hamburger has-tooltip" onClick={() => setMenuOpen(!menuOpen)} data-tooltip="Abrir menú">
            ☰
          </button>

          <div className="header-title">
            <h1>Perfil administrador</h1>
          </div>

          <div className="header-right" ref={avatarMenuRef}>
            <img
              src={avatar}
              className="header-avatar has-tooltip"
              alt="avatar"
              onClick={() => setAvatarMenuOpen(!avatarMenuOpen)}
              data-tooltip="Abrir menú"
            />

            {avatarMenuOpen && (
              <div className="avatar-dropdown">
                <button onClick={() => { setAvatarMenuOpen(false); navigate("/admin/perfil"); }}>
                  👤 Perfil
                </button>
                <button onClick={() => { setAvatarMenuOpen(false); navigate("/admin/usuarios"); }}>
                  👥 Usuarios
                </button>
                <button onClick={() => { setAvatarMenuOpen(false); navigate("/admin/historial"); }}>
                  📄 Historial
                </button>
                <button className="logout-btn" onClick={logout}>
                  🚪 Cerrar sesión
                </button>
              </div>
            )}
          </div>

          <img src="/krono2.1.png" className="logo" alt="Krono logo" />
        </header>

        <section className="card perfil-card">
          <div className="perfil-avatar-section">
            <label htmlFor="avatarInput" className="perfil-avatar-grande">
              <img src={avatar} alt="avatar" />
              <span className="edit-icon">✏</span>
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
            <div className="form-field">
              <label>Nombre</label>
              <input
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />
            </div>

            <div className="form-field">
              <label>Correo</label>
              <input value={correo} disabled />
            </div>

            <div className="form-field">
              <label>Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AdminPerfil;
