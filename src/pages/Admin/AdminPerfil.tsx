import { useState, useEffect } from "react";
import { detallePerfilUsuario } from "../../services/PerfilServices";
import "./AdminPerfil.css";

interface Usuario {
  id: number;
  nombre: string;
  correo: string;
  estado: number;
  perfil: {
    id: number;
    nombre: string;
  };
}

export default function AdminPerfil() {
  const [usuarios, setPerfil] = useState<Usuario>();
  const [password, setPassword] = useState("Ej: 12345");
  const [avatar, setAvatar] = useState("/avatar.jpeg");
  const [mensajeExito, setMensajeExito] = useState(false);
  const [verPassword, setVerPassword] = useState(false);
  
  // ✅ ESTO SE MANTIENE (useEffect con tu servicio)
  useEffect(() => {
    detallePerfilUsuario()
      .then((data) => {
        console.log("detalle de noemi:", data);
        console.log("detalle de data noemi:", data);
        setPerfil(data);
      })
      .catch((error) => {
        console.error("Error detalle:", error);
      });
  }, []);

  function cambiarAvatar(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => setAvatar(reader.result as string);
    reader.readAsDataURL(file);
  }

  const guardarCambios = () => {
    setMensajeExito(true);
    setTimeout(() => setMensajeExito(false), 3000);
  };

  return (
    <main className="perfil-contenido">
      {/* HEADER CON TÍTULO - ✅ CAMBIO: perfil-top → perfil-header-top */}
      <div className="perfil-header-top">
        <h1>Perfil Administrador</h1>
      </div>

      {/* TARJETA PERFIL */}
      <div className="perfil-card">
        {/* COLUMNA AVATAR */}
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

        {/* COLUMNA FORMULARIO - ✅ CAMBIO: quitamos grid-form */}
        <div className="perfil-info">
          {/* NOMBRE - ✅ CAMBIO: form-group → input-group */}
          <div className="input-group">
            <label>Nombre</label>
            <input 
              value={usuarios?.nombre || ''} 
              onChange={(e) => setPerfil(usuarios)} 
            />
          </div>

          {/* CORREO - ✅ CAMBIO: form-group → input-group */}
          <div className="input-group">
            <label>Correo</label>
            <input 
              value={usuarios?.correo || ''} 
              disabled 
            />
          </div>

          {/* CONTRASEÑA - ✅ CAMBIO: form-group → input-group */}
          <div className="input-group">
            <label>Contraseña</label>
            <input
              type={verPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {/* ✅ CAMBIO: ver-password-container → checkbox-container */}
            <label className="checkbox-container">
              <input 
                type="checkbox" 
                checked={verPassword} 
                onChange={() => setVerPassword(!verPassword)} 
              />
              <span className="checkbox-text">Ver contraseña</span>
            </label>
          </div>

          {/* BOTÓN GUARDAR */}
          <button className="btn-guardar" onClick={guardarCambios}>
            Guardar Cambios
          </button>
        </div>
      </div>

      {/* Modal de éxito */}
      {mensajeExito && (
        <div className="modal-exito-overlay">
          <div className="modal-exito">
            <div className="exito-icon">✓</div>
            <h2>Perfil actualizado exitosamente</h2>
          </div>
        </div>
      )}
    </main>
  );
}