import { useState, useEffect } from "react";
import { detallePerfilUsuario, actualizarUsuario } from "../../services/PerfilServices";
import { useAuth } from "../../auth/useAuth";
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
  const { user } = useAuth(); // ✅ Obtener el usuario logueado
  const [usuarios, setPerfil] = useState<Usuario>();
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState("/avatar.jpeg");
  const [mensajeExito, setMensajeExito] = useState(false);
  const [verPassword, setVerPassword] = useState(false);
  
  useEffect(() => {
    if (!user?.correo) return;

    detallePerfilUsuario(user.correo) // ✅ Pasar el correo
      .then((data) => {
        console.log("detalle de usuario:", data);
        setPerfil(data);
      })
      .catch((error) => {
        console.error("Error detalle:", error);
      });
  }, [user]);

  function cambiarAvatar(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => setAvatar(reader.result as string);
    reader.readAsDataURL(file);
  }

  const guardarCambios = async () => {
    if (!usuarios) return;

    try {
      // Preparar datos para actualizar
      const datosActualizados: { nombre?: string; password?: string } = {
        nombre: usuarios.nombre,
      };

      // Solo agregar password si se escribió algo
      if (password.trim()) {
        datosActualizados.password = password;
      }

      // ✅ Llamar a actualizarUsuario (NO actualizarPerfil)
      await actualizarUsuario(usuarios.correo, datosActualizados);

      // Mostrar mensaje de éxito
      setMensajeExito(true);
      setTimeout(() => setMensajeExito(false), 3000);

      // Limpiar password después de guardar
      setPassword("");
      
      console.log("Perfil actualizado exitosamente");
    } catch (error) {
      console.error("Error al actualizar perfil:", error);
      alert("Error al guardar los cambios. Inténtalo nuevamente.");
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
        <div className="perfil-info">
          {/* NOMBRE */}
          <div className="input-group">
            <label>Nombre</label>
            <input 
              value={usuarios?.nombre || ''} 
              onChange={(e) => setPerfil(usuarios ? {...usuarios, nombre: e.target.value} : undefined)} 
            />
          </div>

          {/* CORREO */}
          <div className="input-group">
            <label>Correo</label>
            <input 
              value={usuarios?.correo || ''} 
              disabled 
            />
          </div>

          {/* CONTRASEÑA */}
          <div className="input-group">
            <label>Contraseña</label>
            <input
              type={verPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder=""
            />
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