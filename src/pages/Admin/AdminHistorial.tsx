import React, { useState, useEffect } from "react";
import "./AdminHistorial.css";
import { 
  obtenerTodosLosHistoriales,
  actualizarHistorial
} from "../../services/HistorialService";

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
  const [cargandoInicial, setCargandoInicial] = useState(true);
  
  const [editarEntrada, setEditarEntrada] = useState("");
  const [editarInicioColacion, setEditarInicioColacion] = useState("");
  const [editarFinColacion, setEditarFinColacion] = useState("");
  const [editarSalida, setEditarSalida] = useState("");
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mensaje, setMensaje] = useState<string | null>(null);
  
  const filasPorPagina = 5;

  const indiceUltimo = paginaActual * filasPorPagina;
  const indicePrimero = indiceUltimo - filasPorPagina;

  useEffect(() => {
    const cargarHistorial = async () => {
      setCargandoInicial(true);
      try {
        const data = await obtenerTodosLosHistoriales();
        const historialFormateado = data.map((item: any) => ({
          id: item.id,
          usuario: item.correoUsuario,
          fecha: item.fecha,
          entrada: item.entrada,
          inicioColacion: item.inicioColacion,
          finColacion: item.finColacion,
          salida: item.salida,
          totalHoras: "0",
        }));
        setHistorial(historialFormateado);
      } catch (error) {
        console.error("Error cargando historial:", error);
      } finally {
        setCargandoInicial(false);
      }
    };
    cargarHistorial();
  }, []);

  const abrirEdicion = (registro: HistorialItem) => {
    setRegistroEditando(registro);
    setEditarEntrada(registro.entrada);
    setEditarInicioColacion(registro.inicioColacion);
    setEditarFinColacion(registro.finColacion);
    setEditarSalida(registro.salida);
    setError(null);
    setMensaje(null);
    setModalEdicion(true);
  };

  const handleGuardarEdicion = async () => {
    if (!registroEditando) return;

    setError(null);
    setMensaje(null);

    if (!editarEntrada || !editarSalida) {
      setError("Entrada y Salida son obligatorios");
      return;
    }

    try {
      setCargando(true);

      await actualizarHistorial(registroEditando.id, {
        entrada: editarEntrada,
        inicioColacion: editarInicioColacion,
        finColacion: editarFinColacion,
        salida: editarSalida,
      });

      const data = await obtenerTodosLosHistoriales();
      const historialFormateado = data.map((item: any) => ({
        id: item.id,
        usuario: item.correoUsuario,
        fecha: item.fecha,
        entrada: item.entrada,
        inicioColacion: item.inicioColacion,
        finColacion: item.finColacion,
        salida: item.salida,
        totalHoras: "0",
      }));
      setHistorial(historialFormateado);

      setMensaje("Historial actualizado correctamente");

      setTimeout(() => {
        setModalEdicion(false);
        setMensaje(null);
      }, 1200);
    } catch (err) {
      setError("Error al actualizar el historial");
      console.error(err);
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
          <div className="cargando-contenido">
            <div className="cargando-texto">Cargando historial...</div>
          </div>
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
                          <button className="btn-accion editar" onClick={() => abrirEdicion(h)}>
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
    </div>
  );
};

export default AdminHistorial;