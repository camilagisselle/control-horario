import { useState, useEffect } from "react";
import "./Registro.css";
import {crearHistorial, type CrearHistorialDTO, obtenerHistorialPorCorreo} from "../../services/HistorialService";
import Modal from "../../Modals/modal";
import axios from "axios";
import { getDeviceId } from "../../services/DeviceService";

export default function Registro() {
  const [hora, setHora] = useState("");
  const [accion, setAccion] = useState("");
  const [loading, setLoading] = useState(true);
  const [procesando, setProcesando] = useState(false);

  const [modal, setModal] = useState({
    open: false,
    type: "success" as "success" | "error" | "info" | "confirm",
    title: "",
    message: "",
  });

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
          const registroHoy = historial.find((r: { fecha: string; }) => r.fecha === hoy);

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
        console.error(error);
        setModal({
          open: true,
          type: "error",
          title: "Error",
          message: "Error obteniendo historial",
        });
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

    setModal({
      open: true,
      type: "confirm",
      title: "Confirmar acción",
      message: tipo,
    });
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
    setModal(prev => ({ ...prev, open: false }));
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
    const payload: CrearHistorialDTO = { fecha };

    if (accion === "Entrada") payload.entrada = horaActual;
    if (accion === "Salida") payload.salida = horaActual;
    if (accion === "Inicio colación") payload.inicioColacion = horaActual;
    if (accion === "Fin colación") payload.finColacion = horaActual;

    const deviceId = getDeviceId();
    console.log("UUID que vamos a enviar al back en historial:", deviceId);

    try {
      await crearHistorial(correo, payload);
      actualizarBotones(accion);
      setModal({
        open: true,
        type: "success",
        title: "Registrado con éxito",
        message: accion,
      });

    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 403) {
            setModal({
              open: true,
              type: "error",
              title: "Error",
              message: "Este equipo no está autorizado para registrar asistencia",
            });
        }
      }else{      
        console.error("Error al registrar asistencia:", error);
      }
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
                  disabled={loading || !botonesHabilitados[key] || modal.open || procesando}
                  className={loading || !botonesHabilitados[key] || modal.open || procesando ? "deshabilitado" : ""}
                >
                  {tipo}
                </button>
              );
            })}
          </div>
        </div>
      </main>

      <Modal
        open={modal.open}
        type={modal.type}
        title={modal.title}
        message={modal.message}
        onClose={() => setModal(prev => ({ ...prev, open: false }))}
        onConfirm={modal.type === "confirm" ? confirmar : undefined}
      />
    </div>
  );
}