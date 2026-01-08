import { useState } from "react";
import kronoLogo from "./krono.png"; // o "../assets/krono.png" si lo tienes en otra carpeta

export default function RecuperarContrasena() {
  const [codigo, setCodigo] = useState("");
  const [nueva, setNueva] = useState("");
  const [repetir, setRepetir] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (nueva !== repetir) {
      alert("⚠️ Las contraseñas no coinciden");
      return;
    }
    alert("✅ Contraseña actualizada correctamente");
  };

  const reenviarCodigo = () => {
    alert("📩 Se ha reenviado el código a tu correo");
  };

  return (
    <div className="recuperar-container">
      <div className="recuperar-card">
        <img src={kronoLogo} alt="Krono" className="recuperar-logo" />
        <h2>RECUPERAR CONTRASEÑA</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Ingrese código"
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
          />
          <input
            type="password"
            placeholder="Nueva contraseña"
            value={nueva}
            onChange={(e) => setNueva(e.target.value)}
          />
          <input
            type="password"
            placeholder="Repita contraseña"
            value={repetir}
            onChange={(e) => setRepetir(e.target.value)}
          />
          <button type="submit">Continuar</button>
        </form>

        <button onClick={reenviarCodigo} className="reenviar">
          Reenviar código
        </button>
      </div>
    </div>
  );
}
