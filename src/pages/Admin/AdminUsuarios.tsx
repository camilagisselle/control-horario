import React, { useState } from "react";
import "./AdminUsuarios.css";

interface Usuario {
  id: number;
  nombre: string;
  correo: string;
  rol: "Administrador" | "Colaborador";
  activo: boolean;
}

const AdminUsuarios: React.FC = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([
    {
      id: 1,
      nombre: "Juanito Perez",
      correo: "juanito@indracompany.cl",
      rol: "Administrador",
      activo: false,
    },
    {
      id: 2,
      nombre: "María López",
      correo: "maria@indracompany.cl",
      rol: "Colaborador",
      activo: true,
    },
  ]);

  const [busqueda, setBusqueda] = useState("");
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modoModal, setModoModal] = useState<"nuevo" | "editar">("nuevo");
  const [usuarioEditando, setUsuarioEditando] = useState<Usuario | null>(null);

  const [form, setForm] = useState({
    nombre: "",
    correo: "",
    password: "",
    password2: "",
    rol: "Colaborador" as "Administrador" | "Colaborador",
    activo: true,
  });

  const usuariosFiltrados = usuarios.filter(
    (u) =>
      u.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      u.correo.toLowerCase().includes(busqueda.toLowerCase()),
  );

  const toggleEstado = (id: number) => {
    setUsuarios((prev) =>
      prev.map((u) => (u.id === id ? { ...u, activo: !u.activo } : u)),
    );
  };

  const eliminarUsuario = (id: number) => {
    if (window.confirm("¿Eliminar usuario?")) {
      setUsuarios((prev) => prev.filter((u) => u.id !== id));
    }
  };

  const abrirNuevoUsuario = () => {
    setModoModal("nuevo");
    setUsuarioEditando(null);
    setForm({
      nombre: "",
      correo: "",
      password: "",
      password2: "",
      rol: "Colaborador",
      activo: true,
    });
    setModalAbierto(true);
  };

  const editarUsuario = (usuario: Usuario) => {
    setModoModal("editar");
    setUsuarioEditando(usuario);
    setForm({
      nombre: usuario.nombre,
      correo: usuario.correo,
      password: "",
      password2: "",
      rol: usuario.rol,
      activo: usuario.activo,
    });
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setUsuarioEditando(null);
  };

  const guardarUsuario = () => {
    if (!form.nombre || !form.correo) return;

    if (form.password !== form.password2) {
      alert("Las contraseñas no coinciden");
      return;
    }

    if (modoModal === "editar" && usuarioEditando) {
      setUsuarios((prev) =>
        prev.map((u) =>
          u.id === usuarioEditando.id
            ? {
                ...u,
                nombre: form.nombre,
                rol: form.rol,
                activo: form.activo,
              }
            : u,
        ),
      );
    } else {
      setUsuarios((prev) => [
        ...prev,
        {
          id: Date.now(),
          nombre: form.nombre,
          correo: form.correo,
          rol: form.rol,
          activo: form.activo,
        },
      ]);
    }

    cerrarModal();
  };

  return (
    <div className="admin-page">
      <img src="/krono2.1.png" alt="Krono" className="logo-top" />

      <h1 className="admin-title">ADMINISTRADOR DE USUARIOS</h1>

      <div className="admin-actions">
        <div className="search-box">
          <input
            placeholder="Buscar usuario"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
          <span className="search-icon">🔍</span>
        </div>

        <button className="btn-nuevo" onClick={abrirNuevoUsuario}>
          Nuevo
        </button>
      </div>

      <div className="tabla-container">
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Correo</th>
              <th>Rol</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuariosFiltrados.map((u) => (
              <tr key={u.id}>
                <td>{u.nombre}</td>
                <td>{u.correo}</td>
                <td>{u.rol}</td>
                <td>
                  {/* 👇 CONTENEDOR CLAVE */}
                  <div className="acciones">
                    <span
                      className={`estado ${u.activo ? "activo" : "inactivo"}`}
                      title="Cambiar estado"
                      onClick={() => toggleEstado(u.id)}
                    />
                    <span
                      className="icon editar"
                      title="Editar"
                      onClick={() => editarUsuario(u)}
                    >
                      ✏️
                    </span>
                    <span
                      className="icon eliminar"
                      title="Eliminar"
                      onClick={() => eliminarUsuario(u.id)}
                    >
                      🗑️
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalAbierto && (
        <div className="modal-overlay" onClick={cerrarModal}>
          <div
            className="modal-usuario admin-style"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="modal-title">
              {modoModal === "nuevo" ? "NUEVO USUARIO" : "EDITAR USUARIO"}
            </h2>

            <div className="modal-grid admin-grid">
              <div className="campo campo-full">
                <label>Nombre</label>
                <input
                  value={form.nombre}
                  onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                />
              </div>

              <div className="campo campo-full">
                <label>Correo</label>
                <input
                  value={form.correo}
                  disabled={modoModal === "editar"}
                  className={modoModal === "editar" ? "input-disabled" : ""}
                  onChange={(e) => setForm({ ...form, correo: e.target.value })}
                />
              </div>

              <div className="campo">
                <label>Contraseña</label>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                />
              </div>

              <div className="campo">
                <label>Repetir contraseña</label>
                <input
                  type="password"
                  value={form.password2}
                  onChange={(e) =>
                    setForm({ ...form, password2: e.target.value })
                  }
                />
              </div>

              <div className="campo">
                <label>Rol</label>
                <select
                  value={form.rol}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      rol: e.target.value as "Administrador" | "Colaborador",
                    })
                  }
                >
                  <option value="Colaborador">Colaborador</option>
                  <option value="Administrador">Administrador</option>
                </select>
              </div>

              <div className="campo">
                <label>Estado</label>
                <select
                  value={form.activo ? "activo" : "inactivo"}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      activo: e.target.value === "activo",
                    })
                  }
                >
                  <option value="activo">Activo</option>
                  <option value="inactivo">Inactivo</option>
                </select>
              </div>
            </div>

            <div className="modal-actions admin-actions">
              <button className="btn-secundario" onClick={cerrarModal}>
                Cancelar
              </button>
              <button className="btn-primario" onClick={guardarUsuario}>
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsuarios;
