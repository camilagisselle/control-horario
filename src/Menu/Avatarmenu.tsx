import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import "./AvatarMenu.css";

const AvatarMenu = () => {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const cerrarSesion = () => {
    logout();
  };

  return (
    <div className="avatar-wrapper">
      <div className="avatar-header" onClick={() => setOpen(!open)}>
        <img src="/avatar.jpeg" alt="Avatar" />
        <div className="user-info">
          <span className="label">Usuario:</span>
            <strong>{user?.name || "Invitado"}</strong> {}
        </div>
      </div>

      {open && (
        <div className="avatar-menu">
          <button onClick={() => { navigate("/perfil"); setOpen(false);}}>Perfil</button>
          <button onClick={() => { navigate("/registro"); setOpen(false); }}>Registro</button>
          <button onClick={() => { navigate("/historial"); setOpen(false); }}>Historial</button>
          <button className="logout" onClick={cerrarSesion}>Cerrar sesión</button>
        </div>
      )}
    </div>
  );
};

export default AvatarMenu;
