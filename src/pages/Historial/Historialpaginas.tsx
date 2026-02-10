import { useEffect, useState } from "react";
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

export default function HistorialPage() {
  const [fechaDesde, setFechaDesde] = useState<Date | null>(null);
  const [fechaHasta, setFechaHasta] = useState<Date | null>(null);
  const [registros, setRegistros] = useState<Registro[]>([]);
  const [registrosFiltrados, setRegistrosFiltrados] = useState<Registro[]>([]);


  useEffect(() => {
    fetch("http://localhost:8080/v1/control-horario/historial/manuel@usuario.cl")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error al obtener historial");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Historial desde backend:", data);

      
        setRegistros(data);
        setRegistrosFiltrados(data);
      })
      .catch((error) => {
        console.error("Error en fetch:", error);
      });
  }, []);

  const manejarBusqueda = () => {
    const filtrados = registros.filter((r) => {
      const [dia, mes, anio] = r.fecha.split("/").map(Number);
      const fechaReg = new Date(anio, mes - 1, dia);

      if (fechaDesde && fechaHasta)
        return fechaReg >= fechaDesde && fechaReg <= fechaHasta;
      if (fechaDesde) return fechaReg >= fechaDesde;
      if (fechaHasta) return fechaReg <= fechaHasta;

      return true;
    });

    setRegistrosFiltrados(filtrados);
  };

  const manejarLimpiar = () => {
    setFechaDesde(null);
    setFechaHasta(null);
    setRegistrosFiltrados(registros);
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
              <button className="btn-historial-buscar" onClick={manejarBusqueda}>
                BUSCAR
              </button>
              <button className="btn-historial-limpiar" onClick={manejarLimpiar}>
                LIMPIAR
              </button>
            </div>
          </div>
        </div>

        {/* NUEVA ESTRUCTURA: Encabezado Separado */}
        <div className="tabla-wrapper desktop-only">
          {/* ENCABEZADO FIJO FUERA DE LA TABLA */}
          <div className="tabla-header-fixed">
            <div className="tabla-header-cell">Fecha</div>
            <div className="tabla-header-cell">Entrada</div>
            <div className="tabla-header-cell">Inicio colación</div>
            <div className="tabla-header-cell">Fin colación</div>
            <div className="tabla-header-cell">Salida</div>
            <div className="tabla-header-cell">Total</div>
          </div>

          {/* TABLA CON SOLO TBODY */}
          <div className="tabla-container-scroll">
            <table className="tabla-sin-header">
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
        </div>

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
      </main>
    </div>
  );
}