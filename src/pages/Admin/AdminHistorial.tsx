import React, { useState, useEffect, useRef } from "react";
import "./AdminHistorial.css";
import {
  obtenerTodosLosHistoriales,
  actualizarHistorial
} from "../../services/HistorialService";
import Modal from "../../Modals/modal";
import DatePicker from "react-datepicker";
import { es } from "date-fns/locale";

type Registro = {
  fecha: string;
  entrada: string;
  inicioColacion: string;
  finColacion: string;
  salida: string;
  total: string;
};
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

export interface HistorialDTO {
  id: number;
  correoUsuario: string;
  fecha: string;
  entrada?: string | null;
  inicioColacion?: string | null;
  finColacion?: string | null;
  salida?: string | null;
  totalHoras?: string | number | null;
}

interface ActualizarHistorialDTO {
  entrada?: string;
  inicioColacion?: string;
  finColacion?: string;
  salida?: string;
}

const AdminHistorial: React.FC = () => {
  const yaCargo = useRef(false);
  const [historial, setHistorial] = useState<HistorialItem[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [modalEdicion, setModalEdicion] = useState(false);
  const [registroEditando, setRegistroEditando] = useState<HistorialItem | null>(null);
  const [paginaActual, setPaginaActual] = useState(1);
  const [cargandoInicial, setCargandoInicial] = useState(true);

  const [fechaDesde, setFechaDesde] = useState<Date | null>(null);
  const [fechaHasta, setFechaHasta] = useState<Date | null>(null);
  const [registros, setRegistros] = useState<Registro[]>([]);
  const [registrosFiltrados, setRegistrosFiltrados] = useState<Registro[]>([]);

  const [editarEntrada, setEditarEntrada] = useState("");
  const [editarInicioColacion, setEditarInicioColacion] = useState("");
  const [editarFinColacion, setEditarFinColacion] = useState("");
  const [editarSalida, setEditarSalida] = useState("");
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mensaje, setMensaje] = useState<string | null>(null);

  const filasPorPagina = 5;

  const [modal, setModal] = useState({
    open: false,
    type: "success" as "success" | "error" | "info" | "confirm",
    title: "",
    message: "",
  });

  const indiceUltimo = paginaActual * filasPorPagina;
  const indicePrimero = indiceUltimo - filasPorPagina;

  useEffect(() => {
    if (yaCargo.current) return;
    yaCargo.current = true;

    const cargarHistorial = async () => {
      setCargandoInicial(true);
      try {
        const data = await obtenerTodosLosHistoriales();
        const historialFormateado: HistorialItem[] = data.map((item: HistorialDTO) => ({
          id: item.id,
          usuario: item.correoUsuario,
          fecha: item.fecha || "-",
          entrada: item.entrada || "-",
          inicioColacion: item.inicioColacion || "-",
          finColacion: item.finColacion || "-",
          salida: item.salida || "-",
          totalHoras: String(item.totalHoras ?? "0"),
        }));
        setHistorial(historialFormateado);
      } catch (error) {
        console.error("Error cargando historial:", error);
        setModal({
          open: true,
          type: "error",
          title: "Error",
          message: "No se pudo cargar el historial",
        });
      } finally {
        setCargandoInicial(false);
      }
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
    };

    cargarHistorial();
  }, []);

  const abrirEdicion = (registro: HistorialItem) => {
    setRegistroEditando(registro);
    setEditarEntrada(registro.entrada ?? "");
    setEditarInicioColacion(registro.inicioColacion && registro.inicioColacion !== "-" ? registro.inicioColacion : "");
    setEditarFinColacion(registro.finColacion && registro.finColacion !== "-" ? registro.finColacion : "");
    setEditarSalida(registro.salida && registro.salida !== "-" ? registro.salida : "");
    setError(null);
    setMensaje(null);
    setModalEdicion(true);
  };
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

  const handleGuardarEdicion = async () => {
    if (!registroEditando) return;

    setError(null);
    setMensaje(null);
    setCargando(true);
    try {
      const payload: Partial<ActualizarHistorialDTO> = {
        entrada: editarEntrada || undefined,
        inicioColacion: editarInicioColacion || undefined,
        finColacion: editarFinColacion || undefined,
        salida: editarSalida || undefined,
      };

      await actualizarHistorial(registroEditando!.id, payload);
      const data = await obtenerTodosLosHistoriales();

      const historialFormateado: HistorialItem[] = data.map((item: HistorialDTO) => ({
          id: item.id,
          usuario: item.correoUsuario,
          fecha: item.fecha ?? "",
          entrada: item.entrada ?? "",
          inicioColacion: item.inicioColacion ?? "",
          finColacion: item.finColacion ?? "",
          salida: item.salida ?? "",
          totalHoras: String(item.totalHoras ?? "0"),
      }));

      setHistorial(historialFormateado);
      setMensaje("Historial actualizado correctamente");
      setTimeout(() => {
        setModalEdicion(false);
        setMensaje(null);
      }, 1200);
    } catch (err) {
      console.error("Error actualizando historial:", err);
      setError("Error al actualizar el historial");
      setModal({
        open: true,
        type: "error",
        title: "Error",
        message: "No se pudo actualizar el registro",
      });
    } finally {
      setCargando(false);
    }
  };

  const historialFiltrado = historial.filter(
      (h) =>
          h.usuario.toLowerCase().includes(busqueda.toLowerCase()) ||
          h.fecha.includes(busqueda)
  );

  const historialPaginado = historialFiltrado.slice(indicePrimero, indiceUltimo);
  const totalPaginas = Math.ceil(historialFiltrado.length / filasPorPagina);

  return (
      <div className="admin-page">
        <h2 className="admin-title">Historial de Usuarios</h2>

        {cargandoInicial && (
            <div className="cargando-overlay">
              <div className="cargando-texto">Cargando historial...</div>
            </div>
        )}
        {cargando && (
          <div className="cargando-overlay">
            <div className="cargando-texto">Guardando cambios...</div>
          </div>
        )}

        {!cargandoInicial && (
            <>
              <div className="admin-actions">
          {/* 📅 FILTRO POR FECHA + 🔎 BUSCADOR DENTRO */}
          <div className="rango-fechas-wrapper">
            {/* 🔍 BUSCADOR */}
            <div className="search-box search-box-inline">
              <input
                type="text"
                placeholder="Buscar por usuario"
                value={busqueda}
                onChange={(e) => {
                  setBusqueda(e.target.value);
                  setPaginaActual(1);
                }}
              />
              <span className="search-icon">🔍</span>
            </div>

            <div className="campo-datepicker">
              <label>Desde:</label>
              <DatePicker
                selected={fechaDesde}
                onChange={(date: Date | null) => {
                  setFechaDesde(date);
                  setPaginaActual(1);
                }}
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
                onChange={(date: Date | null) => {
                  setFechaHasta(date);
                  setPaginaActual(1);
                }}
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

            {/* ✅ BOTONES */}
            <div className="acciones-filtro">
                  <button
                    className="btn-buscar"
                    type="button"
                    onClick={manejarBusqueda}
                > 
                  Buscar
                </button>
              <button
                className="btn-limpiar"
                type="button"
                onClick={manejarLimpiar}
              >
                Limpiar
              </button>
            </div>
          </div>
        </div>
              <div className="tabla-container">
                {historialPaginado.length === 0 ? (
                    <div className="tabla-vacia">Sin resultados</div>
                ) : (
                    <>
                      <table className="tablaAdminUsuarios">
                        <thead>
                        <tr>
                          <th>Usuario</th>
                          <th>Fecha</th>
                          <th>Entrada</th>
                          <th>Colación Inicio</th>
                          <th>Colación Fin</th>
                          <th>Salida</th>
                          <th>Acciones</th>
                        </tr>
                        </thead>
                        <tbody>
                        {historialPaginado.map((h) => (
                            <tr key={h.id}>
                              <td>{h.usuario}</td>
                              <td>{h.fecha.split("-").reverse().join("/")}</td>
                              <td>{h.entrada}</td>
                              <td>{h.inicioColacion}</td>
                              <td>{h.finColacion}</td>
                              <td>{h.salida}</td>
                              <td className="accionesAdminUsuarios">
                                <button className="btn-accion editar" onClick={() => abrirEdicion(h)}>
                                  ✏️
                                </button>
                              </td>
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

        {modalEdicion && registroEditando && (
            <div className="modal-overlay">
              <div className="modal-usuario admin-style">
                <h3 className="modal-title">Editar Jornada</h3>

                <div className="grid-campos">
                  <div className="campo">
                    <label>Entrada</label>
                    <input
                        type="time"
                        value={editarEntrada}
                        onChange={(e) => setEditarEntrada(e.target.value)}
                    />
                  </div>
                  <div className="campo">
                    <label>Colación Inicio</label>
                    <input
                        type="time"
                        value={editarInicioColacion}
                        onChange={(e) => setEditarInicioColacion(e.target.value)}
                    />
                  </div>
                  <div className="campo">
                    <label>Colación Fin</label>
                    <input
                        type="time"
                        value={editarFinColacion}
                        onChange={(e) => setEditarFinColacion(e.target.value)}
                    />
                  </div>
                  <div className="campo">
                    <label>Salida</label>
                    <input
                        type="time"
                        value={editarSalida}
                        onChange={(e) => setEditarSalida(e.target.value)}
                    />
                  </div>
                </div>

                {error && (
                    <div className="alerta alerta-error">
                      <span className="alerta-icono">⚠️</span>
                      <span className="alerta-texto">{error}</span>
                    </div>
                )}
                {mensaje && (
                    <div className="alerta alerta-exito">
                      <span className="alerta-icono">✓</span>
                      <span className="alerta-texto">{mensaje}</span>
                    </div>
                )}

                <div className="modal-actions">
                  <button
                      className="btn-secundario"
                      onClick={() => setModalEdicion(false)}
                      disabled={cargando}
                  >
                    Cancelar
                  </button>
                  <button
                      className="btn-primario"
                      onClick={handleGuardarEdicion}
                      disabled={cargando}
                  >
                    {cargando ? "Guardando..." : "Guardar"}
                  </button>
                </div>
              </div>
            </div>
        )}

        {/* MODAL */}
        <Modal
            open={modal.open}
            type={modal.type}
            title={modal.title}
            message={modal.message}
            onClose={() => setModal(prev => ({ ...prev, open: false }))}
        />
      </div>
  );
};

export default AdminHistorial;