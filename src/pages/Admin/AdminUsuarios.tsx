import React, { useState } from "react";
import "./AdminUsuarios.css";

const AdminUsuarios: React.FC = () => {
  const [usuarios, setUsuarios] = useState([
    { id: 1, nombre: "Juanito Perez", correo: "juanito@indracompany.cl", rol: "Administrador", activo: false },
    { id: 2, nombre: "María López", correo: "maria@indracompany.cl", rol: "Colaborador", activo: true },
    { id: 3, nombre: "Miguel Muñoz", correo: "miguel@indracompany.cl", rol: "Colaborador", activo: true },
    { id: 4, nombre: "David Molina", correo: "david@indracompany.cl", rol: "Colaborador", activo: true },
  ]);

  const [busqueda, setBusqueda] = useState("");

  const usuariosFiltrados = usuarios.filter(
    (u) =>
      u.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      u.correo.toLowerCase().includes(busqueda.toLowerCase())
  );

  const toggleEstado = (id: number) => {
    setUsuarios((prev) =>
      prev.map((user) =>
        user.id === id ? { ...user, activo: !user.activo } : user
      )
    );
  };

  const eliminarUsuario = (id: number) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este usuario?")) {
      setUsuarios((prev) => prev.filter((user) => user.id !== id));
    }
  };

  return (
    <div className="usuarios-page">
      <aside className="sidebar">
        <button className="sidebar-btn">👥 Usuarios</button>
        <button
          className="sidebar-btn"
          onClick={() => {
            window.location.href = "/admin/historial";
          }}
        >
          📄 Historial
        </button>
        <button
          className="sidebar-btn logout-btn"
          onClick={() => {
            localStorage.clear();
            window.location.href = "/";
          }}
        >
          Cerrar sesión
        </button>
      </aside>

      <main className="usuarios-main">
        <header className="usuarios-header">
          <div>
            <h1>Administrador</h1>
            <h1>Francisca Andrade</h1>
          </div>
          <img src="/krono2.1.png" alt="Logo" className="usuarios-logo" />
        </header>

        <div className="usuarios-card">
          <div className="usuarios-header-input">
            <input
              type="text"
              placeholder="Buscar usuario"
              className="usuarios-busqueda"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
            <button className="usuarios-nuevo">  +Nuevo  </button>
          </div>

          <table className="usuarios-tabla">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Correo</th>
                <th>Rol</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuariosFiltrados.length > 0 ? (
                usuariosFiltrados.map((user) => (
                  <tr key={user.id}>
                    <td>{user.nombre}</td>
                    <td>{user.correo}</td>
                    <td>{user.rol}</td>
                    <td>
                      <span onClick={() => toggleEstado(user.id)} className={`estado ${user.activo ? "activo" : "inactivo"}`}>
                        {user.activo ? "🟢" : "🔴"}
                      </span>
                      <span className="accion editar">✏️</span>
                      <span
                        className="accion eliminar"
                        onClick={() => eliminarUsuario(user.id)}
                      >
                        🗑️
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} style={{ textAlign: "center" }}>
                    No se encontraron usuarios.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default AdminUsuarios;