import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // 👈 agregamos useNavigate
import "./Login.css";

const Login: React.FC = () => {
  const [avatar, setAvatar] = useState("/avatar.jpeg");
  const navigate = useNavigate(); // 👈 hook de navegación

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setAvatar(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleIngresar = () => {
    // Aquí después puedes validar usuario y contraseña
    // Por ahora simplemente enviamos a Registro
    navigate("/registro");
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

          {/* 👇 BOTÓN CONECTADO A REGISTRO */}
          <button onClick={handleIngresar}>Ingresar</button>

          <Link to="/recuperar" className="recuperar-link">
            Recuperar contraseña
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
