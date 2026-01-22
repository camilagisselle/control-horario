import { useState, type SetStateAction } from "react";
import DatePicker from "react-datepicker";
import { es } from "date-fns/locale";
import "react-datepicker/dist/react-datepicker.css";
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
  const [fechaSeleccionada, setFechaSeleccionada] = useState<Date | null>(null);
  const [mostrarCalendario, setMostrarCalendario] = useState(false);

  // 🔹 Date → dd/MM/yyyy
  const formatearFecha = (date: Date) => {
    const d = String(date.getDate()).padStart(2, "0");
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const y = date.getFullYear();
    return `${d}/${m}/${y}`;
  };

  // 🔹 Fechas con registros (para marcar calendario)
  const fechasConRegistros = registros.map((r) => {
    const [d, m, y] = r.fecha.split("/").map(Number);
    return new Date(y, m - 1, d);
  });

  // 🔹 Filtrar historial
  const registrosFiltrados = fechaSeleccionada
    ? registros.filter(
        (r) => r.fecha === formatearFecha(fechaSeleccionada)
      )
    : registros;

  return (
    <div className="dashboard-historial">
      <main className="historial-contenido">
        <h1 className="historial-titulo">Historial</h1>

        {/* FILTRO CALENDARIO */}
        <div className="filtros-container">
          <button
            className="btn-filtros"
            onClick={() => setMostrarCalendario(!mostrarCalendario)}
          >
            📅 Filtrar por fecha
          </button>

          {mostrarCalendario && (
            <div className="calendario-popup">
              <DatePicker
                selected={fechaSeleccionada}
                onChange={(date: SetStateAction<Date | null>) => {
                  setFechaSeleccionada(date);
                  setMostrarCalendario(false);
                }}
                inline
                locale={es}
                dateFormat="dd/MM/yyyy"
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
                maxDate={new Date()}
                highlightDates={fechasConRegistros}
                dayClassName={(date) => {
                  const hoy = new Date();
                  hoy.setHours(0, 0, 0, 0);
                  if (date > hoy) return "dia-futuro";
                  return "";
                }}
              />
            </div>
          )}
        </div>

        {/* MENSAJE SIN REGISTROS */}
        {registrosFiltrados.length === 0 && (
          <p style={{ textAlign: "center", marginTop: 20 }}>
            No hay registros para esta fecha
          </p>
        )}

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
              {registrosFiltrados.map((r, i) => (
                <tr key={i}>
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

        {/* MOBILE */}
        <div className="mobile-only">
          {registrosFiltrados.map((r, i) => (
            <div key={i} className="historial-card">
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

        <img src="/krono2.1.png" alt="Krono Logo" className="logo-img" />
      </main>
    </div>
  );
}
