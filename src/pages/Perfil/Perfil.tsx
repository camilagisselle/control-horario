import { useState } from "react";
import "./Perfil.css";

export default function Perfil() {
  const [nombre, setNombre] = useState("Camila Pinilla Cabrera");
  const [correo] = useState("camila@email.com");
  const [password, setPassword] = useState("123456");
  const [avatar, setAvatar] = useState("/avatar.jpeg");

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
            <img src={avatar} />
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
          <div>
            <label>Nombre</label>
            <input value={nombre} onChange={(e) => setNombre(e.target.value)} />
          </div>

          <div>
            <label>Correo</label>
            <input value={correo} disabled />
          </div>

          <div>
            <label>Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>
      </div>

      <img src="/krono2.1.png" className="perfil-logo" />
    </main>
  );
}
