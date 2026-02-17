import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Avatarmenu.css";
import { useAuth } from "../auth/useAuth";


const Menuadmin = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const cerrarSesion = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="avatar-wrapper">
      <div className="avatar-header" onClick={() => setOpen(!open)}>
        <img src="/avatar.jpeg" alt="Avatar admin" />

        <div className="user-info">
          <span className="label">Administrador:</span>
          <strong>{user?.name || "Invitado"}</strong> {}
        </div>
      </div>

      {open && (
        <div className="avatar-menu">
          <button onClick={() => { navigate("/admin/perfil"); setOpen(false); }}>Perfil</button>
          <button onClick={() => { navigate("/admin/usuarios"); setOpen(false); }}>Usuarios</button>
          <button onClick={() => { navigate("/admin/historial"); setOpen(false); }}>Historial</button>
          <button className="cerrar" onClick={cerrarSesion}>Cerrar sesión</button>
        </div>
      )}
    </div>
  );
};

export default Menuadmin;