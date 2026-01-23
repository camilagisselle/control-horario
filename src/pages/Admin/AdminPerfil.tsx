import { useState } from "react";
import "./AdminPerfil.css";

export default function AdminPerfil() {
  const [nombre, setNombre] = useState("Francisca Andrade");
  const [correo] = useState("admin@correo.cl");
  const [telefono, setTelefono] = useState("+56 9 1234 5678");
  const [cargo, setCargo] = useState("Administrador General");
  const [password, setPassword] = useState("12345");
  const [avatar, setAvatar] = useState("/avatar.jpeg");
  const [mensajeExito, setMensajeExito] = useState(false);

  const cambiarAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => setAvatar(reader.result as string);
    reader.readAsDataURL(file);
  };

  const guardarCambios = () => {
    setMensajeExito(true);
    setTimeout(() => setMensajeExito(false), 3000);
  };

  return (
    <main className="perfil-contenido">
      {/* HEADER CON TÍTULO */}
      <div className="perfil-header-top">
        <h1>Perfil Administrador</h1>
      </div>

      {/* TARJETA PERFIL */}
      <div className="perfil-card">
        {/* COLUMNA AVATAR */}
        <div className="perfil-avatar-grande">
          <label htmlFor="avatarInput">
            <img src={avatar} alt="Avatar" />
            <span>✏</span>
          </label>
          <input
            id="avatarInput"
            type="file"
            accept="image/*"
            hidden
            onChange={cambiarAvatar}
          />
          <div className="perfil-badge">Administrador</div>
        </div>

        {/* COLUMNA FORMULARIO */}
        <div className="perfil-info grid-form">
          <div className="form-group">
            <label>Nombre</label>
            <input value={nombre} onChange={(e) => setNombre(e.target.value)} />
          </div>

          <div className="form-group">
            <label>Correo</label>
            <input value={correo} disabled />
          </div>

          <div className="form-group">
            <label>Teléfono</label>
            <input
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Cargo</label>
            <input value={cargo} onChange={(e) => setCargo(e.target.value)} />
          </div>

          <div className="form-group">
            <label>Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button className="btn-guardar" onClick={guardarCambios}>
            Guardar Cambios
          </button>
        </div>
      </div>

      {/* LOGO */}
      <img src="/krono2.1.png" alt="Logo" className="perfil-logo" />

      {/* Modal de éxito */}
      {mensajeExito && (
        <div className="modal-exito-overlay">
          <div className="modal-exito">
            <div className="exito-icon">✓</div>
            <h2>Perfil actualizado exitosamente</h2>
          </div>
        </div>
      )}
    </main>
  );
}
