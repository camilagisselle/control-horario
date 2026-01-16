import { useState } from "react";
import "./Recuperarpassword.css";

function RecuperarPassword() {
  const [mostrarModal, setMostrarModal] = useState(false);

  const enviarCodigo = () => {
    // Aquí después puedes conectar el envío real del correo
    setMostrarModal(true);
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
            <input type="email" placeholder="correo@ejemplo.com" />
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
