import { useState } from "react";
import "./RecupContrasena.css";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";

function RecupContrasena() {
  const [codigo, setCodigo] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [modal, setModal] = useState({
    open: false,
    type: "success",
    message: "",
  });

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!codigo || !password || !confirm) {
      setModal({
        open: true,
        type: "warning",
        message: "Debe completar todos los campos.",
      });
      return;
    }

    if (password !== confirm) {
      setModal({
        open: true,
        type: "warning",
        message: "Las contraseñas no coinciden.",
      });
      return;
    }

    try {
      await api.post("/password/change", {
        token: codigo,
        nuevaPassword: password,
      });

      setModal({
        open: true,
        type: "success",
        message: "¡Recuperación de clave exitosa!",
      });

      setCodigo("");
      setPassword("");
      setConfirm("");

    } catch (error) {
      console.error(error);

      setModal({
        open: true,
        type: "error",
        message: "Error al cambiar contraseña.",
      });
    }
  };

  const cerrarModal = () => {
    setModal({ ...modal, open: false });

    if (modal.type === "success") {
      navigate("/");
    }
  };

  return (
    <div className="recuperar-container">
      <div className="recuperar-card">
        <h2>RECUPERAR CONTRASEÑA</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <label>INGRESE CÓDIGO:</label>
            <input
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
            />
          </div>

          <div className="form-row">
            <label>NUEVA CONTRASEÑA:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="form-row">
            <label>REPITA CONTRASEÑA:</label>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />
          </div>

          <button type="submit">Continuar</button>
        </form>

        <button className="reenviar">Reenviar Código</button>
      </div>

      {/* MODAL */}
      {modal.open && (
        <div className="modal-overlay">
          <div className={`modal-box modal-${modal.type}`}>
            <h2>
              {modal.type === "success" && "✅ Éxito"}
              {modal.type === "error" && "❌ Error"}
              {modal.type === "warning" && "⚠️ Atención"}
            </h2>

            <p>{modal.message}</p>

            <button onClick={cerrarModal}>OK</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default RecupContrasena;