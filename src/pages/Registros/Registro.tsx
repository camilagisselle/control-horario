import { useState, useEffect } from "react";
import "./Registro.css";
import { crearHistorial, obtenerHistorialPorCorreo } from "../../services/HistorialService";

export default function Registro() {
  const [hora, setHora] = useState("");
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarConfirmado, setMostrarConfirmado] = useState(false);
  const [accion, setAccion] = useState("");
  const [loading, setLoading] = useState(true);
  const [procesando, setProcesando] = useState(false);

  const [botonesHabilitados, setBotonesHabilitados] = useState({
    entrada: true,
    salida: false,
    inicioColacion: false,
    finColacion: false,
  });

  // Actualiza la hora cada segundo
  useEffect(() => {
    const actualizarHora = () => setHora(new Date().toLocaleTimeString("es-CL"));
    actualizarHora();
    const intervalo = setInterval(actualizarHora, 1000);
    return () => clearInterval(intervalo);
  }, []);

  // Inicializa los botones según el historial
  useEffect(() => {
    const initBotones = async () => {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) return setLoading(false);

      const user = JSON.parse(storedUser);
      const correo = user.correo;

      try {
        const historial = await obtenerHistorialPorCorreo(correo);
        console.log("data historial", historial);

        const hoy = new Intl.DateTimeFormat("sv-SE", {
          timeZone: "America/Santiago",
          year: "numeric",
          month: "2-digit",
          day: "2-digit"
        }).format(new Date());

        const botones = {
          entrada: true,
          salida: false,
          inicioColacion: false,
          finColacion: false,
        };

        if (historial && historial.length > 0) {
          const registroHoy = historial.find(r => r.fecha === hoy);

          if (registroHoy) {
            if (registroHoy.salida) {
              botones.entrada = false;
              botones.salida = false;
              botones.inicioColacion = false;
              botones.finColacion = false;
            } else {
              botones.entrada = !registroHoy.entrada;
              botones.salida = !!registroHoy.entrada && !registroHoy.salida;
              botones.inicioColacion = !!registroHoy.entrada && registroHoy.inicioColacion === null;
              botones.finColacion = registroHoy.inicioColacion !== null && registroHoy.finColacion === null;
            }
          }
        }

        setBotonesHabilitados(botones);

      } catch (error) {
        console.error("Error obteniendo historial:", error);
      } finally {
        setLoading(false);
      }
    };

    initBotones();
  }, []);

  // Tipos
  type BotonKey = "entrada" | "salida" | "inicioColacion" | "finColacion";

  const keyMap: { [tipo: string]: BotonKey } = {
    "Entrada": "entrada",
    "Salida": "salida",
    "Inicio colación": "inicioColacion",
    "Fin colación": "finColacion",
  };

  const abrirConfirmacion = (tipo: string) => {
    setAccion(tipo);
    setMostrarModal(true);
  };

  const actualizarBotones = (accionRealizada: string) => {
    setBotonesHabilitados((prev) => {
      switch (accionRealizada) {
        case "Entrada":
          return { entrada: false, salida: true, inicioColacion: true, finColacion: false };
        case "Inicio colación":
          return { ...prev, inicioColacion: false, finColacion: true };
        case "Fin colación":
          return { ...prev, finColacion: false };
        case "Salida":
          return { entrada: false, salida: false, inicioColacion: false, finColacion: false };
        default:
          return prev;
      }
    });
  };

  const confirmar = async () => {
    setMostrarModal(false);
    setProcesando(true);

    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      setProcesando(false);
      return;
    }

    const user = JSON.parse(storedUser);
    const correo = user.correo;

    const now = new Date();
    const fecha = new Intl.DateTimeFormat("sv-SE", {
      timeZone: "America/Santiago",
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    }).format(now);
    const horaActual = now.toLocaleTimeString("sv-SE");
    const payload: any = { fecha };

    if (accion === "Entrada") payload.entrada = horaActual;
    if (accion === "Salida") payload.salida = horaActual;
    if (accion === "Inicio colación") payload.inicioColacion = horaActual;
    if (accion === "Fin colación") payload.finColacion = horaActual;

    try {
      await crearHistorial(correo, payload);
      actualizarBotones(accion); 
      setTimeout(() => setMostrarConfirmado(true), 200);
    } catch (error) {
      console.error("Error registrando:", error);
    } finally {
      setProcesando(false);
    }
  };

  return (
    <div className="dashboard">
      <main className="contenido">
        <h1 className="registro-titulo">Registro de Asistencia</h1>

        <div className={`panel ${!loading ? "loaded" : ""}`}>
          <div className="hora">{loading ? "Cargando..." : hora}</div>

          <div className="acciones">
            {["Entrada", "Salida", "Inicio colación", "Fin colación"].map((tipo) => {
              const key = keyMap[tipo] as BotonKey;
              return (
                <button
                  key={tipo}
                  onClick={() => abrirConfirmacion(tipo)}
                  disabled={loading || !botonesHabilitados[key] || mostrarModal || procesando}
                  className={loading || !botonesHabilitados[key] || mostrarModal || procesando ? "deshabilitado" : ""}
                >
                  {tipo}
                </button>
              );
            })}
          </div>
        </div>
      </main>

      {mostrarModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>CONFIRMA ESTA ACCIÓN</h3>
            <p>{accion}</p>
            <div className="modal-botones">
              <button className="aceptar" onClick={confirmar}>Aceptar</button>
              <button className="cancelar" onClick={() => setMostrarModal(false)}>Cancelar</button>
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
              <button className="aceptar" onClick={() => setMostrarConfirmado(false)}>OK</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}