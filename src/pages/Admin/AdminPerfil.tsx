import { useState } from "react";
import "./AdminPerfil.css";

const AdminPerfil = () => {
  const stored = typeof window !== "undefined" ? localStorage.getItem("user") : null;
  const adminData = stored
    ? (() => {
        try {
          const u = JSON.parse(stored) as { name?: string; email?: string };
          return { name: u?.name ?? "Francisca Andrade", email: u?.email ?? "admin@correo.cl" };
        } catch {
          return { name: "Francisca Andrade", email: "admin@correo.cl" };
        }
      })()
    : { name: "Francisca Andrade", email: "admin@correo.cl" };

  const adminAvatarSrc =
    typeof window !== "undefined" ? localStorage.getItem("avatar") || "/avatar.jpeg" : "/avatar.jpeg";

  const [nombre, setNombre] = useState(adminData.name);
  const [apellido, setApellido] = useState("Andrade");
  const [correo] = useState(adminData.email);
  const [telefono, setTelefono] = useState("+56 9 1234 5678");
  const [cargo, setCargo] = useState("Administrador General");
  const [password, setPassword] = useState("12345");
  const [avatar, setAvatar] = useState<string>(adminAvatarSrc);
  const [mensajeExito, setMensajeExito] = useState(false);

  const cambiarAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setAvatar(result);
      try {
        localStorage.setItem("avatar", result);
      } catch {
        // ignore storage errors
      }
    };
    reader.readAsDataURL(file);
  };

  const guardarCambios = () => {
    // Aquí guardarías los cambios en el servidor o localStorage
    setMensajeExito(true);
    setTimeout(() => setMensajeExito(false), 3000);
  };

  return (
    <div className="perfil-page">
      <div className="perfil-container">
        <h1 className="page-title">MI PERFIL</h1>

        <div className="perfil-card">
          <div className="perfil-header">
            <div className="avatar-section">
              <div className="perfil-info-header">
                <h2>{nombre} {apellido}</h2>
                <p className="cargo">{cargo}</p>
                <span className="badge-admin">Administrador</span>
              </div>
              
              <label htmlFor="avatarInput" className="avatar-wrapper" title="Cambiar foto de perfil">
                <img src={avatar} alt="Avatar" className="perfil-avatar" />
                <div className="avatar-overlay">
                  <span className="edit-icon">📷</span>
                </div>
              </label>
              <input id="avatarInput" type="file" accept="image/*" hidden onChange={cambiarAvatar} />
            </div>
          </div>

          <div className="perfil-form">
            <div className="form-row">
              <div className="form-group">
                <label>Nombre</label>
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Ingresa tu nombre"
                />
              </div>

              <div className="form-group">
                <label>Apellido</label>
                <input
                  type="text"
                  value={apellido}
                  onChange={(e) => setApellido(e.target.value)}
                  placeholder="Ingresa tu apellido"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Correo electrónico</label>
                <input
                  type="email"
                  value={correo}
                  disabled
                  title="El correo no puede ser modificado"
                />
              </div>

              <div className="form-group">
                <label>Teléfono</label>
                <input
                  type="tel"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  placeholder="+56 9 XXXX XXXX"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Cargo</label>
                <input
                  type="text"
                  value={cargo}
                  onChange={(e) => setCargo(e.target.value)}
                  placeholder="Tu cargo en la empresa"
                />
              </div>

              <div className="form-group">
                <label>Contraseña</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="form-actions">
              <button className="btn-guardar" onClick={guardarCambios} title="Guardar cambios">
                Guardar Cambios
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Éxito */}
      {mensajeExito && (
        <div className="modal-overlay">
          <div className="modal-exito">
            <div className="exito-icon">✓</div>
            <h2>PERFIL ACTUALIZADO EXITOSAMENTE</h2>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPerfil;