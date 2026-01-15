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
  {
    fecha: "23/10/2023",
    entrada: "08:00",
    inicioColacion: "13:14",
    finColacion: "14:14",
    salida: "17:00",
    total: "9.0 hrs",
  },
  {
    fecha: "24/10/2023",
    entrada: "08:15",
    inicioColacion: "13:00",
    finColacion: "14:00",
    salida: "17:15",
    total: "9.0 hrs",
  },
  {
    fecha: "25/11/2023",
    entrada: "07:55",
    inicioColacion: "13:05",
    finColacion: "14:05",
    salida: "16:55",
    total: "9.0 hrs",
  },
];

export default function HistorialPage() {
<<<<<<< HEAD
=======
  const navigate = useNavigate();
>>>>>>> 274a723decf0db1b597e2a0120e4a1b17f5d97d2
  const [filtro, setFiltro] = useState<"dia" | "mes" | "anio">("dia");
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [menuAvatar, setMenuAvatar] = useState(false);

  const registrosFiltrados = registros.filter((r) => {
    const [, mes, anio] = r.fecha.split("/");
    if (filtro === "dia") return true;
    if (filtro === "mes") return mes === "10";
    if (filtro === "anio") return anio === "2023";
    return true;
  });

  return (
    <div className="historial-container">
<<<<<<< HEAD
      {/* HEADER */}
      <header className="historial-header">
        <div className="usuario-info">
          <div className="avatar" onClick={() => setMenuAvatar(!menuAvatar)}>
            👩
          </div>

          <div>
            <p className="usuario-label">Usuario:</p>
            <h2 className="usuario-nombre">Camila Pinilla Cabrera</h2>
          </div>

          {menuAvatar && (
            <div className="avatar-menu">
              <button>Registro</button>
              <button>Historial</button>
              <button className="cerrar">Cerrar sesión</button>
=======
        <h1 className="registro-titulo">Historial</h1>
      {/* CONTENIDO SUPERIOR */}
      <div className="contenido-principal">
        {/* HEADER */}
        <header className="historial-header">
          <div className="usuario-info">
            <div className="avatar">👩</div>
            <div>
              <p className="usuario-label">Usuario:</p>
              <h2 className="usuario-nombre">Camila Pinilla Cabrera</h2>
            </div>
          </div>

          <div className="logo">
            <img src="/krono2.1.png" alt="Krono" />
          </div>
        </header>

        {/* FILTROS */}
        <div className="filtros-container">
          <button
            className="btn-filtros"
            onClick={() => setMostrarMenu(!mostrarMenu)}
          >
            Filtros ▾
          </button>

          {mostrarMenu && (
            <div className="menu-filtros">
              <button onClick={() => setFiltro("dia")}>Por día</button>
              <button onClick={() => setFiltro("mes")}>Por mes</button>
              <button onClick={() => setFiltro("anio")}>Por año</button>
>>>>>>> 274a723decf0db1b597e2a0120e4a1b17f5d97d2
            </div>
          )}
        </div>

<<<<<<< HEAD
        <div className="logo">
          <img src="/krono.png" alt="Krono" />
        </div>
      </header>

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

      {/* TABLA */}
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
                <td>
                  <span className="fecha-pill">{r.fecha}</span>
                </td>
                <td>{r.entrada}</td>
                <td>{r.inicioColacion}</td>
                <td>{r.finColacion}</td>
                <td>{r.salida}</td>
                <td>{r.total}</td>
=======
        {/* TABLA */}
        <div className="tabla-container">
          <table>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Entrada</th>
                <th>Inicio colación</th>
                <th>Fin colación</th>
                <th>Salida</th>
                <th>Total</th>
>>>>>>> 274a723decf0db1b597e2a0120e4a1b17f5d97d2
              </tr>
            </thead>
            <tbody>
              {registrosFiltrados.map((r, index) => (
                <tr key={index}>
                  <td>
                    <span className="fecha-pill">{r.fecha}</span>
                  </td>
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

        {/* PAGINACIÓN */}
        <div className="paginacion">
          <button>&lt; ANTERIOR</button>
          <button className="pagina-activa">1</button>
          <button>SIGUIENTE &gt;</button>
        </div>
      </div>

<<<<<<< HEAD
      {/* MOBILE CARDS */}
      <div className="mobile-only">
        {registrosFiltrados.map((r, index) => (
          <div key={index} className="historial-card">
            <div className="card-fecha">{r.fecha}</div>

            <div className="card-row">
              <span>Entrada</span>
              <strong>{r.entrada}</strong>
            </div>
            <div className="card-row">
              <span>Inicio colación</span>
              <strong>{r.inicioColacion}</strong>
            </div>
            <div className="card-row">
              <span>Fin colación</span>
              <strong>{r.finColacion}</strong>
            </div>
            <div className="card-row">
              <span>Salida</span>
              <strong>{r.salida}</strong>
            </div>

            <div className="card-total">{r.total}</div>
          </div>
        ))}
      </div>

      {/* PAGINACIÓN */}
      <div className="paginacion">
        <button>&lt; Anterior</button>
        <button className="pagina-activa">1</button>
        <button>Siguiente &gt;</button>
=======
      {/* CERRAR SESIÓN FIJO ABAJO */}
      <div className="logout" onClick={() => navigate("/")}>
        ↩ Cerrar sesión
>>>>>>> 274a723decf0db1b597e2a0120e4a1b17f5d97d2
      </div>
    </div>
  );
}
