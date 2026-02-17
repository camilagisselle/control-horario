import { useState, useEffect } from "react";
import { actualizarUsuario, cambiarPassword } from "../../services/UsuarioService";
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
  const { user, updateUser } = useAuth();
  const [perfil, setPerfil] = useState<Usuario | null>(null);
  const [passwordNueva, setPasswordNueva] = useState("");
  const [avatar, setAvatar] = useState("/avatar.jpeg");
  const [mensajeExito, setMensajeExito] = useState(false);
  const [verPassword, setVerPassword] = useState(false);
  const [loading, setLoading] = useState(false);

    useEffect(() => {
    if (user) {
      setPerfil({
        id: 0,
        nombre: user.name,
        correo: user.correo,
        estado: 1,
        perfil: {
          id: 0,
          nombre: user.role,
        },
      });
    }
  }, [user]);

  function cambiarAvatar(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => setAvatar(reader.result as string);
    reader.readAsDataURL(file);
  }

  const guardarCambios = async () => {
    if (!perfil || !user?.correo) return;

    try {
      setLoading(true);
      // Actualizar nombre
      await actualizarUsuario(user.correo, {
        nombre: perfil.nombre,
      });

      updateUser({ name: perfil.nombre });

      // Cambiar password si hay nueva
      if (passwordNueva.trim()) {
        await cambiarPassword({ passwordNueva });
        setPasswordNueva("");
      }

      setMensajeExito(true);
      setTimeout(() => setMensajeExito(false), 3000);

    } catch (error) {
      console.error("Error guardando cambios:", error);
    }finally {
      setLoading(false); // <-- Ocultar cargando
    }
  };

  return (
    <main className="perfil-contenido">
      <div className="perfil-top">
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

          {/* 🔐 NUEVA CONTRASEÑA */}
    <div className="input-group">
  <label htmlFor="passwordInput">Contraseña</label>
  <input
    type={verPassword ? "text" : "password"}
    id="passwordInput"
    value={passwordNueva}
    placeholder="Ej: 12345"
    onChange={(e) => setPasswordNueva(e.target.value)}
  />

  <div className="checkbox-container">
    <input
      type="checkbox"
      id="verPassword"
      checked={verPassword}
      onChange={(e) => setVerPassword(e.target.checked)}
    />
    <label htmlFor="verPassword">
      Ver contraseña
    </label>
  </div>
</div>

          <button className="btn-guardar" onClick={guardarCambios}>
            Guardar Cambios
          </button>
        </div>
      </div>
      {loading && (
        <div className="cargando-overlay">
        <div className="cargando-texto">Guardando, por favor espere...</div>
        </div>
      )}
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