import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/auth.hook";
import "./Login.css";

const Login: React.FC = () => {
  const [avatar, setAvatar] = useState<string>(() => {
    try {
      return localStorage.getItem("avatar") || "/avatar.jpeg";
    } catch {
      return "/avatar.jpeg";
    }
  });

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  // Avatar (NO TOCAR)
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        const dataUrl = reader.result as string;

        setAvatar(dataUrl);

        try {
          localStorage.setItem("avatar", dataUrl);
        } catch (err) {
          console.error("Error guardando avatar:", err);
        }
      };

      reader.readAsDataURL(file);
    }
  };

  const handleIngresar = async () => {
    if (!email || !password) {
      alert("Ingresa correo y contraseña");
      return;
    }

    try {
      setLoading(true);

      // Llama al backend via AuthContext
      await login(email.trim(), password.trim());

      // Esperamos a que user se actualice
      setTimeout(() => {
        const stored = localStorage.getItem("user");

        if (!stored) return;

        const data = JSON.parse(stored);

        // Redirección por rol
        if (data.role === "admin") {
          navigate("/admin/usuarios");
        } else {
          navigate("/registro");
        }
      }, 100);
    } catch (error) {
      console.error(error);
      alert("Credenciales incorrectas");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleIngresar();
    }
  };

  return (
    <div className="login-container">
      {/* IZQUIERDA */}
      <div className="login-left">
        <img src="/krono.png" alt="Logo Krono" className="login-logo" />
      </div>

      {/* DERECHA */}
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
            type={showPassword ? "text" : "password"}
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={handleKeyPress}
          />

          {/* Mostrar contraseña */}
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              fontSize: "0.75rem",
              cursor: "pointer",
              userSelect: "none",
              marginTop: "-12px",
              marginBottom: "10px",
              marginLeft: "2px",
              width: "fit-content",
            }}
          >
            <input
              type="checkbox"
              checked={showPassword}
              onChange={(e) => setShowPassword(e.target.checked)}
              style={{
                cursor: "pointer",
                width: "12px",
                height: "12px",
                margin: "0",
                flexShrink: 0,
                position: "relative",
                top: "1px",
              }}
            />
            Ver contraseña
          </label>

          <button onClick={handleIngresar} disabled={loading}>
            {loading ? "Ingresando..." : "Ingresar"}
          </button>

          <Link to="/recuperarpassword" className="recuperar-link">
            Recuperar contraseña
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;