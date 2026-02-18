import { useState } from "react";
import "./Recuperarpassword.css";

function RecuperarPassword() {
  const [mostrarModal, setMostrarModal] = useState(false);
  const [correo, setCorreo] = useState(""); // 👈 NUEVO estado para guardar el email

  const enviarCodigo = async () => {
    if (!correo) {
      alert("Por favor ingrese un correo");
      return;
    }

    try {
          const response = await fetch(
      "http://localhost:8080/v1/control-horario/password/request",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            correo: correo,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Error al enviar el correo");
      }

      // Si todo sale bien mostramos tu modal
      setMostrarModal(true);
    } catch (error) {
      console.error("Error:", error);
      alert("No se pudo enviar el correo");
    }
  };

  const confirmar = () => {
    setMostrarModal(false);
  };

  return (
    <div className="background">
      {/* LOGO */}
      <div className="logo">
        <img src="/krono2.1.png" alt="Logo KRONO" />
      </div>

      {/* CONTENIDO CENTRAL */}
      <div className="content">
        <h1 className="title">RECUPERAR CONTRASEÑA</h1>

        <div className="card">
          <div className="form">
            <label>Ingrese e-mail:</label>
            <input
              type="email"
              placeholder="correo@ejemplo.com"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
            />
          </div>

          <button onClick={enviarCodigo}>Aceptar</button>
        </div>
      </div>

      {/* MODAL */}
      {mostrarModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>Código enviado</h3>
            <p>
              Se ha enviado un código de verificación a su correo electrónico.
            </p>

            <div className="modal-botones">
              <button className="aceptar" onClick={confirmar}>
                Aceptar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RecuperarPassword;