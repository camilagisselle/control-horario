import React, { useState, useEffect } from "react";
import "./AdminHistorial.css";
import { 
  obtenerTodosLosHistoriales,
  actualizarHistorial
} from "../../services/HistorialService";
import type { ActualizarHistorialDTO } from "../../services/HistorialService";

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

const AdminHistorial: React.FC = () => {
  const [historial, setHistorial] = useState<HistorialItem[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [modalEdicion, setModalEdicion] = useState(false);
  const [registroEditando, setRegistroEditando] = useState<HistorialItem | null>(null);
  const [paginaActual, setPaginaActual] = useState(1);
  const filasPorPagina = 5;
  const [cargando, setCargando] = useState(true);
  
  const [editandoEntrada, setEditandoEntrada] = useState("");
  const [editandoInicioColacion, setEditandoInicioColacion] = useState("");
  const [editandoFinColacion, setEditandoFinColacion] = useState("");
  const [editandoSalida, setEditandoSalida] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mensaje, setMensaje] = useState<string | null>(null);

  const indiceUltimo = paginaActual * filasPorPagina;
  const indicePrimero = indiceUltimo - filasPorPagina;

  useEffect(() => {
    cargarHistorial();
  }, []);

  const cargarHistorial = async () => {
    setCargando(true);
    try {
      const data = await obtenerTodosLosHistoriales();
      const historialFormateado = data.map((item: any) => ({
        id: item.id,
        usuario: item.correoUsuario,
        fecha: item.fecha,
        entrada: item.entrada || "",
        inicioColacion: item.inicioColacion || "",
        finColacion: item.finColacion || "",
        salida: item.salida || "",
        totalHoras: "0",
      }));
      setHistorial(historialFormateado);
    } catch (error) {
      console.error("Error cargando historial:", error);
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
    setError(null);
    setMensaje(null);
    setModalEdicion(true);
  };

  const handleGuardarEdicion = async () => {
    if (!registroEditando) return;

    setError(null);
    setMensaje(null);

    try {
      setGuardando(true);

      const data: ActualizarHistorialDTO = {
        entrada: editandoEntrada || undefined,
        inicioColacion: editandoInicioColacion || undefined,
        finColacion: editandoFinColacion || undefined,
        salida: editandoSalida || undefined,
      };

      await actualizarHistorial(registroEditando.id, data);
      await cargarHistorial();

      setMensaje("Historial actualizado correctamente");

      setTimeout(() => {
        setModalEdicion(false);
        setMensaje(null);
      }, 1200);
    } catch (error) {
      console.error("Error actualizando historial:", error);
      setError("Error al actualizar el historial");
    } finally {
      setGuardando(false);
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

      {cargando && (
        <div className="cargando-overlay">
          <div className="cargando-contenido">
            <div className="cargando-texto">Cargando historial...</div>
          </div>
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

                <div className="paginacion">
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
              </>
            )}
          </div>
        </>
      )}

      {modalEdicion && registroEditando && (
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
            </div>

            {error && <p style={{ color: "#dc2626" }}>{error}</p>}
            {mensaje && <p style={{ color: "#16a34a" }}>{mensaje}</p>}

            <div className="modal-actions">
              <button
                className="btn-secundario"
                onClick={() => setModalEdicion(false)}
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
      )}
    </div>
  );
};

export default AdminHistorial;