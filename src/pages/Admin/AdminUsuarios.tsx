import { useEffect, useState } from "react";
import "./AdminUsuarios.css";
import {
  listarUsuarios,
  crearUsuario,
  actualizarUsuario,
  listarPerfiles,
} from "../../services/UsuarioService";
import type {
  PerfilAPI,
  UsuarioAPI,
  CrearUsuarioDTO,
} from "../../services/UsuarioService";

const AdminUsuarios = () => {
  const [usuarios, setUsuarios] = useState<UsuarioAPI[]>([]);
  const [busqueda, setBusqueda] = useState("");

  const [perfiles, setPerfiles] = useState<PerfilAPI[]>([]);

  const [mostrarModal, setMostrarModal] = useState(false);
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [repetirPassword, setRepetirPassword] = useState("");
  const [perfilId, setPerfilId] = useState<number | "">("");

  const [mostrarModalEditar, setMostrarModalEditar] = useState(false);
  const [editarCorreo, setEditarCorreo] = useState("");
  const [editarNombre, setEditarNombre] = useState("");
  const [editarPerfilId, setEditarPerfilId] = useState<number | "">("");
  const [editarEstado, setEditarEstado] = useState(1);

  const [cargando, setCargando] = useState(false);
  const [cargandoInicial, setCargandoInicial] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mensaje, setMensaje] = useState<string | null>(null);

  const [paginaActual, setPaginaActual] = useState(1);
  const usuariosPorPagina = 5;

  const indiceUltimo = paginaActual * usuariosPorPagina;
  const indicePrimero = indiceUltimo - usuariosPorPagina;

  useEffect(() => {
    const cargarDatos = async () => {
      setCargandoInicial(true);
      try {
        await cargarUsuarios();
        await cargarPerfiles();
      } finally {
        setCargandoInicial(false);
      }
    };
    cargarDatos();
  }, []);

  const cargarUsuarios = async () => {
    const data = await listarUsuarios();
    setUsuarios(data);
  };

  const cargarPerfiles = async () => {
    const data = await listarPerfiles();
    setPerfiles(data);
  };

  const abrirModalCrear = () => {
    setNombre("");
    setCorreo("");
    setPassword("");
    setRepetirPassword("");
    setPerfilId("");
    setError(null);
    setMensaje(null);
    setMostrarModal(true);
  };

  const abrirModalEditar = (usuario: UsuarioAPI) => {
    setEditarCorreo(usuario.correo);
    setEditarNombre(usuario.nombre);
    setEditarPerfilId(usuario.perfil.id);
    setEditarEstado(usuario.estado);
    setError(null);
    setMensaje(null);
    setMostrarModalEditar(true);
  };

  const handleCrear = async () => {
    setError(null);
    setMensaje(null);

    if (
      !nombre ||
      !correo ||
      !password ||
      password !== repetirPassword ||
      perfilId === ""
    ) {
      setError("Completa todos los campos correctamente");
      return;
    }

    try {
      setCargando(true);

      const data: CrearUsuarioDTO = {
        nombre,
        correo,
        password: password.trim(),
        perfilId,
        estado: 1,
      };

      await crearUsuario(data);
      await cargarUsuarios();

      setMensaje("Usuario creado correctamente");

      setTimeout(() => {
        setMostrarModal(false);
        setMensaje(null);
      }, 1200);
    } catch {
      setError("Error al crear el usuario");
    } finally {
      setCargando(false);
    }
  };

  const handleEditar = async () => {
    setError(null);
    setMensaje(null);

    if (!editarCorreo || !editarNombre || editarPerfilId === "") {
      setError("Completa todos los campos");
      return;
    }

    try {
      setCargando(true);

      await actualizarUsuario(editarCorreo, {
        nombre: editarNombre,
        estado: editarEstado,
        perfilId: Number(editarPerfilId),
      });

      await cargarUsuarios();

      setMensaje("Usuario actualizado correctamente");

      setTimeout(() => {
        setMostrarModalEditar(false);
        setMensaje(null);
      }, 1200);
    } catch {
      setError("Error al actualizar el usuario");
    } finally {
      setCargando(false);
    }
  };

  const toggleEstado = async (usuario: UsuarioAPI) => {
    await actualizarUsuario(usuario.correo, {
      estado: usuario.estado === 1 ? 0 : 1,
    });
    await cargarUsuarios();
  };

  const usuariosFiltrados = usuarios.filter(
    (u) =>
      u.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      u.correo.toLowerCase().includes(busqueda.toLowerCase()) ||
      u.perfil.perfil_nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  const usuariosPaginados = usuariosFiltrados.slice(
    indicePrimero,
    indiceUltimo
  );

  const totalPaginas = Math.ceil(
    usuariosFiltrados.length / usuariosPorPagina
  );

  return (
    <div className="admin-page">
      <h2 className="admin-title">Usuarios</h2>

      {cargandoInicial && (
        <div className="cargando-overlay">
          <div className="cargando-contenido">
            <div className="cargando-texto">Cargando usuarios...</div>
          </div>
        </div>
      )}

      {!cargandoInicial && (
        <>
          <div className="admin-actions">
            <div className="search-box">
              <input
                type="text"
                placeholder="Buscar usuario"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
              <span className="search-icon">🔍</span>
            </div>

            <button className="btn-nuevo" onClick={abrirModalCrear}>
              Nuevo
            </button>
          </div>

          <div className="tabla-container">
            {usuariosPaginados.length === 0 ? (
              <div className="tabla-vacia">Sin resultados</div>
            ) : (
              <>
                <table className="tablaAdminUsuarios">
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>Correo</th>
                      <th>Perfil</th>
                      <th>Estado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>

                  <tbody>
                    {usuariosPaginados.map((u) => (
                      <tr key={u.correo}>
                        <td>{u.nombre}</td>
                        <td>{u.correo}</td>
                        <td>{u.perfil.perfil_nombre}</td>
                        <td
                          className={`btn-estado ${
                            u.estado === 1 ? "activo" : "inactivo"
                          }`}
                          onClick={() => toggleEstado(u)}
                        >
                          ●
                        </td>
                        <td className="accionesAdminUsuarios">
                          <button
                            className="btn-accion editar"
                            onClick={() => abrirModalEditar(u)}
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

      {/* MODAL CREAR */}
      {mostrarModal && (
        <div className="modal-overlay">
          <div className="modal-usuario admin-style">
            <h3 className="modal-title">Agregar usuario</h3>

            <div className="modal-form">
              <div className="form-group">
                <label htmlFor="nombre">Nombre</label>
                <input
                  id="nombre"
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="correo">Correo</label>
                <input
                  id="correo"
                  type="email"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Contraseña</label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="repetirPassword">Repetir contraseña</label>
                <input
                  id="repetirPassword"
                  type="password"
                  value={repetirPassword}
                  onChange={(e) => setRepetirPassword(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="perfil">Perfil</label>
                <select
                  id="perfil"
                  value={perfilId}
                  onChange={(e) =>
                    setPerfilId(
                      e.target.value === "" ? "" : Number(e.target.value)
                    )
                  }
                >
                  <option value="">Seleccionar perfil</option>
                  {perfiles.map((p) => (
                    <option key={p.perfil_id} value={p.perfil_id}>
                      {p.perfil_nombre}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* ✅ ALERTA ESTILÍSTICA */}
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
                onClick={() => setMostrarModal(false)}
                disabled={cargando}
              >
                Cancelar
              </button>
              <button
                className="btn-primario"
                onClick={handleCrear}
                disabled={cargando}
              >
                {cargando ? "Guardando..." : "Crear"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL EDITAR */}
      {mostrarModalEditar && (
        <div className="modal-overlay">
          <div className="modal-usuario admin-style">
            <h3 className="modal-title">Editar usuario</h3>

            <div className="modal-form">
              <div className="form-group">
                <label htmlFor="editarNombre">Nombre</label>
                <input
                  id="editarNombre"
                  type="text"
                  value={editarNombre}
                  onChange={(e) => setEditarNombre(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="editarPerfil">Perfil</label>
                <select
                  id="editarPerfil"
                  value={editarPerfilId}
                  onChange={(e) =>
                    setEditarPerfilId(
                      e.target.value === "" ? "" : Number(e.target.value)
                    )
                  }
                >
                  {perfiles.map((p) => (
                    <option key={p.perfil_id} value={p.perfil_id}>
                      {p.perfil_nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="editarEstado">Estado</label>
                <select
                  id="editarEstado"
                  value={editarEstado}
                  onChange={(e) => setEditarEstado(Number(e.target.value))}
                >
                  <option value={1}>Activo</option>
                  <option value={0}>Inactivo</option>
                </select>
              </div>
            </div>

            {/* ✅ ALERTA ESTILÍSTICA */}
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
                onClick={() => setMostrarModalEditar(false)}
                disabled={cargando} // ✅ BLOQUEADO CUANDO GUARDA
              >
                Cancelar
              </button>
              <button
                className="btn-primario"
                onClick={handleEditar}
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

export default AdminUsuarios;