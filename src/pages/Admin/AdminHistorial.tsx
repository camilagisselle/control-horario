import React, { useMemo, useState } from "react";
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
}

/* Usuarios que el admin podrá ver */
const USUARIOS: UserSummary[] = [
  { id: 1, nombre: "Camila", apellido: "Pinilla", correo: "camila@indracompany.cl" },
  { id: 2, nombre: "Noemi", apellido: "Muñoz", correo: "noemi@indracompany.cl" },
  { id: 3, nombre: "Juanito", apellido: "Perez", correo: "juanito@indracompany.cl" },
  { id: 4, nombre: "María", apellido: "López", correo: "maria@indracompany.cl" },
];

const AdminHistorial: React.FC = () => {
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState<string>("Todos");
  const [filtroTabla, setFiltroTabla] = useState<string>("");

  // Datos de ejemplo
  const historial: HistorialItem[] = [
    { id: 1, usuario: "Camila Pinilla", fecha: "2026-01-05", entrada: "08:00", inicioColacion: "12:30", finColacion: "13:15", salida: "17:30", totalHoras: "9.25" },
    { id: 2, usuario: "Noemi Muñoz", fecha: "2026-01-06", entrada: "08:10", inicioColacion: "12:30", finColacion: "13:15", salida: "17:40", totalHoras: "9.0" },
    { id: 3, usuario: "Juanito Perez", fecha: "2026-01-05", entrada: "08:30", inicioColacion: "12:30", finColacion: "13:00", salida: "17:30", totalHoras: "8.5" },
    { id: 4, usuario: "María López", fecha: "2026-01-07", entrada: "08:15", inicioColacion: "13:00", finColacion: "14:00", salida: "17:15", totalHoras: "9.0" },
    { id: 5, usuario: "Camila Pinilla", fecha: "2025-12-01", entrada: "08:00", inicioColacion: "13:14", finColacion: "14:14", salida: "17:00", totalHoras: "9.0" },
    { id: 6, usuario: "Francisca Andrade", fecha: "2025-12-10", entrada: "08:00", inicioColacion: "13:00", finColacion: "14:00", salida: "18:00", totalHoras: "10.0" },
  ];

  // Mapa por usuario para accesos rápidos
  const mapa = useMemo(() => {
    const m = new Map<string, HistorialItem[]>();
    for (const it of historial) {
      const arr = m.get(it.usuario) || [];
      arr.push(it);
      m.set(it.usuario, arr);
    }
    return m;
  }, [historial]);

  // Filtrado por usuario seleccionado
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

  const USUARIOS_NOMBRES = ["Todos", ...USUARIOS.map((u) => `${u.nombre} ${u.apellido}`)];

  return (
    <div className="historial-page">
      <div className="historial-container">
        <h1 className="page-title">HISTORIAL DE USUARIOS</h1>

        <div className="historial-card">
          <div className="card-header">
            <select
              className="user-select"
              value={usuarioSeleccionado}
              onChange={(e) => setUsuarioSeleccionado(e.target.value)}
              title="Filtrar por usuario"
            >
              {USUARIOS_NOMBRES.map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>

            <input
              className="search-input"
              placeholder="🔍 Buscar en registros..."
              value={filtroTabla}
              onChange={(e) => setFiltroTabla(e.target.value)}
              title="Buscar por usuario, fecha, hora, etc."
            />

            <button onClick={() => setFiltroTabla("")} className="btn-limpiar" title="Limpiar búsqueda">
              Limpiar
            </button>
          </div>

          <div className="table-wrapper">
            <table className="historial-tabla">
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
                  <tr>
                    <td colSpan={7} className="no-results">No hay registros disponibles</td>
                  </tr>
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

          <div className="paginacion">
            <button className="btn-paginacion" title="Página anterior">Anterior</button>
            <span className="pagina-actual">1</span>
            <button className="btn-paginacion" title="Página siguiente">Siguiente</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHistorial;