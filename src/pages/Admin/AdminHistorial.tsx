import React, { useMemo, useState, useEffect } from "react";
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
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState("Todos");
  const [filtroTabla, setFiltroTabla] = useState("");
  const [modalEdicion, setModalEdicion] = useState(false);
  const [registroEditando, setRegistroEditando] = useState<HistorialItem | null>(null);

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
          totalHoras: "0" // calcular si es necesario ese dato
        }));

        setHistorial(historialFormateado);
      } catch (error) {
        console.error("Error cargando historial:", error);
      }
    };

    cargarHistorial();
  }, []);

  const filasFiltradas = useMemo(() => {
    let resultado = historial;
    if (usuarioSeleccionado !== "Todos") {
      resultado = resultado.filter((h) => h.usuario === usuarioSeleccionado);
    }
    if (filtroTabla.trim()) {
      const q = filtroTabla.toLowerCase();
      resultado = resultado.filter((r) =>
        r.usuario.toLowerCase().includes(q) || r.fecha.includes(q)
      );
    }
    return [...resultado].sort((a, b) => (a.fecha < b.fecha ? 1 : -1));
  }, [historial, usuarioSeleccionado, filtroTabla]);

  const abrirEdicion = (registro: HistorialItem) => {
    setRegistroEditando(registro);
    setModalEdicion(true);
  };

  const usuariosUnicos = useMemo(() => {
    const correos = historial.map(h => h.usuario);
    return ["Todos", ...Array.from(new Set(correos))];
  }, [historial]);

  return (
    <div className="dashboard-historial">
      <main className="historial-contenido">
        <h1 className="historial-titulo">Historial de Usuarios</h1>
        {/* 1. FILTROS */}
        <div className="admin-filtros">
          <div data-tooltip="Filtrar por empleado" className="filter-wrapper">
            <select
              value={usuarioSeleccionado}
              onChange={(e) => setUsuarioSeleccionado(e.target.value)}
            >
              {usuariosUnicos.map(u => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>
          </div>
          <div data-tooltip="Buscar usuario" className="filter-wrapper search-wide">
            <input 
              className="admin-search" 
              placeholder=" 🔍 Buscar por nombre al usuario"
              value={filtroTabla}
              onChange={(e) => setFiltroTabla(e.target.value)}
            />
          </div>
        </div>

        {/* 2. TABLA DESKTOP */}
        <div className="tabla-container desktop-only">
          <table>
            <thead>
              <tr>
                <th>Usuario</th>
                <th>Fecha</th>
                <th>Entrada</th>
                <th>Colación Inicio</th>
                <th>Colación Fin</th>
                <th>Salida</th>
                <th>Total</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filasFiltradas.map((r) => (
                <tr key={r.id}>
                  <td>{r.usuario}</td>
                  <td>{r.fecha.split('-').reverse().join('/')}</td>
                  <td>{r.entrada}</td>
                  <td>{r.inicioColacion}</td>
                  <td>{r.finColacion}</td>
                  <td>{r.salida}</td>
                  <td>{r.totalHoras} hrs</td>
                  <td>
                    <button 
                      className="btn-editar-hora" 
                      onClick={() => abrirEdicion(r)}
                      data-tooltip="Editar jornada"
                    >
                      ✏️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 3. CARDS MOBILE */}
        <div className="historial-cards-mobile mobile-only">
          {filasFiltradas.map((r) => (
            <div key={r.id} className="historial-card">
              <div className="card-header">
                <span className="card-usuario">{r.usuario}</span>
                <button className="btn-editar-card" onClick={() => abrirEdicion(r)}>✏️ Editar</button>
              </div>
              <div className="card-fecha">{r.fecha.split('-').reverse().join('/')}</div>
              <div className="card-grid">
                <div className="card-item"><strong>Entrada:</strong> {r.entrada}</div>
                <div className="card-item"><strong>Salida:</strong> {r.salida}</div>
                <div className="card-item"><strong>Colación:</strong> {r.inicioColacion} - {r.finColacion}</div>
                <div className="card-item total"><strong>Total:</strong> {r.totalHoras} hrs</div>
              </div>
            </div>
          ))}
        </div>

        {/* 4. MODAL DE EDICIÓN (Único y al final) */}
        {modalEdicion && registroEditando && (
          <div className="modal-overlay">
            <div className="modal-contenido"> 
              <h2 className="admin-title" style={{ marginBottom: '20px' }}>Editar Jornada</h2>
              
              <p style={{ textAlign: 'center', color: '#1f3bb3', fontWeight: 'bold', marginBottom: '20px' }}>
                Usuario: {registroEditando.usuario} <br/>
                <span style={{ fontSize: '0.9em', color: '#9b7bff' }}>
                  Fecha: {registroEditando.fecha.split('-').reverse().join('/')}
                </span>
              </p>
              <div className="grid-campos">
                <div className="campo">
                  <label>Entrada</label>
                  <input type="time" defaultValue={registroEditando.entrada} />
                </div>
                <div className="campo">
                  <label>Colación Inicio</label>
                  <input type="time" defaultValue={registroEditando.inicioColacion} />
                </div>
                <div className="campo">
                  <label>Colación Fin</label>
                  <input type="time" defaultValue={registroEditando.finColacion} />
                </div>
                <div className="campo">
                  <label>Salida</label>
                  <input type="time" defaultValue={registroEditando.salida} />
                </div>
              </div>
              <div className="modal-actions" style={{ marginTop: '30px' }}>
                <button className="btn-secundario" onClick={() => setModalEdicion(false)}>
                  Cancelar
                </button>
                <button 
                  className="btn-primario" 
                  onClick={() => setModalEdicion(false)}
                >
                  Guardar Cambios
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminHistorial;