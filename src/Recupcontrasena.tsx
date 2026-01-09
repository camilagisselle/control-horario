import { useState } from "react";
import "./RecupContrasena.css";

export default function RecupContrasena() {
  const [codigo, setCodigo] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  return (
    <div className="recuperar-container">
      <div className="recuperar-card">
        <h2>RECUPERAR CONTRASEÑA</h2>

        <form>
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

          <button>Continuar</button>
        </form>

        <button className="reenviar">Reenviar Código</button>
      </div>
    </div>
  );
}
