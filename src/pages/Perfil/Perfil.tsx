import { useEffect, useState } from "react";
import { useAuth } from "../../auth/useAuth";
import { actualizarUsuario, cambiarPassword } from "../../services/UsuarioService";
import "./Perfil.css";

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

export default function Perfil() {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const { user, updateUser } = useAuth();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [mensajeExito, setMensajeExito] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setUsuario({
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

  const guardarCambios = async () => {
    if (!usuario) return;

    try {
      setLoading(true);

      // Actualizar nombre
      await actualizarUsuario(usuario.correo, {
        nombre: usuario.nombre,
      });

      updateUser({ name: usuario.nombre });
      
      // Cambiar password solo si se escribió
      if (password.trim()) {
        await cambiarPassword({ passwordNueva: password });
        setPassword("");
        setShowPassword(false);
      }

      setMensajeExito(true);
      setTimeout(() => setMensajeExito(false), 3000);

      console.log("Perfil actualizado exitosamente");
    } catch (error) {
      console.error("Error al actualizar:", error);
      alert("Error al guardar los cambios.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="perfil-contenido">
      <div className="perfil-top">
        <h1>Perfil</h1>
      </div>

      {/* TARJETA PERFIL */}
      <div className="perfil-card">
        <div className="perfil-avatar-grande">
          <img src="/avatar.jpeg" alt="Avatar" />
        </div>

        <div className="perfil-info">
          <div className="input-group">
            <label>Nombre</label>
            <input
              value={usuario?.nombre ?? ""}
              onChange={(e) =>
                setUsuario((prev) =>
                  prev ? { ...prev, nombre: e.target.value } : prev
                )
              }
            />
          </div>

          <div className="input-group">
            <label>Correo</label>
            <input value={usuario?.correo ?? ""} disabled />
          </div>

          <div className="input-group">
            <label>Contraseña</label>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              placeholder={"Ej: 12345"}
              onChange={(e) => setPassword(e.target.value)}
            />
            <label className="checkbox-container">
              <input
                type="checkbox"
                checked={showPassword}
                onChange={(e) => setShowPassword(e.target.checked)}
              />
              <span className="checkbox-text">Ver contraseña</span>
            </label>
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