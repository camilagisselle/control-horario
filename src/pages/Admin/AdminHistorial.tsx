import React, { useState, useEffect } from "react";
import "./AdminHistorial.css";
import { obtenerTodosLosHistoriales } from "../../services/HistorialService";

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

  const indiceUltimo = paginaActual * filasPorPagina;
  const indicePrimero = indiceUltimo - filasPorPagina;

  useEffect(() => {
    const cargarHistorial = async () => {
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
      }
    };
    cargarHistorial();
  }, []);

  const abrirEdicion = (registro: HistorialItem) => {
    setRegistroEditando(registro);
    setModalEdicion(true);
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

      {/* FILTRO */}
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

      {/* TABLA */}
      <div className="tabla-container">
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

        {/* PAGINACIÓN */}
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
      </div>

      {/* MODAL EDICIÓN */}
      {modalEdicion && registroEditando && (
        <div className="modal-overlay">
          <div className="modal-usuario admin-style">
            <h3 className="modal-title">Editar Jornada</h3>
            <div className="modal-form">
              <div className="form-group">
                <label>Entrada</label>
                <input type="time" defaultValue={registroEditando.entrada} />
              </div>
              <div className="form-group">
                <label>Colación Inicio</label>
                <input type="time" defaultValue={registroEditando.inicioColacion} />
              </div>
              <div className="form-group">
                <label>Colación Fin</label>
                <input type="time" defaultValue={registroEditando.finColacion} />
              </div>
              <div className="form-group">
                <label>Salida</label>
                <input type="time" defaultValue={registroEditando.salida} />
              </div>
            </div>
            <div className="modal-actions">
              <button className="btn-secundario" onClick={() => setModalEdicion(false)}>
                Cancelar
              </button>
              <button className="btn-primario" onClick={() => setModalEdicion(false)}>
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminHistorial;
