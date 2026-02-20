import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/useAuth";
import "./Login.css";
import Modal from "../../Modals/modal";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [modal, setModal] = useState({
    open: false,
    type: "error" as "success" | "error" | "info" | "confirm",
    title: "",
    message: "",
  });

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleIngresar = async () => {
    if (!email.trim() || !password.trim()) {
      setModal({
        open: true,
        type: "error",
        title: "Campos requeridos",
        message: "Ingresa correo y contraseña",
      });
      return;
    }

    try {
      setLoading(true);

      const user = await login(email.trim(), password.trim());

      if (user.role === "ROLE_ADMIN") {
        navigate("/admin/usuarios");
      } else {
        navigate("/registro");
      }

    } catch (error) {
      console.error(error);
      setPassword("");
      setModal({
        open: true,
        type: "error",
        title: "Credenciales incorrectas",
        message: "Verifica tu correo y contraseña",
      });
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
           <img src="/avatar.jpeg" alt="avatar" className="login-avatar" />
        </div>

          <h2>Inicio de sesión</h2>

          <input
            type="text"
            placeholder="Usuario (email)"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            onKeyPress={handleKeyPress}
          />

          <input
            type={showPassword ? "text" : "password"}
            placeholder="Contraseña"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
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
      <Modal
        open={modal.open}
        type={modal.type}
        title={modal.title}
        message={modal.message}
        onClose={() => setModal(prev => ({ ...prev, open: false }))}
      />
    </div>
  );
};

export default Login;