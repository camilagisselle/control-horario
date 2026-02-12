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

interface UserSummary {
  id: number;
  nombre: string;
  apellido: string;
  correo: string;
}

const USUARIOS: UserSummary[] = [
  { id: 1, nombre: "Camila", apellido: "Pinilla", correo: "camila@indracompany.cl" },
  { id: 2, nombre: "Noemi", apellido: "Muñoz", correo: "noemi@indracompany.cl" },
  { id: 3, nombre: "Juanito", apellido: "Pérez", correo: "jperez@indracompany.cl" },
  { id: 4, nombre: "María", apellido: "López", correo: "m.lopez@indracompany.cl" },
  { id: 5, nombre: "Carlos", apellido: "Sanhueza", correo: "csanhueza@indracompany.cl" },
  { id: 6, nombre: "Francisca", apellido: "Andrade", correo: "fandrade@indracompany.cl" },
  { id: 7, nombre: "Ricardo", apellido: "Morgado", correo: "rmorgado@indracompany.cl" },
  { id: 8, nombre: "Valentina", apellido: "Rojas", correo: "vrojas@indracompany.cl" },
  { id: 9, nombre: "Sebastian", apellido: "Vargas", correo: "svargas@indracompany.cl" },
  { id: 10, nombre: "Javiera", apellido: "Contreras", correo: "jcontreras@indracompany.cl" },
  { id: 11, nombre: "Andrés", apellido: "Figueroa", correo: "afigueroa@indracompany.cl" },
  { id: 12, nombre: "Beatriz", apellido: "Solís", correo: "bsolis@indracompany.cl" },
  { id: 13, nombre: "Matías", apellido: "Fuentes", correo: "mfuentes@indracompany.cl" },
  { id: 14, nombre: "Daniela", apellido: "Torres", correo: "dtorres@indracompany.cl" },
  { id: 15, nombre: "Gonzalo", apellido: "Tapia", correo: "gtapia@indracompany.cl" },
];

const AdminHistorial: React.FC = () => {
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState("Todos");
  const [filtroTabla, setFiltroTabla] = useState("");
  const [modalEdicion, setModalEdicion] = useState(false);
  const [historial, setHistorial] = useState<HistorialItem[]>([]);
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
          totalHoras: "0" // después lo calculamos
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

  const USUARIOS_NOMBRES = ["Todos", ...USUARIOS.map(u => `${u.nombre} ${u.apellido}`)];

  return (
    <div className="dashboard-historial">
      <main className="historial-contenido">
        <h1 className="historial-titulo">Historial de Usuarios</h1>

       {/* 1. FILTROS */}
<div className="admin-filtros">
  <div data-tooltip="Filtrar por empleado" className="filter-wrapper">
    <select 
      className="admin-select" 
      value={usuarioSeleccionado} 
      onChange={(e) => setUsuarioSeleccionado(e.target.value)}
    >
      {USUARIOS_NOMBRES.map(n => <option key={n} value={n}>{n}</option>)}
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