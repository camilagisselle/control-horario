import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Avatarmenu.css"; // usa el MISMO css

const Menuadmin = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const cerrarSesion = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="avatar-wrapper">
      <div className="avatar-header" onClick={() => setOpen(!open)}>
        <img src="/avatar.jpeg" alt="Avatar admin" />

        {/* TEXTO AL COSTADO DEL AVATAR */}
        <div className="user-info">
          <span className="label">Administrador:</span>
          <strong>Francisca Andrade</strong>
        </div>
      </div>

      {open && (
        <div className="avatar-menu">
          <button onClick={() => navigate("/admin/perfil")}>Perfil</button>
          <button onClick={() => navigate("/admin/usuarios")}>Usuarios</button>
          <button onClick={() => navigate("/admin/historial")}>
            Historial
          </button>
          <button className="cerrar" onClick={cerrarSesion}>
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
};

export default Menuadmin;
