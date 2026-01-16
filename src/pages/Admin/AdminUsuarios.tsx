import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./AdminUsuarios.css";

function AdminUsuarios() {
  const navigate = useNavigate();

  // Leemos la sesión para mostrar nombre (si existe)
  const stored = typeof window !== "undefined" ? localStorage.getItem("user") : null;
  const adminNombre = stored
    ? (() => {
        try {
          const u = JSON.parse(stored) as { name?: string };
          return u?.name ?? "Francisca Andrade";
        } catch {
          return "Francisca Andrade";
        }
      })()
    : "Francisca Andrade";

  // Avatar: si guardas un avatar en localStorage con la clave "avatar", se usará.
  const adminAvatarSrc =
    typeof window !== "undefined"
      ? localStorage.getItem("avatar") || "/avatar.jpeg"
      : "/avatar.jpeg";

  const [menuAbierto, setMenuAbierto] = useState(false);

  const [usuarios, setUsuarios] = useState([
    {
      id: 1,
      nombre: "Camila",
      apellido: "Pinilla",
      correo: "camila@indracompany.cl",
      rol: "Colaborador",
      activo: true,
    },
    {
      id: 2,
      nombre: "Noemi",
      apellido: "Muñoz",
      correo: "noemi@indracompany.cl",
      rol: "Colaborador",
      activo: true,
    },
    {
      id: 3,
      nombre: "Juanito",
      apellido: "Perez",
      correo: "juanito@indracompany.cl",
      rol: "Colaborador",
      activo: true,
    },
    {
      id: 4,
      nombre: "María",
      apellido: "López",
      correo: "maria@indracompany.cl",
      rol: "Colaborador",
      activo: true,
    },
  ]);

  const [busqueda, setBusqueda] = useState("");

  // CONTROL DEL MODAL
  const [mostrarModal, setMostrarModal] = useState(false);
  const [usuarioEditando, setUsuarioEditando] = useState<number | null>(null);

  // FORMULARIO
  const [formulario, setFormulario] = useState({
    nombre: "",
    apellido: "",
    correo: "",
    rol: "Colaborador",
    password: "",
    repetirPassword: "",
  });

  const logout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  const toggleActivo = (id: number) => {
    setUsuarios((prev) =>
      prev.map((u) => (u.id === id ? { ...u, activo: !u.activo } : u))
    );
  };

  const eliminarUsuario = (id: number) => {
    if (!window.confirm("¿Eliminar usuario?")) return;
    setUsuarios((prev) => prev.filter((u) => u.id !== id));
  };

  const guardarUsuario = () => {
    if (!formulario.nombre || !formulario.apellido || !formulario.correo) {
      alert("Completa todos los campos");
      return;
    }

    if (formulario.password !== formulario.repetirPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }

    if (usuarioEditando !== null) {
      setUsuarios((prev) =>
        prev.map((u) => (u.id === usuarioEditando ? { ...u, ...formulario } : u))
      );
    } else {
      setUsuarios((prev) => [
        ...prev,
        {
          id: Date.now(),
          ...formulario,
          activo: true,
        },
      ]);
    }

    setMostrarModal(false);
    setUsuarioEditando(null);
    setFormulario({
      nombre: "",
      apellido: "",
      correo: "",
      rol: "Colaborador",
      password: "",
      repetirPassword: "",
    });
  };

  const usuariosFiltrados = usuarios.filter(
    (u) =>
      u.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      u.apellido.toLowerCase().includes(busqueda.toLowerCase()) ||
      u.correo.toLowerCase().includes(busqueda.toLowerCase())
  );

  // tooltips touch
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
      {/* SIDEBAR */}
      <aside className={`sidebar ${menuAbierto ? "open" : ""}`}>
        <div className="sidebar-avatar">
          <img src={adminAvatarSrc} alt="avatar admin" className="admin-avatar" />
          <div className="admin-info">
            <div>👩 {adminNombre}</div>
            <div className="role">Administrador</div>
          </div>
        </div>

        <Link
          to="/admin/usuarios"
          className="menu active has-tooltip"
          data-tooltip="Ir a usuarios"
        >
          👥 Usuarios
        </Link>

        <Link
          to="/admin/historial"
          className="menu has-tooltip"
          data-tooltip="Ver historial"
        >
          📄 Historial
        </Link>

        <div
          className="logout has-tooltip"
          data-tooltip="Cerrar sesión"
          role="button"
          onClick={logout}
        >
          🚪 Cerrar sesión
        </div>
      </aside>

      {/* CONTENIDO */}
      <main className="content">
        <header className="header">
          <button
            className="hamburger has-tooltip"
            onClick={() => setMenuAbierto(!menuAbierto)}
            data-tooltip="Abrir/cerrar menú"
            aria-label="Abrir menú"
          >
            ☰
          </button>

          <h1>ADMINISTRADOR DE USUARIOS</h1>

          <img src="/krono2.1.png" className="logo" alt="Krono logo" />
        </header>

        <section className="card">
          <div className="actions">
            <div
              className="search-box has-tooltip"
              data-tooltip="Buscar por nombre, apellido o correo"
            >
              <input
                placeholder="Buscar usuario"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                aria-label="Buscar usuario"
              />
            </div>

            <button
              className="btn-nuevo has-tooltip"
              onClick={() => {
                setUsuarioEditando(null);
                setFormulario({
                  nombre: "",
                  apellido: "",
                  correo: "",
                  rol: "Colaborador",
                  password: "",
                  repetirPassword: "",
                });
                setMostrarModal(true);
              }}
              data-tooltip="Crear nuevo usuario"
              aria-label="Nuevo usuario"
            >
              Nuevo
            </button>
          </div>

          <table>
            <thead>
              <tr>
                <th className="has-tooltip" data-tooltip="Nombre y apellido">
                  Nombre
                </th>
                <th className="has-tooltip" data-tooltip="Correo electrónico">
                  Correo
                </th>
                <th className="has-tooltip" data-tooltip="Rol asignado">Rol</th>
                <th className="has-tooltip" data-tooltip="Acciones disponibles">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {usuariosFiltrados.map((u) => (
                <tr key={u.id}>
                  <td>
                    {u.nombre} {u.apellido}
                  </td>
                  <td>{u.correo}</td>
                  <td>{u.rol}</td>
                  <td>
                    <span
                      onClick={() => toggleActivo(u.id)}
                      data-tooltip={u.activo ? "Marcar como inactivo" : "Marcar como activo"}
                      className="has-tooltip"
                      role="button"
                      aria-label={u.activo ? "Desactivar usuario" : "Activar usuario"}
                      style={{ cursor: "pointer" }}
                    >
                      {u.activo ? "🟢" : "🔴"}
                    </span>{" "}
                    <span
                      onClick={() => {
                        setFormulario({
                          nombre: u.nombre,
                          apellido: u.apellido,
                          correo: u.correo,
                          rol: u.rol,
                          password: "",
                          repetirPassword: "",
                        });
                        setUsuarioEditando(u.id);
                        setMostrarModal(true);
                      }}
                      data-tooltip="Editar usuario"
                      className="has-tooltip"
                      role="button"
                      aria-label="Editar usuario"
                      style={{ cursor: "pointer" }}
                    >
                      ✏️
                    </span>{" "}
                    <span
                      onClick={() => eliminarUsuario(u.id)}
                      data-tooltip="Eliminar usuario"
                      className="has-tooltip"
                      role="button"
                      aria-label="Eliminar usuario"
                      style={{ cursor: "pointer" }}
                    >
                      🗑️
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>

      {/* MODAL */}
      {mostrarModal && (
        <div className="modal-backdrop" onClick={() => setMostrarModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>{usuarioEditando !== null ? "Editar usuario" : "Nuevo usuario"}</h2>

            <div className="modal-grid">
              <input placeholder="Nombre" value={formulario.nombre} onChange={(e) => setFormulario({ ...formulario, nombre: e.target.value })} />
              <input placeholder="Apellido" value={formulario.apellido} onChange={(e) => setFormulario({ ...formulario, apellido: e.target.value })} />
              <input placeholder="Correo" value={formulario.correo} onChange={(e) => setFormulario({ ...formulario, correo: e.target.value })} />
              <select value={formulario.rol} onChange={(e) => setFormulario({ ...formulario, rol: e.target.value })}>
                <option>Colaborador</option>
                <option>Administrador</option>
              </select>
              <input type="password" placeholder="Contraseña" value={formulario.password} onChange={(e) => setFormulario({ ...formulario, password: e.target.value })} />
              <input type="password" placeholder="Repetir contraseña" value={formulario.repetirPassword} onChange={(e) => setFormulario({ ...formulario, repetirPassword: e.target.value })} />
            </div>

            <div className="modal-actions">
              <button onClick={guardarUsuario}>Guardar</button>
              <button onClick={() => setMostrarModal(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminUsuarios;