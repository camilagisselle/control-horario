import React, { useState } from "react";
import "./AdminUsuarios.css";

interface Usuario {
  id: number;
  nombre: string;
  apellido: string;
  correo: string; 
  password?: string;
  rol: "Administrador" | "Colaborador";
  activo: boolean;
}

interface FormData {
  nombre: string;
  apellido: string;
  correo: string;
  password: string;
  repetirPassword: string;
  rol: "Administrador" | "Colaborador";
}

const AdminUsuarios: React.FC = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([
    { id: 1, nombre: "Juanito", apellido: "Perez", correo: "juanito@indracompany.cl", rol: "Administrador", activo: false },
    { id: 2, nombre: "María", apellido: "López", correo: "maria@indracompany.cl", rol: "Colaborador", activo: true },
    { id: 3, nombre: "Miguel", apellido: "Muñoz", correo: "miguel@indracompany.cl", rol: "Colaborador", activo: true },
    { id: 4, nombre: "David", apellido: "Molina", correo: "david@indracompany.cl", rol: "Colaborador", activo: true },
  ]);

  const [busqueda, setBusqueda] = useState("");
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [usuarioEditando, setUsuarioEditando] = useState<number | null>(null);
  const [modalExito, setModalExito] = useState(false);
  const [mensajeExito, setMensajeExito] = useState("");

  const [formData, setFormData] = useState<FormData>({
    nombre: "",
    apellido: "",
    correo: "",
    password: "",
    repetirPassword: "",
    rol: "Colaborador",
  });

  const usuariosFiltrados = usuarios.filter(
    (u) =>
      u.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      u.apellido.toLowerCase().includes(busqueda.toLowerCase()) ||
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

  const abrirModalNuevo = () => {
    setModoEdicion(false);
    setUsuarioEditando(null);
    setFormData({
      nombre: "",
      apellido: "",
      correo: "",
      password: "",
      repetirPassword: "",
      rol: "Colaborador",
    });
    setModalAbierto(true);
  };

  const abrirModalEditar = (usuario: Usuario) => {
    setModoEdicion(true);
    setUsuarioEditando(usuario.id);
    setFormData({
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      correo: usuario.correo,
      password: "",
      repetirPassword: "",
      rol: usuario.rol,
    });
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setFormData({
      nombre: "",
      apellido: "",
      correo: "",
      password: "",
      repetirPassword: "",
      rol: "Colaborador",
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const guardarUsuario = () => {
    if (!formData.nombre || !formData.apellido || !formData.correo) {
      alert("Por favor completa todos los campos requeridos");
      return;
    }

    if (!modoEdicion && (!formData.password || formData.password !== formData.repetirPassword)) {
      alert("Las contraseñas no coinciden");
      return;
    }

    if (modoEdicion && formData.password && formData.password !== formData.repetirPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }

    if (modoEdicion && usuarioEditando !== null) {
      setUsuarios((prev) =>
        prev.map((user) =>
          user.id === usuarioEditando
            ? {
                ...user,
                nombre: formData.nombre,
                apellido: formData.apellido,
                correo: formData.correo,
                rol: formData.rol,
              }
            : user
        )
      );
      setMensajeExito("REGISTRO ACTUALIZADO");
    } else {
      const nuevoUsuario: Usuario = {
        id: Math.max(...usuarios.map((u) => u.id), 0) + 1,
        nombre: formData.nombre,
        apellido: formData.apellido,
        correo: formData.correo,
        rol: formData.rol,
        activo: true,
      };
      setUsuarios((prev) => [...prev, nuevoUsuario]);
      setMensajeExito("USUARIO CREADO EXITOSAMENTE!");
    }

    cerrarModal();
    setModalExito(true);
    setTimeout(() => setModalExito(false), 3000);
  };

  return (
    <div className="usuarios-page">
      <div className="usuarios-container">
        <h1 className="page-title">ADMINISTRADOR DE USUARIOS</h1>

        <div className="usuarios-card">
          <div className="card-header">
            <input
              type="text"
              placeholder="🔍 Buscar usuario"
              className="search-input"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              title="Buscar por nombre, apellido o correo"
            />
            <button className="btn-nuevo" onClick={abrirModalNuevo} title="Crear nuevo usuario">
              + Nuevo
            </button>
          </div>

          <div className="table-wrapper">
            <table className="usuarios-tabla">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Correo electrónico</th>
                  <th>Rol</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usuariosFiltrados.length > 0 ? (
                  usuariosFiltrados.map((user) => (
                    <tr key={user.id}>
                      <td>{user.nombre} {user.apellido}</td>
                      <td>{user.correo}</td>
                      <td>{user.rol}</td>
                      <td>
                        <div className="acciones">
                          <button
                            className={`btn-estado ${user.activo ? "activo" : "inactivo"}`}
                            onClick={() => toggleEstado(user.id)}
                            title={user.activo ? "Usuario activo" : "Usuario inactivo"}
                          >
                            ●
                          </button>
                          <button
                            className="btn-accion editar"
                            onClick={() => abrirModalEditar(user)}
                            title="Editar usuario"
                          >
                            ✏️
                          </button>
                          <button
                            className="btn-accion eliminar"
                            onClick={() => eliminarUsuario(user.id)}
                            title="Eliminar usuario"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="no-results">
                      No se encontraron usuarios.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="paginacion">
            <button className="btn-paginacion" title="Página anterior">Anterior</button>
            <span className="pagina-actual">1</span>
            <button className="btn-paginacion" title="Página siguiente">Siguiente</button>
          </div>
        </div>
      </div>

      {/* Modal Crear/Editar Usuario */}
      {modalAbierto && (
        <div className="modal-overlay" onClick={cerrarModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={cerrarModal} title="Cerrar">×</button>
            <h2 className="modal-title">{modoEdicion ? "Editar Usuario" : "Crear Nuevo Usuario"}</h2>

            <div className="form-grid">
              <div className="form-group">
                <label>Nombre *</label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  placeholder="Ingresa el nombre"
                  required
                />
              </div>

              <div className="form-group">
                <label>Apellido *</label>
                <input
                  type="text"
                  name="apellido"
                  value={formData.apellido}
                  onChange={handleInputChange}
                  placeholder="Ingresa el apellido"
                  required
                />
              </div>

              <div className="form-group full-width">
                <label>Correo *</label>
                <input
                  type="email"
                  name="correo"
                  value={formData.correo}
                  onChange={handleInputChange}
                  placeholder="correo@ejemplo.com"
                  required
                />
              </div>

              <div className="form-group">
                <label>Contraseña {!modoEdicion && "*"}</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder={modoEdicion ? "Dejar vacío para mantener" : "Ingresa contraseña"}
                  required={!modoEdicion}
                />
              </div>

              <div className="form-group">
                <label>Repetir contraseña {!modoEdicion && "*"}</label>
                <input
                  type="password"
                  name="repetirPassword"
                  value={formData.repetirPassword}
                  onChange={handleInputChange}
                  placeholder={modoEdicion ? "Dejar vacío para mantener" : "Repite la contraseña"}
                  required={!modoEdicion}
                />
              </div>

              <div className="form-group full-width">
                <label>Asignar rol *</label>
                <select
                  name="rol"
                  value={formData.rol}
                  onChange={handleInputChange}
                  required
                >
                  <option value="Colaborador">Colaborador</option>
                  <option value="Administrador">Administrador</option>
                </select>
              </div>
            </div>

            <div className="modal-buttons">
              <button className="btn-cancelar" onClick={cerrarModal}>Cancelar</button>
              <button className="btn-guardar" onClick={guardarUsuario}>Guardar</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Éxito */}
      {modalExito && (
        <div className="modal-overlay">
          <div className="modal-exito">
            <button className="modal-close" onClick={() => setModalExito(false)} title="Cerrar">×</button>
            <div className="exito-icon">✓</div>
            <h2>{mensajeExito}</h2>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsuarios;
