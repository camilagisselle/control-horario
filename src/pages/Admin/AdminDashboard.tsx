import { useNavigate } from "react-router-dom";
import { 
  AlertTriangle, Clock, TrendingUp, 
  MessageSquare, History, Users 
} from "lucide-react";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const navigate = useNavigate();

  // Datos basados en tus 15 usuarios
  const marcajesOlvidados = [
    { id: 1, usuario: "Carlos Ruiz", entrada: "08:05", transcurrido: "9h" },
    { id: 2, usuario: "Patricia Morales", entrada: "09:00", transcurrido: "8h" }
  ];

  const incidencias = [
    { id: 101, usuario: "Ana Belén", msg: "Olvidé marcar salida ayer", fecha: "10m" },
    { id: 102, usuario: "Diego Salazar", msg: "Error en marcaje de entrada", fecha: "1h" }
  ];

  const historialCambios = [
    { id: 1, admin: "Francisca A.", usuario: "Juan Perez", mod: "08:15 → 08:00", motivo: "Error" },
    { id: 2, admin: "Francisca A.", usuario: "Maria Lopez", mod: "Salida → 18:05", motivo: "Olvido" },
    { id: 3, admin: "Francisca A.", usuario: "Roberto Jara", mod: "14:10 → 14:00", motivo: "Ajuste" }
  ];

  const rankingRetrasos = [
    { nombre: "Roberto Jara", cant: 5 },
    { nombre: "Lucía Fernández", cant: 3 },
    { nombre: "Ricardo Soto", cant: 2 }
  ];

  return (
    <div className="admin-dashboard">
      <main className="dashboard-contenido">
        <header className="dashboard-header-top">
          <h1>Panel de Control Krono</h1>
        </header>

        {/* TARJETAS SUPERIORES */}
        <div className="stats-grid">
          <div className="stat-card-clean">
            <div className="stat-icon-circle" style={{color: '#10b981', background: '#e9f9f6'}}>
              <Users size={24} />
            </div>
            <div className="stat-text">
              <strong>12 / 15</strong>
              <span>Presentes Hoy</span>
            </div>
          </div>
          <div className="stat-card-clean">
            <div className="stat-icon-circle" style={{color: '#f59e0b', background: '#fffbeb'}}>
              <Clock size={24} />
            </div>
            <div className="stat-text">
              <strong>3</strong>
              <span>Atrasos</span>
            </div>
          </div>
        </div>

        {/* CUADRÍCULA DE GESTIÓN */}
        <div className="dashboard-main-grid">
          
          {/* Marcajes Olvidados */}
          <section className="dashboard-card">
            <div className="card-header">
              <AlertTriangle size={18} color="#ef4444" />
              <h2>Marcajes Olvidados</h2>
            </div>
            <div className="card-body">
              {marcajesOlvidados.map(m => (
                <div key={m.id} className="item-row">
                  <p><strong>{m.usuario}</strong></p>
                  <div className="tooltip-container">
                    <span className="badge-red">Hace {m.transcurrido}</span>
                    <span className="tooltip-text">Turno excedido</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Buzón de Incidencias */}
          <section className="dashboard-card">
            <div className="card-header">
              <MessageSquare size={18} color="#1c2d8f" />
              <h2>Buzón de Incidencias</h2>
            </div>
            <div className="card-body">
              {incidencias.map(i => (
                <div key={i.id} className="feed-bubble">
                  <div className="feed-info">
                    <strong>{i.usuario}</strong>
                    <p>"{i.msg}"</p>
                  </div>
                  <button className="btn-fix-small" onClick={() => navigate("/admin/historial")}>
                    Corregir
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Ranking Retrasos */}
          <section className="dashboard-card">
            <div className="card-header">
              <TrendingUp size={18} color="#f59e0b" />
              <h2>Retrasos Frecuentes</h2>
            </div>
            <div className="card-body">
              {rankingRetrasos.map((r, index) => (
                <div key={index} className="item-row">
                  <span>{index + 1}. {r.nombre}</span>
                  <div className="tooltip-container">
                    <span className="count-tag-simple">{r.cant}</span>
                    <span className="tooltip-text">Faltas mes</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Auditoría de Cambios */}
          <section className="dashboard-card full-width">
            <div className="card-header">
              <History size={18} color="#64748b" />
              <h2>Registro de Auditoría</h2>
            </div>
            <div className="table-container">
              <table className="dashboard-table">
                <thead>
                  <tr>
                    <th>Admin</th>
                    <th>Empleado</th>
                    <th>Mod</th>
                    <th>Motivo</th>
                  </tr>
                </thead>
                <tbody>
                  {historialCambios.map(h => (
                    <tr key={h.id}>
                      <td>{h.admin}</td>
                      <td>{h.usuario}</td>
                      <td className="mod-cell">{h.mod}</td>
                      <td>
                        <div className="tooltip-container">
                          <span className="reason-label">{h.motivo}</span>
                          <span className="tooltip-text">Modificado: 26/01</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        <img src="/krono2.1.png" alt="Logo" className="perfil-logo" />
      </main>
    </div>
  );
};

export default AdminDashboard;