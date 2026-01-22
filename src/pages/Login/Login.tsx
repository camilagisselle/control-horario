import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

const Login: React.FC = () => {
  const [avatar, setAvatar] = useState<string>(() => {
    try {
      return (localStorage.getItem("avatar") as string) || "/avatar.jpeg";
    } catch {
      return "/avatar.jpeg";
    }
  });
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // Credenciales fijas para demo local
  const ADMIN = {
    email: "admin@correo.cl",
    password: "12345",
    role: "admin",
    name: "Francisca Andrade",
  };
  const USER = {
    email: "usuario@correo.cl",
    password: "12345",
    role: "user",
    name: "Camila Pinilla",
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        setAvatar(dataUrl);
        // Guardamos avatar en localStorage para que otras páginas lo usen
        try {
          localStorage.setItem("avatar", dataUrl);
        } catch {
          // si falla, seguimos sin bloquear
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleIngresar = () => {
    console.log("Intento de login con:", { email, password });
    
    // Limpiar espacios en blanco
    const emailTrimmed = email.trim();
    const passwordTrimmed = password.trim();
    
    console.log("Credenciales limpias:", { emailTrimmed, passwordTrimmed });
    
    // validación simple con credenciales fijas
    if (emailTrimmed.toLowerCase() === ADMIN.email.toLowerCase() && passwordTrimmed === ADMIN.password) {
      console.log("Login exitoso como ADMIN");
      const user = { email: ADMIN.email, role: ADMIN.role, name: ADMIN.name };
      localStorage.setItem("user", JSON.stringify(user));
      navigate("/admin/usuarios");
      return;
    }

    if (emailTrimmed.toLowerCase() === USER.email.toLowerCase() && passwordTrimmed === USER.password) {
      console.log("Login exitoso como USER");
      const user = { email: USER.email, role: USER.role, name: USER.name };
      localStorage.setItem("user", JSON.stringify(user));
      navigate("/registro");
      return;
    }

    console.log("Credenciales incorrectas");
    alert(
      "Usuario o contraseña incorrectos. Usa admin@correo.cl / 12345 o usuario@correo.cl / 12345",
    );
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleIngresar();
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

          <input
            type="text"
            placeholder="Usuario (email)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={handleKeyPress}
          />

          <button onClick={handleIngresar}>Ingresar</button>

          <Link to="/recuperarpassword" className="recuperar-link">
            Recuperar contraseña
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
