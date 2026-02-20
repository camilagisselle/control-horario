import { useState } from "react";
import "./Recuperarpassword.css";
import { useNavigate } from "react-router-dom";
import Modal from "../../Modals/modal";

function RecuperarPassword() {
  const [correo, setCorreo] = useState("");
  const navigate = useNavigate();

  const [modal, setModal] = useState({
    open: false,
    type: "success" as "success" | "error" | "info" | "confirm",
    title: "",
    message: "",
  });

  const enviarCodigo = async () => {
    if (!correo.trim()) {
      setModal({
        open: true,
        type: "error",
        title: "Correo requerido",
        message: "Por favor ingrese un correo válido",
      });
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
            correo: correo.trim(),
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Error en la solicitud");
      }
      setModal({
        open: true,
        type: "success",
        title: "Código enviado",
        message: "Se ha enviado un código de verificación a su correo.",
      });
    } catch (error) {
      console.error(error);
      setModal({
        open: true,
        type: "error",
        title: "Error",
        message: "No se pudo enviar el correo. Intente nuevamente.",
      });
    }
  };

  const cerrarModal = () => {
    setModal(prev => ({ ...prev, open: false }));
    if (modal.type === "success") {
      navigate("/");
    }
  };

  return (
    <div className="background">
      {/* LOGO */}
      <div className="logo">
        <img src="/krono2.1.png" alt="Logo KRONO" />
      </div>

      {/* CONTENIDO */}
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
      <Modal
        open={modal.open}
        type={modal.type}
        title={modal.title}
        message={modal.message}
        onClose={cerrarModal}
      />
    </div>
  );
}

export default RecuperarPassword;