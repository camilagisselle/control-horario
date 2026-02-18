import { useState } from "react";
import "./RecupContrasena.css";
import api from "../../services/api";
import {useNavigate} from "react-router-dom";


function RecupContrasena() {
  const [codigo, setCodigo] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [mostrarModal, setMostrarModal] = useState(false);
    const navigate = useNavigate();

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!codigo || !password || !confirm) return;
  if (password !== confirm) {
    alert("Las contraseñas no coinciden");
    return;
  }

  try {
    await api.post("/password/change", {
      token: codigo,
      nuevaPassword: password,
    });

    setMostrarModal(true);

    setCodigo("");
    setPassword("");
    setConfirm("");
  } catch (error) {
    console.error(error);
    alert("Error al cambiar contraseña");
  }
};

const confirmar = () => {
    setMostrarModal(false);
    navigate('/');
};

  return (
    <div className="recuperar-container">
      <div className="recuperar-card">
        <h2>RECUPERAR CONTRASEÑA</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <label>INGRESE CÓDIGO:</label>
            <input value={codigo} onChange={(e) => setCodigo(e.target.value)} />
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

      {mostrarModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h2>¡Recuperacion de clave exitosa!</h2>
            <button onClick={confirmar}>OK</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default RecupContrasena;