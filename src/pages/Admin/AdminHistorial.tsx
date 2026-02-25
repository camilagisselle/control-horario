import React, { useState, useEffect, useRef } from "react";
import "./AdminHistorial.css";
import {
  obtenerTodosLosHistoriales,
  actualizarHistorial
} from "../../services/HistorialService";
import Modal from "../../Modals/modal";

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

  // 🔥 Fecha actual en formato YYYY-MM-DD
  const hoy = new Date().toISOString().split("T")[0];

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
    };

    cargarHistorial();
  }, []);

  const abrirEdicion = (registro: HistorialItem) => {
    setRegistroEditando(registro);
    setEditarEntrada(registro.entrada ?? "");
    setEditarInicioColacion(registro.inicioColacion !== "-" ? registro.inicioColacion : "");
    setEditarFinColacion(registro.finColacion !== "-" ? registro.finColacion : "");
    setEditarSalida(registro.salida !== "-" ? registro.salida : "");
    setError(null);
    setMensaje(null);
    setModalEdicion(true);
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

      await actualizarHistorial(registroEditando.id, payload);
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

  // 🔥 FILTRO PRINCIPAL
  const historialFiltrado = historial.filter((h) => {

    // 👉 Si NO hay búsqueda → solo registros del día actual
    if (busqueda.trim() === "") {
      return h.fecha === hoy;
    }

    // 👉 Si hay búsqueda → buscar en todo el historial
    return (
      h.usuario.toLowerCase().includes(busqueda.toLowerCase()) ||
      h.fecha.includes(busqueda)
    );
  });

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

      {!cargandoInicial && (
        <>
          <div className="admin-actions">
            <div className="search-box">
              <input
                type="text"
                placeholder="Buscar por usuario o fecha"
                value={busqueda}
                onChange={(e) => {
                  setBusqueda(e.target.value);
                  setPaginaActual(1);
                }}
              />
              <span className="search-icon">🔍</span>
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
                          <button
                            className="btn-accion editar"
                            onClick={() => abrirEdicion(h)}
                          >
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