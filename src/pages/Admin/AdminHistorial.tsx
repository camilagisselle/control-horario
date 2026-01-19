import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./AdminHistorial.css";

interface HistorialItem {
  id: number;
  usuario: string;
  fecha: string; // YYYY-MM-DD
  entrada: string;
  inicioColacion: string;
  finColacion: string;
  salida: string;
  totalHoras: string;
}

interface UserSummary {
  id: number;
  nombre: string;
  apellido: string;
  correo: string;
  avatar?: string;
}

/* Usuarios que el admin podrá ver (4) */
const USUARIOS: UserSummary[] = [
  { id: 1, nombre: "Camila", apellido: "Pinilla", correo: "camila@indracompany.cl", avatar: "/avatar.jpeg" },
  { id: 2, nombre: "Noemi", apellido: "Muñoz", correo: "noemi@indracompany.cl", avatar: "/avatar.jpeg" },
  { id: 3, nombre: "Juanito", apellido: "Perez", correo: "juanito@indracompany.cl", avatar: "/avatar.jpeg" },
  { id: 4, nombre: "María", apellido: "López", correo: "maria@indracompany.cl", avatar: "/avatar.jpeg" },
];

const AdminHistorial: React.FC = () => {
  const navigate = useNavigate();

  // Leer sesión para mostrar nombre / avatar en sidebar (si existen)
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

  const adminAvatarSrc = typeof window !== "undefined" ? localStorage.getItem("avatar") || "/avatar.jpeg" : "/avatar.jpeg";

  const [menuOpen, setMenuOpen] = useState(false);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState<string>("Todos");
  const [filtroTabla, setFiltroTabla] = useState<string>("");

  // Datos de ejemplo (reemplaza con datos reales si los tienes)
  const historial: HistorialItem[] = [
    { id: 1, usuario: "Camila Pinilla", fecha: "2026-01-05", entrada: "08:00", inicioColacion: "12:30", finColacion: "13:15", salida: "17:30", totalHoras: "9.25" },
    { id: 2, usuario: "Noemi Muñoz",  fecha: "2026-01-06", entrada: "08:10", inicioColacion: "12:30", finColacion: "13:15", salida: "17:40", totalHoras: "9.0" },
    { id: 3, usuario: "Juanito Perez", fecha: "2026-01-05", entrada: "08:30", inicioColacion: "12:30", finColacion: "13:00", salida: "17:30", totalHoras: "8.5" },
    { id: 4, usuario: "María López",   fecha: "2026-01-07", entrada: "08:15", inicioColacion: "13:00", finColacion: "14:00", salida: "17:15", totalHoras: "9.0" },
    { id: 5, usuario: "Camila Pinilla", fecha: "2025-12-01", entrada: "08:00", inicioColacion: "13:14", finColacion: "14:14", salida: "17:00", totalHoras: "9.0" },
    { id: 6, usuario: "Francisca Andrade", fecha: "2025-12-10", entrada: "08:00", inicioColacion: "13:00", finColacion: "14:00", salida: "18:00", totalHoras: "10.0" },
  ];

  // Mapa por usuario para accesos rápidos (opcional)
  const mapa = useMemo(() => {
    const m = new Map<string, HistorialItem[]>();
    for (const it of historial) {
      const arr = m.get(it.usuario) || [];
      arr.push(it);
      m.set(it.usuario, arr);
    }
    return m;
  }, [historial]);

  // Filtrado por usuario seleccionado (select)
  const filas = useMemo(() => {
    if (usuarioSeleccionado === "Todos") {
      return [...historial].sort((a, b) => (a.fecha < b.fecha ? 1 : -1));
    }
    return (mapa.get(usuarioSeleccionado) || []).sort((a, b) => (a.fecha < b.fecha ? 1 : -1));
  }, [usuarioSeleccionado, historial, mapa]);

  // Aplicar filtro de texto sobre filas ya filtradas
  const filasFiltradas = useMemo(() => {
    if (!filtroTabla.trim()) return filas;
    const q = filtroTabla.toLowerCase();
    return filas.filter((r) =>
      r.usuario.toLowerCase().includes(q) ||
      r.fecha.includes(q) ||
      r.entrada.includes(q) ||
      r.inicioColacion.includes(q) ||
      r.finColacion.includes(q) ||
      r.salida.includes(q) ||
      r.totalHoras.toLowerCase().includes(q)
    );
  }, [filtroTabla, filas]);

  // Tooltips / touch behavior (mantengo tal cual)
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
    navigate("/");
  };

  const USUARIOS_NOMBRES = ["Todos", ...USUARIOS.map((u) => `${u.nombre} ${u.apellido}`)];

  return (
    <div className="layout">
      <aside className={`sidebar ${menuOpen ? "open" : ""}`}>
        <div className="sidebar-avatar">
          <img src={adminAvatarSrc} alt="avatar admin" className="admin-avatar" />
          <div className="admin-info">
            <div>👩 {adminNombre}</div>
            <div className="role">Administrador</div>
          </div>
        </div>

        <Link to="/admin/usuarios" className="menu has-tooltip" data-tooltip="Ir a usuarios">👥 Usuarios</Link>
        <Link to="/admin/historial" className="menu active has-tooltip" data-tooltip="Ir al historial">📄 Historial</Link>

        <div className="logout has-tooltip" data-tooltip="Cerrar sesión" onClick={logout}>🚪 Cerrar sesión</div>
      </aside>

      <main className="content">
        <header className="header">
          <button className="hamburger has-tooltip" onClick={() => setMenuOpen(!menuOpen)} data-tooltip="Abrir menú">☰</button>

          <div className="perfil-top">
            <h1>Historial</h1>
          </div>

          <img src="/krono2.1.png" className="logo" alt="Krono logo" />
        </header>

        <section className="card">
          {/* FILTRO de búsqueda + select de usuario */}
          <div className="table-filter-row">
            <select
              className="table-select"
              value={usuarioSeleccionado}
              onChange={(e) => setUsuarioSeleccionado(e.target.value)}
              aria-label="Filtrar por usuario"
            >
              {USUARIOS_NOMBRES.map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>

            <input
              className="table-filter"
              placeholder="Buscar en registros (usuario, fecha, hora...)"
              value={filtroTabla}
              onChange={(e) => setFiltroTabla(e.target.value)}
              aria-label="Buscar registros"
            />

            <div className="table-filter-actions">
              <button onClick={() => setFiltroTabla("")} className="btn-outline">Limpiar</button>
            </div>
          </div>

          <div className="table-wrap">
            <h2 className="table-title">Registros {usuarioSeleccionado !== "Todos" ? `de ${usuarioSeleccionado}` : "(todos)"}</h2>

            <table>
              <thead>
                <tr>
                  <th>Usuario</th>
                  <th>Fecha</th>
                  <th>Entrada</th>
                  <th>Inicio Colación</th>
                  <th>Fin Colación</th>
                  <th>Salida</th>
                  <th>Total Horas</th>
                </tr>
              </thead>
              <tbody>
                {filasFiltradas.length === 0 ? (
                  <tr><td colSpan={7}>No hay registros</td></tr>
                ) : (
                  filasFiltradas.map((r) => (
                    <tr key={r.id}>
                      <td>{r.usuario}</td>
                      <td>{r.fecha}</td>
                      <td>{r.entrada}</td>
                      <td>{r.inicioColacion}</td>
                      <td>{r.finColacion}</td>
                      <td>{r.salida}</td>
                      <td>{r.totalHoras} hrs</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AdminHistorial;