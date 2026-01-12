import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Registro.css";

export default function Registro() {
  const [hora, setHora] = useState("");
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarConfirmado, setMostrarConfirmado] = useState(false);
  const [accion, setAccion] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const actualizarHora = () => {
      const now = new Date();
      setHora(now.toLocaleTimeString("es-CL"));
    };

    actualizarHora();
    const intervalo = setInterval(actualizarHora, 1000);
    return () => clearInterval(intervalo);
  }, []);

  const abrirConfirmacion = (tipo: string) => {
    setAccion(tipo);
    setMostrarModal(true);
  };

  const confirmar = () => {
    setMostrarModal(false);

    setTimeout(() => {
      setMostrarConfirmado(true);
    }, 200);
  };

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <div className="usuario">
          <div className="avatar">👩</div>
          <div>
            <p>Usuario:</p>
            <strong>Camila Pinilla Cabrera</strong>
          </div>
        </div>

        <button className="menu activo" onClick={() => navigate("/registro")}>
          ✔ Registrar
        </button>
        <button className="menu" onClick={() => navigate("/historial")}>
          📄 Historial
        </button>

        <div className="logout" onClick={() => navigate("/")}>
          ↩ Cerrar sesión
        </div>
      </aside>

      <main className="contenido">
        <div className="panel">
          <h1 className="registro-titulo">Registro de asistencia</h1>
          <img src="/krono2.1.png" className="registro-logo" alt="Logo" />

          <div className="hora">{hora}</div>

          <div className="acciones">
            <button onClick={() => abrirConfirmacion("Entrada")}>
              Entrada
            </button>
            <button onClick={() => abrirConfirmacion("Salida")}>Salida</button>
            <button onClick={() => abrirConfirmacion("Inicio colación")}>
              Inicio colación
            </button>
            <button onClick={() => abrirConfirmacion("Fin colación")}>
              Fin colación
            </button>
          </div>
        </div>
      </main>

      {mostrarModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>CONFIRMA ESTA ACCIÓN</h3>
            <p>{accion}</p>
            <div className="modal-botones">
              <button className="aceptar" onClick={confirmar}>
                Aceptar
              </button>
              <button
                className="cancelar"
                onClick={() => setMostrarModal(false)}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {mostrarConfirmado && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>¡Registrado con éxito!</h3>
            <p>{accion}</p>
            <div className="modal-botones">
              <button
                className="aceptar"
                onClick={() => setMostrarConfirmado(false)}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}