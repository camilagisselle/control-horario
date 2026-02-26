import { useState, useEffect, useRef } from "react";
import DatePicker from "react-datepicker";
import { es } from "date-fns/locale";
import "react-datepicker/dist/react-datepicker.css";
import "./Historialpaginas.css";
import { obtenerHistorialPorCorreo } from "../../services/HistorialService";
import Modal from "../../Modals/modal";

type Registro = {
  fecha: string;
  entrada: string;
  inicioColacion: string;
  finColacion: string;
  salida: string;
  total: string;
};

export interface RegistroDTO {
  fecha: string;
  entrada: string | null;
  inicioColacion: string | null;
  finColacion: string | null;
  salida: string | null;
  totalHoras: string | number | null;
}

interface RegistroAPI {
  fecha: string;
  entrada?: string | null;
  inicioColacion?: string | null;
  finColacion?: string | null;
  salida?: string | null;
  totalHoras?: string | number | null;
}

export default function HistorialPage() {
  const yaCargo = useRef(false);
  const [fechaDesde, setFechaDesde] = useState<Date | null>(null);
  const [fechaHasta, setFechaHasta] = useState<Date | null>(null);
  const [registros, setRegistros] = useState<Registro[]>([]);
  const [registrosFiltrados, setRegistrosFiltrados] = useState<Registro[]>([]);
  const [paginaActual, setPaginaActual] = useState(1);
  const registrosPorPagina = 5;
  const [cargando, setCargando] = useState(true);

  const [modal, setModal] = useState({
    open: false,
    type: "info" as "success" | "error" | "info" | "confirm",
    title: "",
    message: "",
  });

  const correoUsuario = (() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      return JSON.parse(storedUser).correo;
    }
    return null;
  })();

  useEffect(() => {
    if (yaCargo.current) return;
    yaCargo.current = true;

    const cargarRegistros = async () => {
      if (!correoUsuario) {
        setCargando(false);
        return;
      }

      setCargando(true);
      try {
        const data = await obtenerHistorialPorCorreo(correoUsuario);

        const registrosFormateados: Registro[] = data.map((item: RegistroAPI) => ({
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


      } finally {
        setCargando(false);
      }
    };

    cargarRegistros();
  }, [correoUsuario]);

  const indiceUltimo = paginaActual * registrosPorPagina;
  const indicePrimero = indiceUltimo - registrosPorPagina;
  const registrosPaginados = registrosFiltrados.slice(indicePrimero, indiceUltimo);

  const totalPaginas = Math.max(
    1,
    Math.ceil(registrosFiltrados.length / registrosPorPagina)
  );

  const manejarBusqueda = () => {
    if (fechaDesde && fechaHasta && fechaDesde > fechaHasta) {
      setModal({
        open: true,
        type: "info",
        title: "Atención",
        message: "La fecha 'Desde' no puede ser mayor que la fecha 'Hasta'.",
      });
      return;
    }

    const filtrados = registros.filter((r) => {
      const [anio, mes, dia] = r.fecha.split("-").map(Number);
      const fechaReg = new Date(anio, mes - 1, dia);

      let okDesde = true;
      let okHasta = true;

      if (fechaDesde) {
        okDesde =
          fechaReg >=
          new Date(
            fechaDesde.getFullYear(),
            fechaDesde.getMonth(),
            fechaDesde.getDate()
          );
      }
      if (fechaHasta) {
        okHasta =
          fechaReg <=
          new Date(
            fechaHasta.getFullYear(),
            fechaHasta.getMonth(),
            fechaHasta.getDate()
          );
      }

      return okDesde && okHasta;
    });

    setRegistrosFiltrados(filtrados);
    setPaginaActual(1);
  };

  const manejarLimpiar = () => {
    setFechaDesde(null);
    setFechaHasta(null);
    setRegistrosFiltrados(registros);
    setPaginaActual(1);
  };

  const formatearFecha = (fecha: string) => {
    const [anio, mes, dia] = fecha.split("-").map(Number);
    return `${String(dia).padStart(2, "0")}/${String(mes).padStart(2, "0")}/${anio}`;
  };

  return (
    <div className="admin-page">
      <h1 className="historial-titulo">Historial</h1>

      {cargando && (
        <div className="cargando-overlay">
          <div className="cargando-texto">Cargando historial...</div>
        </div>
      )}

      {!cargando && (
        <>
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

          <div className="tabla-container">
            {registrosPaginados.length === 0 ? (
              <div className="tabla-vacia">Sin resultados</div>
            ) : (
              <>
                <table className="tablaAdminUsuarios">
                  <thead>
                    <tr>
                      <th>Fecha</th>
                      <th>Entrada</th>
                      <th>Inicio colación</th>
                      <th>Fin colación</th>
                      <th>Salida</th>
                    </tr>
                  </thead>
                  <tbody>
                    {registrosPaginados.map((r, i) => (
                      <tr key={i}>
                        <td>{formatearFecha(r.fecha)}</td>
                        <td>{r.entrada}</td>
                        <td>{r.inicioColacion}</td>
                        <td>{r.finColacion}</td>
                        <td>{r.salida}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="paginacion">
                  <div className="paginacion-box">
                    <button
                      onClick={() => setPaginaActual(paginaActual - 1)}
                      disabled={paginaActual === 1}
                    >
                      ⬅
                    </button>

                    <span>
                      Página {paginaActual} de {totalPaginas}
                    </span>

                    <button
                      onClick={() => setPaginaActual(paginaActual + 1)}
                      disabled={paginaActual === totalPaginas}
                    >
                      ➡
                    </button>
                    
                  </div>
                </div>
              </>
            )}
          </div>
        </>
      )}

      <Modal
        open={modal.open}
        type={modal.type}
        title={modal.title}
        message={modal.message}
        onClose={() => setModal((prev) => ({ ...prev, open: false }))}
      />
    </div>
);  }
