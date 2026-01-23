import React, { useMemo, useState } from "react";
import "./AdminHistorial.css";

interface HistorialItem {
  id: number;
  usuario: string;
  fecha: string;
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

const USUARIOS: UserSummary[] = [
  { id: 1, nombre: "Camila", apellido: "Pinilla", correo: "camila@indracompany.cl" },
  { id: 2, nombre: "Noemi", apellido: "Muñoz", correo: "noemi@indracompany.cl" },
  { id: 3, nombre: "Juanito", apellido: "Perez", correo: "juanito@indracompany.cl" },
  { id: 4, nombre: "María", apellido: "López", correo: "maria@indracompany.cl" },
];

const AdminHistorial: React.FC = () => {
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState("Todos");
  const [filtroTabla, setFiltroTabla] = useState("");

  const historial: HistorialItem[] = [
    { id: 1, usuario: "Camila Pinilla", fecha: "2026-01-05", entrada: "08:00", inicioColacion: "12:30", finColacion: "13:15", salida: "17:30", totalHoras: "9.25" },
    { id: 2, usuario: "Noemi Muñoz", fecha: "2026-01-06", entrada: "08:10", inicioColacion: "12:30", finColacion: "13:15", salida: "17:40", totalHoras: "9.0" },
    { id: 3, usuario: "Juanito Perez", fecha: "2026-01-05", entrada: "08:30", inicioColacion: "12:30", finColacion: "13:00", salida: "17:30", totalHoras: "8.5" },
    { id: 4, usuario: "María López", fecha: "2026-01-07", entrada: "08:15", inicioColacion: "13:00", finColacion: "14:00", salida: "17:15", totalHoras: "9.0" },
  ];

  const mapa = useMemo(() => {
    const m = new Map<string, HistorialItem[]>();
    historial.forEach((h) => {
      const arr = m.get(h.usuario) || [];
      arr.push(h);
      m.set(h.usuario, arr);
    });
    return m;
  }, [historial]);

  const filas = useMemo(() => {
    if (usuarioSeleccionado === "Todos") {
      return [...historial].sort((a, b) => (a.fecha < b.fecha ? 1 : -1));
    }
    return (mapa.get(usuarioSeleccionado) || []).sort((a, b) =>
      a.fecha < b.fecha ? 1 : -1
    );
  }, [usuarioSeleccionado, historial, mapa]);

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
      r.totalHoras.includes(q)
    );
  }, [filtroTabla, filas]);

  const USUARIOS_NOMBRES = ["Todos", ...USUARIOS.map(u => `${u.nombre} ${u.apellido}`)];

  return (
    <div className="dashboard-historial">
      <main className="historial-contenido">

        <h1 className="historial-titulo">Historial de Usuarios</h1>

        <div className="admin-filtros">
          <select
            className="admin-select"
            value={usuarioSeleccionado}
            onChange={(e) => setUsuarioSeleccionado(e.target.value)}
          >
            {USUARIOS_NOMBRES.map((n) => (
              <option key={n}>{n}</option>
            ))}
          </select>

          <input
            className="admin-search"
            placeholder="🔍 Buscar registros..."
            value={filtroTabla}
            onChange={(e) => setFiltroTabla(e.target.value)}
          />

          <button className="btn-filtros" onClick={() => setFiltroTabla("")}>
            Limpiar
          </button>
        </div>

        <div className="tabla-container">
          <table>
            <thead>
              <tr>
                <th>Usuario</th>
                <th>Fecha</th>
                <th>Entrada</th>
                <th>Inicio Colación</th>
                <th>Fin Colación</th>
                <th>Salida</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {filasFiltradas.length === 0 ? (
                <tr>
                  <td colSpan={7}>No hay registros</td>
                </tr>
              ) : (
                filasFiltradas.map((r) => (
                  <tr key={r.id}>
                    <td>{r.usuario}</td>
                    <td><span className="fecha-pill">{r.fecha}</span></td>
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

        {/* LOGO — AL FINAL (CLAVE PARA MOBILE) */}
        <img src="/krono2.1.png" alt="Krono" className="logo-img" />

      </main>
    </div>
  );
};

export default AdminHistorial;
