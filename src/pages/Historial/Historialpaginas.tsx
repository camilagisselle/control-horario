import { useState } from "react";
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

const registrosData: Registro[] = [
  // DICIEMBRE 2025
  { fecha: "01/12/2025", entrada: "08:00", inicioColacion: "13:00", finColacion: "14:00", salida: "17:00", total: "9.0 hrs" },
  { fecha: "02/12/2025", entrada: "08:05", inicioColacion: "13:05", finColacion: "14:05", salida: "17:05", total: "9.0 hrs" },
  { fecha: "03/12/2025", entrada: "07:55", inicioColacion: "12:50", finColacion: "13:50", salida: "16:55", total: "9.0 hrs" },
  { fecha: "04/12/2025", entrada: "08:15", inicioColacion: "13:30", finColacion: "14:30", salida: "17:15", total: "9.0 hrs" },
  { fecha: "05/12/2025", entrada: "08:00", inicioColacion: "13:00", finColacion: "14:00", salida: "15:00", total: "7.0 hrs" }, // Salida temprana
  { fecha: "09/12/2025", entrada: "08:10", inicioColacion: "13:15", finColacion: "14:15", salida: "17:10", total: "9.0 hrs" },
  { fecha: "10/12/2025", entrada: "08:00", inicioColacion: "13:00", finColacion: "14:00", salida: "17:00", total: "9.0 hrs" },
  { fecha: "11/12/2025", entrada: "07:58", inicioColacion: "13:02", finColacion: "14:02", salida: "16:58", total: "9.0 hrs" },
  { fecha: "12/12/2025", entrada: "08:20", inicioColacion: "13:20", finColacion: "14:20", salida: "17:20", total: "9.0 hrs" },
  { fecha: "15/12/2025", entrada: "08:00", inicioColacion: "13:00", finColacion: "14:00", salida: "17:00", total: "9.0 hrs" },
  { fecha: "16/12/2025", entrada: "08:05", inicioColacion: "13:10", finColacion: "14:10", salida: "17:05", total: "9.0 hrs" },
  { fecha: "17/12/2025", entrada: "08:00", inicioColacion: "13:00", finColacion: "14:00", salida: "17:00", total: "9.0 hrs" },
  { fecha: "18/12/2025", entrada: "07:45", inicioColacion: "12:45", finColacion: "13:45", salida: "16:45", total: "9.0 hrs" },
  { fecha: "19/12/2025", entrada: "08:00", inicioColacion: "13:00", finColacion: "14:00", salida: "13:00", total: "5.0 hrs" }, // Medio día
  { fecha: "22/12/2025", entrada: "08:10", inicioColacion: "13:15", finColacion: "14:15", salida: "17:10", total: "9.0 hrs" },
  { fecha: "23/12/2025", entrada: "08:00", inicioColacion: "13:00", finColacion: "14:00", salida: "17:00", total: "9.0 hrs" },
  { fecha: "24/12/2025", entrada: "08:00", inicioColacion: "12:00", finColacion: "12:30", salida: "14:00", total: "6.0 hrs" }, // Víspera
  { fecha: "29/12/2025", entrada: "08:30", inicioColacion: "13:30", finColacion: "14:30", salida: "17:30", total: "9.0 hrs" },
  { fecha: "30/12/2025", entrada: "08:00", inicioColacion: "13:00", finColacion: "14:00", salida: "17:00", total: "9.0 hrs" },
  
  // ENERO 2026
  { fecha: "02/01/2026", entrada: "09:00", inicioColacion: "13:30", finColacion: "14:30", salida: "18:00", total: "9.0 hrs" },
  { fecha: "05/01/2026", entrada: "08:00", inicioColacion: "13:00", finColacion: "14:00", salida: "17:00", total: "9.0 hrs" },
  { fecha: "06/01/2026", entrada: "08:10", inicioColacion: "13:10", finColacion: "14:10", salida: "17:10", total: "9.0 hrs" },
  { fecha: "07/01/2026", entrada: "07:55", inicioColacion: "12:55", finColacion: "13:55", salida: "16:55", total: "9.0 hrs" },
  { fecha: "08/01/2026", entrada: "08:00", inicioColacion: "13:00", finColacion: "14:00", salida: "17:00", total: "9.0 hrs" },
  { fecha: "09/01/2026", entrada: "08:05", inicioColacion: "13:05", finColacion: "14:05", salida: "16:05", total: "8.0 hrs" },
  { fecha: "12/01/2026", entrada: "08:00", inicioColacion: "13:00", finColacion: "14:00", salida: "17:00", total: "9.0 hrs" },
  { fecha: "13/01/2026", entrada: "08:00", inicioColacion: "13:00", finColacion: "14:00", salida: "17:00", total: "9.0 hrs" },
  { fecha: "14/01/2026", entrada: "08:12", inicioColacion: "13:15", finColacion: "14:15", salida: "17:12", total: "9.0 hrs" },
  { fecha: "15/01/2026", entrada: "08:00", inicioColacion: "13:00", finColacion: "14:00", salida: "17:00", total: "9.0 hrs" },
  { fecha: "16/01/2026", entrada: "07:50", inicioColacion: "12:50", finColacion: "13:50", salida: "15:50", total: "8.0 hrs" },
  { fecha: "19/01/2026", entrada: "08:00", inicioColacion: "13:00", finColacion: "14:00", salida: "17:00", total: "9.0 hrs" },
  { fecha: "20/01/2026", entrada: "07:50", inicioColacion: "12:45", finColacion: "13:45", salida: "16:50", total: "9.0 hrs" },
  { fecha: "21/01/2026", entrada: "08:05", inicioColacion: "13:05", finColacion: "14:05", salida: "17:05", total: "9.0 hrs" },
  { fecha: "22/01/2026", entrada: "08:00", inicioColacion: "13:00", finColacion: "14:00", salida: "17:00", total: "9.0 hrs" },
  { fecha: "23/01/2026", entrada: "08:00", inicioColacion: "13:00", finColacion: "14:00", salida: "16:00", total: "8.0 hrs" },
  { fecha: "26/01/2026", entrada: "08:00", inicioColacion: "13:00", finColacion: "14:00", salida: "17:00", total: "9.0 hrs" },
];
export default function HistorialPage() {
  const [fechaDesde, setFechaDesde] = useState<Date | null>(null);
  const [fechaHasta, setFechaHasta] = useState<Date | null>(null);
  const [registrosFiltrados, setRegistrosFiltrados] = useState<Registro[]>(registrosData);

  const manejarBusqueda = () => {
    const filtrados = registrosData.filter((r) => {
      const [dia, mes, anio] = r.fecha.split("/").map(Number);
      const fechaReg = new Date(anio, mes - 1, dia);
      if (fechaDesde && fechaHasta) return fechaReg >= fechaDesde && fechaReg <= fechaHasta;
      if (fechaDesde) return fechaReg >= fechaDesde;
      if (fechaHasta) return fechaReg <= fechaHasta;
      return true;
    });
    setRegistrosFiltrados(filtrados);
  };

  const manejarLimpiar = () => {
    setFechaDesde(null);
    setFechaHasta(null);
    setRegistrosFiltrados(registrosData);
  };

  return (
    <div className="dashboard-historial">
      <main className="historial-contenido">
        <h1 className="historial-titulo">Historial</h1>

        <div className="filtros-container">
          <div className="rango-fechas-wrapper">
            <div className="campo-datepicker">
              <label>Desde:</label>
              <DatePicker
                selected={fechaDesde}
                onChange={(date: Date | null) => setFechaDesde(date)}
                selectsStart
                startDate={fechaDesde ?? undefined}
                endDate={fechaHasta ?? undefined}
                dateFormat="dd/MM/yyyy"
                locale={es}
                placeholderText="DD/MM/AAAA"
                className="input-custom-datepicker"
              />
            </div>
            <div className="campo-datepicker">
              <label>Hasta:</label>
              <DatePicker
                selected={fechaHasta}
                onChange={(date: Date | null) => setFechaHasta(date)}
                selectsEnd
                startDate={fechaDesde ?? undefined}
                endDate={fechaHasta ?? undefined}
                minDate={fechaDesde ?? undefined}
                dateFormat="dd/MM/yyyy"
                locale={es}
                placeholderText="DD/MM/AAAA"
                className="input-custom-datepicker"
              />
            </div>
            <div className="grupo-botones-filtros">
              <button className="btn-historial-buscar" onClick={manejarBusqueda}>BUSCAR</button>
              <button className="btn-historial-limpiar" onClick={manejarLimpiar}>LIMPIAR</button>
            </div>
          </div>
        </div>

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
                  <td>{r.fecha}</td>
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

        {/* Mantenemos el mobile-only tal cual estaba en tu archivo */}
        <div className="mobile-only">
          {registrosFiltrados.map((r, i) => (
            <div key={i} className="historial-card">
              <div className="card-fecha">{r.fecha}</div>
              <div className="card-row"><span>Entrada</span><strong>{r.entrada}</strong></div>
              <div className="card-row"><span>Inicio colación</span><strong>{r.inicioColacion}</strong></div>
              <div className="card-row"><span>Fin colación</span><strong>{r.finColacion}</strong></div>
              <div className="card-row"><span>Salida</span><strong>{r.salida}</strong></div>
              <div className="card-total">{r.total}</div>
            </div>
          ))}
        </div>
        <img src="/krono2.1.png" alt="Logo" className="logo-img" />
      </main>
    </div>
  );
}