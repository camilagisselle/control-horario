import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import { es } from "date-fns/locale";
import "react-datepicker/dist/react-datepicker.css";
import "./Historialpaginas.css";
import { obtenerHistorialPorCorreo } from "../../services/HistorialService";

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
  const [modalWarning, setModalWarning] = useState(false);
  const [mensajeWarning, setMensajeWarning] = useState("");

  // Obtenemos el correo del usuario logueadoW
  const correoUsuario = (() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      return JSON.parse(storedUser).correo;
    }
    return null;
  })();

  useEffect(() => {
    const cargarRegistros = async () => {
      if (!correoUsuario) return;

      try {
        const data = await obtenerHistorialPorCorreo(correoUsuario);
        const registrosFormateados: Registro[] = data.map((item: any) => ({
          fecha: item.fecha,
          entrada: item.entrada || "-",
          inicioColacion: item.inicioColacion || "-",
          finColacion: item.finColacion || "-",
          salida: item.salida || "-",
          total: item.totalHoras || "0",
        }));

        setRegistros(registrosFormateados);
        setRegistrosFiltrados(registrosFormateados);
      } catch (error) {
        console.error("Error cargando historial:", error);
      }
    };

    cargarRegistros();
  }, [correoUsuario]);

  const manejarBusqueda = () => {
    if (fechaDesde && fechaHasta && fechaDesde > fechaHasta) {
      setMensajeWarning("La fecha 'Desde' no puede ser mayor que la fecha 'Hasta'.");
      setModalWarning(true);
      return;
    }

    const filtrados = registros.filter((r) => {
      const [anio, mes, dia] = r.fecha.split("-").map(Number);
      const fechaReg = new Date(anio, mes - 1, dia); // ← SIN UTC bug

      const desde = fechaDesde
        ? new Date(fechaDesde.getFullYear(), fechaDesde.getMonth(), fechaDesde.getDate())
        : null;

      const hasta = fechaHasta
        ? new Date(fechaHasta.getFullYear(), fechaHasta.getMonth(), fechaHasta.getDate())
        : null;

        if (desde && hasta) {
          return fechaReg >= desde && fechaReg <= hasta;
        }

        if (desde) {
          return fechaReg >= desde;
        }

        if (hasta) {
          return fechaReg <= hasta;
        }

        return true;
      });

      setRegistrosFiltrados(filtrados);
  };

  const formatearFecha = (fecha: string) => {
    const date = new Date(fecha);

    const dia = String(date.getDate()).padStart(2, "0");
    const mes = String(date.getMonth() + 1).padStart(2, "0");
    const anio = date.getFullYear();

    return `${dia}/${mes}/${anio}`;
  };

  const manejarLimpiar = () => {
    setFechaDesde(null);
    setFechaHasta(null);
    setRegistrosFiltrados(registros);
  };


  return (
    <div className="dashboard-historial">
      <main className="historial-contenido">
        <h1 className="historial-titulo">Mi Historial</h1>

        {/* FILTROS */}
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
                portalId="root-portal"
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
                portalId="root-portal"
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
        {/* TABLA DESKTOP */}
        <div className="tabla-wrapper desktop-only">
          <div className="tabla-header-fixed">
            <div className="tabla-header-cell">Fecha</div>
            <div className="tabla-header-cell">Entrada</div>
            <div className="tabla-header-cell">Inicio colación</div>
            <div className="tabla-header-cell">Fin colación</div>
            <div className="tabla-header-cell">Salida</div>
            <div className="tabla-header-cell">Total</div>
          </div>

          <div className="tabla-container-scroll">
            <table className="tabla-sin-header">
              <tbody>
                {registrosFiltrados.map((r, i) => (
                  <tr key={i}>
                    <td>{formatearFecha(r.fecha)}</td>
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
        {modalWarning && (
          <div className="modal-overlay">
            <div className="modal-contenido">
              <h2 className="admin-title" style={{ marginBottom: "20px" }}>
                Atención
              </h2>

              <p style={{ textAlign: "center", marginBottom: "25px" }}>
                {mensajeWarning}
              </p>

              <div className="modal-actions">
                <button
                  className="btn-primario"
                  onClick={() => setModalWarning(false)}
                >
                  Aceptar
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}