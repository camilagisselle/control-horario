import { useState } from "react";
import "./AdminPerfil.css";
import { actualizarUsuario, cambiarPassword } from "../../services/UsuarioService";

export default function AdminPerfil() {
  const [nombre, setNombre] = useState("Francisca Andrade");
  const [correo] = useState("admin@correo.cl");
  const [telefono, setTelefono] = useState("+56 9 1234 5678");
  const [cargo, setCargo] = useState("Administrador de Sistema");
const [passwordActual, setPasswordActual] = useState("");
const [passwordNueva, setPasswordNueva] = useState("");
  const [avatar, setAvatar] = useState("/avatar.jpeg");
  const [mensajeExito, setMensajeExito] = useState(false);
  const [verPassword, setVerPassword] = useState(false); // Estado para el checkbox

  function cambiarAvatar(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => setAvatar(reader.result as string);
    reader.readAsDataURL(file);
  }

const guardarCambios = async () => {
  try {

    await actualizarUsuario(correo, {
      nombre,
    });

    if (passwordNueva) {
      await cambiarPassword({
        passwordActual,
        passwordNueva,
      });
    }

    setMensajeExito(true);
    setTimeout(() => setMensajeExito(false), 3000);

  } catch (error) {
    console.error(error);
  }
};


  return (
    <main className="perfil-contenido">
      {/* HEADER CON TÍTULO */}
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

        {/* COLUMNA FORMULARIO */}
        <div className="perfil-info grid-form">
          <div className="form-group">
            <label>Nombre</label>
            <input value={nombre} onChange={(e) => setNombre(e.target.value)} />
          </div>

          <div className="form-group">
            <label>Correo</label>
            <input value={correo} disabled />
          </div>

          <div className="form-group">
            <label>Teléfono</label>
            <input
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Cargo</label>
            <input value={cargo} onChange={(e) => setCargo(e.target.value)} />
          </div>

          <div className="form-group password-group">
  <div className="form-group">
  <label>Contraseña actual</label>
  <input
    type={verPassword ? "text" : "password"}
    value={passwordActual}
    onChange={(e) => setPasswordActual(e.target.value)}
  />
</div>

<div className="form-group">
  <label>Nueva contraseña</label>
  <input
    type={verPassword ? "text" : "password"}
    value={passwordNueva}
    onChange={(e) => setPasswordNueva(e.target.value)}
  />
</div>

<div className="ver-password-container">
  <input 
    type="checkbox" 
    id="checkVer" 
    checked={verPassword} 
    onChange={() => setVerPassword(!verPassword)} 
  />
  <label htmlFor="checkVer">Ver contraseña</label>
</div>

            <div className="ver-password-container">
              <input 
                type="checkbox" 
                id="checkVer" 
                checked={verPassword} 
                onChange={() => setVerPassword(!verPassword)} 
              />
              <label htmlFor="checkVer">Ver contraseña</label>
            </div>
          </div>
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
