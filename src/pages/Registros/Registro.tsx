import { useState, useEffect } from "react";
import "./Registro.css";
import { crearHistorial } from "../../services/HistorialService";

export default function Registro() {
  const [hora, setHora] = useState("");
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarConfirmado, setMostrarConfirmado] = useState(false);
  const [accion, setAccion] = useState("");

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

  const confirmar = async () => {
    setMostrarModal(false);

    const storedUser = localStorage.getItem("user");
    if (!storedUser) return;

    const user = JSON.parse(storedUser);
    const correo = user.correo;

    const now = new Date();
    const fecha = now.toISOString().split("T")[0];
    const horaActual = now.toLocaleTimeString("sv-SE");
    const payload: any = { fecha };

    if (accion === "Entrada") payload.entrada = horaActual;
    if (accion === "Salida") payload.salida = horaActual;
    if (accion === "Inicio colación") payload.inicioColacion = horaActual;
    if (accion === "Fin colación") payload.finColacion = horaActual;

    try {
      await crearHistorial(correo, payload);
      setTimeout(() => setMostrarConfirmado(true), 200);
    } catch (error) {
      console.error("Error registrando:", error);
    }
  };


  return (
    <div className="dashboard">
      <main className="contenido">
        <h1 className="registro-titulo">Registro de Asistencia</h1>

        <div className="panel">
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
