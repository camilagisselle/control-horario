import { useEffect, useState } from "react";
import { useAuth } from "../../auth/useAuth";
import { actualizarUsuario, cambiarPassword } from "../../services/UsuarioService";
import Modal from "../../Modals/modal";

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
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState({
    open: false,
    type: "success" as "success" | "error" | "info" | "confirm",
    title: "",
    message: "",
  });

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
    } catch (error) {
      console.error(error);
      setModal({
        open: true,
        type: "error",
        title: "Error",
        message: "Error al actualizar",
      });
    } finally {
      setLoading(false);
      setModal({
        open: true,
        type: "success",
        title: "Perfil actualizado",
        message: "Los cambios se guardaron correctamente",
      });
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

      <Modal
        open={modal.open}
        type={modal.type}
        title={modal.title}
        message={modal.message}
        onClose={() => setModal(prev => ({ ...prev, open: false }))}
      />
    </main>
  );
}