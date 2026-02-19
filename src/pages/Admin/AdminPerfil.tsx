import { useState, useEffect } from "react";
import { actualizarUsuario, cambiarPassword } from "../../services/UsuarioService";
import { useAuth } from "../../auth/useAuth";
import Modal from "../../Modals/modal";
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
  const [verPassword, setVerPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [modal, setModal] = useState({
    open: false,
    type: "success" as "success" | "error" | "info" | "confirm",
    title: "",
    message: "",
  });

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

      setModal({
        open: true,
        type: "success",
        title: "Perfil actualizado",
        message: "Los cambios se guardaron correctamente",
      });

    } catch (error) {
      console.error("Error guardando cambios:", error);
      setModal({
        open: true,
        type: "error",
        title: "Error",
        message: "No se pudieron guardar los cambios",
      });
    } finally {
      setLoading(false);
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
          <img src="/avatar.jpeg" alt="Avatar" />
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

          {/* NUEVA CONTRASEÑA */}
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
              <label htmlFor="verPassword">Ver contraseña</label>
            </div>
          </div>

          <button
            className="btn-guardar"
            onClick={guardarCambios}
            disabled={loading}
          >
            Guardar Cambios
          </button>
        </div>
      </div>

      {/* Loading overlay */}
      {loading && (
        <div className="cargando-overlay">
          <div className="cargando-texto">
            Guardando, por favor espere...
          </div>
        </div>
      )}

      {/* Modal reutilizable */}
      <Modal
        open={modal.open}
        type={modal.type}
        title={modal.title}
        message={modal.message}
        onClose={() =>
          setModal((prev) => ({ ...prev, open: false }))
        }
      />
    </main>
  );
}