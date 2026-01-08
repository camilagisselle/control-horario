import React, { useState } from "react";
import "./Login.css";

const Login: React.FC = () => {
  const [avatar, setAvatar] = useState("/avatar.jpeg"); // archivo en /public

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setAvatar(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="login-container">
      {/* COLUMNA IZQUIERDA */}
      <div className="login-left">
        <img src="/krono.png" alt="Logo Krono" className="login-logo" />
      </div>

      {/* COLUMNA DERECHA */}
      <div className="login-right">
        <div className="login-card">
          {/* AVATAR */}
          <div className="avatar-container">
            <label htmlFor="avatar-upload">
              <img src={avatar} alt="avatar" className="login-avatar" />
            </label>

            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              hidden
              onChange={handleAvatarChange}
            />
          </div>

          <h2>Inicio de sesión</h2>

          <input type="text" placeholder="Usuario" />
          <input type="password" placeholder="Contraseña" />

          <button>Ingresar</button>
          <a href="#">Recuperar contraseña</a>
        </div>
      </div>
    </div>
  );
};

export default Login;
