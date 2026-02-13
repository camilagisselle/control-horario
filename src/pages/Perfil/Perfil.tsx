import { useState } from "react";
import "./Perfil.css";

export default function Perfil() {
  const [nombre, setNombre] = useState("Camila Pinilla Cabrera");
  const [correo] = useState("camila@correo.cl"); 
  const [password, setPassword] = useState("12345");
  const [avatar, setAvatar] = useState("/avatar.jpeg");
  const [showPassword, setShowPassword] = useState(false);
  const [mensajeExito, setMensajeExito] = useState(false);

  const cambiarAvatar = (e: any) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => setAvatar(reader.result as string);
    reader.readAsDataURL(file);
  };

  const guardarCambios = () => {
    // console.log("Guardando cambios:", { nombre, password });
    setMensajeExito(true);
    setTimeout(() => setMensajeExito(false), 3000);
  };

  return (
    <main className="perfil-contenido">
      <div className="perfil-top">
        <h1>Perfil</h1>
      </div>

      {/* TARJETA PERFIL */}
      <div className="perfil-card">
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
        </div>

        <div className="perfil-info">
  <div className="input-group">
    <label>Nombre</label>
    <input value={nombre} onChange={(e) => setNombre(e.target.value)} />
  </div>

  <div className="input-group">
    <label>Correo</label>
    <input value={correo} disabled />
  </div>

  <div className="input-group">
    <label>Contraseña</label>
    <input
      type={showPassword ? "text" : "password"}
      value={password}
      onChange={(e) => setPassword(e.target.value)}
    />
    <label className="checkbox-container">
      <input
        type="checkbox"
        checked={showPassword}
        onChange={(e) => setShowPassword(e.target.checked)}
      />
      <span className="checkbox-text">Ver contraseña</span>
    </label>
  </div>
   {/* ⬇️ BOTÓN GUARDAR */}
          <button className="btn-guardar" onClick={guardarCambios}>
            Guardar Cambios
          </button>
        </div>  
      </div>

      {/* ⬇️ MODAL DE ÉXITO */}
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