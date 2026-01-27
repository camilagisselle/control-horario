import { useState } from "react";
import "./Perfil.css";

export default function Perfil() {
  const [nombre, setNombre] = useState("Camila Pinilla Cabrera");
  const [correo] = useState("camila@correo.cl"); 
  const [password, setPassword] = useState("12345");
  const [avatar, setAvatar] = useState("/avatar.jpeg");
  const [showPassword, setShowPassword] = useState(false);

  const cambiarAvatar = (e: any) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => setAvatar(reader.result as string);
    reader.readAsDataURL(file);
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
</div>  
      </div>
      <img src="/krono2.1.png" className="perfil-logo" alt="Logo" />
    </main>
  );
}