import { useState, useEffect } from "react";
import { detallePerfilUsuario } from "../../services/PerfilServices";
import "./AdminPerfil.css";
import { actualizarUsuario, cambiarPassword } from "../../services/UsuarioService";

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
  const [perfil, setPerfil] = useState<Usuario | null>(null);

  const [passwordActual, setPasswordActual] = useState("");
  const [passwordNueva, setPasswordNueva] = useState("");

  const [avatar, setAvatar] = useState("/avatar.jpeg");
  const [mensajeExito, setMensajeExito] = useState(false);
  const [verPassword, setVerPassword] = useState(false);

  // ✅ Traer datos del usuario logueado
  useEffect(() => {
    detallePerfilUsuario()
      .then((data) => {
        console.log("detalle usuario:", data);
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

  const guardarCambios = async () => {
    if (!perfil) return;

    try {
      // ✅ Actualizar nombre
      await actualizarUsuario(perfil.correo, {
        nombre: perfil.nombre,
      });

      // ✅ Cambiar password solo si se escribió una nueva
      if (passwordNueva) {
        if (!passwordActual) {
          alert("Debes ingresar la contraseña actual");
          return;
        }

        await cambiarPassword({
          passwordActual,
          passwordNueva,
        });

        setPasswordActual("");
        setPasswordNueva("");
      }

      setMensajeExito(true);
      setTimeout(() => setMensajeExito(false), 3000);

    } catch (error) {
      console.error("Error guardando cambios:", error);
    }
  };

  return (
    <main className="perfil-contenido">
      <div className="perfil-header-top">
        <h1>Perfil Administrador</h1>
      </div>

      <div className="perfil-card">
        {/* Avatar */}
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

        {/* Formulario */}
        <div className="perfil-info">
          <div className="input-group">
            <label>Nombre</label>
            <input
              value={perfil?.nombre || ""}
              onChange={(e) =>
                setPerfil((prev) =>
                  prev ? { ...prev, nombre: e.target.value } : prev
                )
              }
            />
          </div>

          <div className="input-group">
            <label>Correo</label>
            <input value={perfil?.correo || ""} disabled />
          </div>

          {/* 🔐 PASSWORD */}
          <div className="input-group">
            <label>Contraseña actual</label>
            <input
              type={verPassword ? "text" : "password"}
              value={passwordActual}
              onChange={(e) => setPasswordActual(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label>Nueva contraseña</label>
            <input
              type={verPassword ? "text" : "password"}
              value={passwordNueva}
              onChange={(e) => setPasswordNueva(e.target.value)}
            />
          </div>

          <label className="checkbox-container">
            <input
              type="checkbox"
              checked={verPassword}
              onChange={() => setVerPassword(!verPassword)}
            />
            <span className="checkbox-text">Ver contraseña</span>
          </label>

          <button className="btn-guardar" onClick={guardarCambios}>
            Guardar Cambios
          </button>
        </div>
      </div>

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