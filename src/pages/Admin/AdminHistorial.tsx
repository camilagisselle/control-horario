import React, { useState, useEffect } from "react";
import "./AdminHistorial.css";
import { 
  obtenerTodosLosHistoriales,
  crearHistorial
} from "../../services/HistorialService";
import type { CrearHistorialDTO } from "../../services/HistorialService";
import Modal from "../../Modals/modal";
import axios from "axios";
import { getDeviceId } from "../../services/DeviceService";

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

const AdminHistorial: React.FC = () => {
  const [historial, setHistorial] = useState<HistorialItem[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const filasPorPagina = 5;
  const [cargando, setCargando] = useState(true);
  const [registroEditando, setRegistroEditando] = useState<HistorialItem | null>(null);
  const [editandoEntrada, setEditandoEntrada] = useState("");
  const [editandoInicioColacion, setEditandoInicioColacion] = useState("");
  const [editandoFinColacion, setEditandoFinColacion] = useState("");
  const [editandoSalida, setEditandoSalida] = useState("");
  const [guardando, setGuardando] = useState(false);

  const [modal, setModal] = useState({
    open: false,
    type: "success" as "success" | "error" | "info" | "confirm",
    title: "",
    message: "",
  });

  const indiceUltimo = paginaActual * filasPorPagina;
  const indicePrimero = indiceUltimo - filasPorPagina;

  useEffect(() => {
    cargarHistorial();
  }, []);

  const cargarHistorial = async () => {
    setCargando(true);
    try {
      const data = await obtenerTodosLosHistoriales();
      const historialFormateado = data.map((item: HistorialDTO) => ({
        id: item.id,
        usuario: item.correoUsuario,
        fecha: item.fecha,
        entrada: item.entrada || "",
        inicioColacion: item.inicioColacion || "",
        finColacion: item.finColacion || "",
        salida: item.salida || "",
        totalHoras: item.totalHoras?.toString() || "0",
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
      setCargando(false);
    }
  };

  const abrirEdicion = (registro: HistorialItem) => {
    setRegistroEditando(registro);
    setEditandoEntrada(registro.entrada);
    setEditandoInicioColacion(registro.inicioColacion);
    setEditandoFinColacion(registro.finColacion);
    setEditandoSalida(registro.salida);
  };

  const handleGuardarEdicion = async () => {
    if (!registroEditando) return;

    try {
      setGuardando(true);

      const data: CrearHistorialDTO = {
        fecha: registroEditando.fecha,
        entrada: editandoEntrada || undefined,
        inicioColacion: editandoInicioColacion || undefined,
        finColacion: editandoFinColacion || undefined,
        salida: editandoSalida || undefined,
      };

      const storedUser = localStorage.getItem("user");
      if (!storedUser) return;
      const user = JSON.parse(storedUser);
      const correo = user.correo;

      const deviceId = getDeviceId();
      console.log("UUID que vamos a enviar al back en historial:", deviceId);

      await crearHistorial(correo, data);
      await cargarHistorial();

      setModal({
        open: true,
        type: "success",
        title: "Historial actualizado",
        message: "Los cambios se guardaron correctamente",
      });

      setRegistroEditando(null);
    } catch (error) {
       if (axios.isAxiosError(error)) {
        if (error.response?.status === 403) {
            setModal({
              open: true,
              type: "error",
              title: "Error",
              message: "Este equipo no está autorizado para registrar asistencia",
            });
        }
        setRegistroEditando(null);
      }else {
        console.error("Error actualizando historial:", error);
        setModal({
          open: true,
          type: "error",
          title: "Error",
          message: "No se pudo actualizar el registro",
        });
      }
    } finally {
      setGuardando(false);
      setRegistroEditando(null);
    }
  };

  const historialFiltrado = historial.filter(
    (h) =>
      h.usuario.toLowerCase().includes(busqueda.toLowerCase()) ||
      h.fecha.includes(busqueda)
  );

  const historialPaginado = historialFiltrado.slice(indicePrimero, indiceUltimo);
  const totalPaginas = Math.max(
    1,
    Math.ceil(historialFiltrado.length / filasPorPagina)
  );

  return (
    <div className="admin-page">
      <h2 className="admin-title">Historial de Usuarios</h2>

      {cargando && (
        <div className="cargando-overlay">
          {/* <div className="cargando-contenido"> */}
            <div className="cargando-texto">Cargando historial...</div>
          {/* </div> */}
        </div>
      )}

      {!cargando && (
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
                        <td>{h.entrada || "-"}</td>
                        <td>{h.inicioColacion || "-"}</td>
                        <td>{h.finColacion || "-"}</td>
                        <td>{h.salida || "-"}</td>
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
              </>
            )}
            
            <div className="paginacion">
              <button
                onClick={() => setPaginaActual((p) => Math.max(1, p - 1))}
                disabled={paginaActual === 1}
              >
                ⬅
              </button>

              <span>
                Página {paginaActual} de {totalPaginas}
              </span>

              <button
                onClick={() =>
                  setPaginaActual((p) => Math.min(totalPaginas, p + 1))
                }
                disabled={paginaActual === totalPaginas}
              >
                ➡
              </button>
            </div>
          </div>
        </>
      )}

      {/* MODAL DE EDICIÓN */}
      {registroEditando && (
        <div className="modal-overlay">
          <div className="modal-usuario admin-style">
            <h3 className="modal-title">Editar Jornada</h3>
            <div className="modal-form">
              <div className="form-group">
                <label htmlFor="editarEntrada">Entrada</label>
                <input
                  id="editarEntrada"
                  type="time"
                  value={editandoEntrada}
                  onChange={(e) => setEditandoEntrada(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="editarInicioColacion">Colación Inicio</label>
                <input
                  id="editarInicioColacion"
                  type="time"
                  value={editandoInicioColacion}
                  onChange={(e) => setEditandoInicioColacion(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="editarFinColacion">Colación Fin</label>
                <input
                  id="editarFinColacion"
                  type="time"
                  value={editandoFinColacion}
                  onChange={(e) => setEditandoFinColacion(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="editarSalida">Salida</label>
                <input
                  id="editarSalida"
                  type="time"
                  value={editandoSalida}
                  onChange={(e) => setEditandoSalida(e.target.value)}
                />
              </div>

              <div className="modal-actions">
                <button
                  className="btn-secundario"
                  onClick={() => setRegistroEditando(null)}
                  disabled={guardando}
                >
                  Cancelar
                </button>
                <button
                  className="btn-primario"
                  onClick={handleGuardarEdicion}
                  disabled={guardando}
                >
                  {guardando ? "Guardando..." : "Guardar"}
                </button>
              </div>
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