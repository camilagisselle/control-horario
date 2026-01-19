import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Historialpaginas.css";

type Registro = {
  fecha: string;
  entrada: string;
  inicioColacion: string;
  finColacion: string;
  salida: string;
  total: string;
};

const registros: Registro[] = [
  { fecha: "23/10/2023", entrada: "08:00", inicioColacion: "13:14", finColacion: "14:14", salida: "17:00", total: "9.0 hrs" },
  { fecha: "24/10/2023", entrada: "08:15", inicioColacion: "13:00", finColacion: "14:00", salida: "17:15", total: "9.0 hrs" },
  { fecha: "25/11/2023", entrada: "07:55", inicioColacion: "13:05", finColacion: "14:05", salida: "16:55", total: "9.0 hrs" },
];

export default function HistorialPage() {
  const navigate = useNavigate();
  const [filtro, setFiltro] = useState<"dia" | "mes" | "anio">("dia");
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  // MENÚ ÚNICO (avatar + hamburguesa)
  const [menuAvatar, setMenuAvatar] = useState(false);

  const registrosFiltrados = registros.filter((r) => {
    const [, mes, anio] = r.fecha.split("/");
    if (filtro === "dia") return true;
    if (filtro === "mes") return mes === "10";
    if (filtro === "anio") return anio === "2023";
    return true;
  });

  return (
    <div className="dashboard-historial">

      {/* BOTÓN HAMBURGUESA (SOLO MOBILE) */}
      <button
        className="btn-hamburguesa"
        onClick={() => setMenuAvatar(!menuAvatar)}
      >
        ☰
      </button>

      {/* SIDEBAR (SE MANTIENE IGUAL) */}
      <aside className="sidebar">
        <div className="usuario-info-sidebar">
          <div
            className="avatar"
            onClick={() => setMenuAvatar(!menuAvatar)}
          >
            <img src="/avatar.jpeg" alt="Avatar" />
          </div>

          <div>
            <p className="usuario-label">Usuario:</p>
            <h2 className="usuario-nombre">Camila Pinilla</h2>
          </div>

          {menuAvatar && (
            <div className="avatar-menu">
              <button onClick={() => navigate("/registro")}>Registro</button>
              <button onClick={() => navigate("/historial")}>Historial</button>
              <button className="cerrar" onClick={() => navigate("/")}>
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* CONTENIDO */}
      <main className="historial-contenido">
        <h1 className="historial-titulo">Historial</h1>

        {/* FILTROS */}
        <div className="filtros-container">
          <button
            className="btn-filtros"
            onClick={() => setMostrarFiltros(!mostrarFiltros)}
          >
            Filtros ▾
          </button>

          {mostrarFiltros && (
            <div className="menu-filtros">
              <button onClick={() => setFiltro("dia")}>Por día</button>
              <button onClick={() => setFiltro("mes")}>Por mes</button>
              <button onClick={() => setFiltro("anio")}>Por año</button>
            </div>
          )}
        </div>

        {/* TABLA DESKTOP */}
        <div className="tabla-container desktop-only">
          <table>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Entrada</th>
                <th>Inicio colación</th>
                <th>Fin colación</th>
                <th>Salida</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {registrosFiltrados.map((r, index) => (
                <tr key={index}>
                  <td><span className="fecha-pill">{r.fecha}</span></td>
                  <td>{r.entrada}</td>
                  <td>{r.inicioColacion}</td>
                  <td>{r.finColacion}</td>
                  <td>{r.salida}</td>
                  <td>{r.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* TARJETAS MOBILE */}
        <div className="mobile-only">
          {registrosFiltrados.map((r, index) => (
            <div key={index} className="historial-card">
              <div className="card-fecha">{r.fecha}</div>
              <div className="card-row"><span>Entrada</span><strong>{r.entrada}</strong></div>
              <div className="card-row"><span>Inicio colación</span><strong>{r.inicioColacion}</strong></div>
              <div className="card-row"><span>Fin colación</span><strong>{r.finColacion}</strong></div>
              <div className="card-row"><span>Salida</span><strong>{r.salida}</strong></div>
              <div className="card-total">{r.total}</div>
            </div>
          ))}
        </div>

        {/* PAGINACIÓN */}
        <div className="paginacion">
          <button>&lt; Anterior</button>
          <button className="pagina-activa">1</button>
          <button>Siguiente &gt;</button>
        </div>

        <img src="/krono2.1.png" alt="Krono Logo" className="logo-img" />
      </main>
    </div>
  );
}