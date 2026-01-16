import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Registro.css";

export default function Registro() {
  const [hora, setHora] = useState("");
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarConfirmado, setMostrarConfirmado] = useState(false);
  const [accion, setAccion] = useState("");
  const [menuAvatar, setMenuAvatar] = useState(false);

  // NUEVO ESTADO: Para controlar si el sidebar lateral está visible en móvil
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
    setTimeout(() => setMostrarConfirmado(true), 200);
  };

  return (
    <div className="dashboard">
      
      {/* NUEVO: Botón Hamburguesa (Solo visible en móvil por CSS) */}
      <button 
        className="btn-hamburguesa" 
        onClick={() => setSidebarOpen(true)}
      >
        ☰
      </button>

      {/* NUEVO: Overlay oscuro para cerrar menú al hacer click afuera */}
      <div 
        className={`overlay ${sidebarOpen ? 'active' : ''}`} 
        onClick={() => setSidebarOpen(false)}
      ></div>

      {/* SIDEBAR: Agregamos lógica para la clase 'active' */}
      <aside className={`sidebar ${sidebarOpen ? 'active' : ''}`}>
        <div className="usuario">
          <div
            className="avatar"
            onClick={() => setMenuAvatar(!menuAvatar)}
          >
            <img
              src="/avatar.jpeg"
              alt="Avatar usuario"
              className="avatar-img"
            />
          </div>

          <div>
            <p>Usuario:</p>
            <strong>Camila Pinilla Cabrera</strong>
          </div>

          {menuAvatar && (
            <div className="avatar-menu">
              <button onClick={() => navigate("/perfil")}>Perfil</button>
              <button onClick={() => navigate("/registro")}>Registro</button>
              <button onClick={() => navigate("/historial")}>Historial</button>
              <button className="cerrar" onClick={() => navigate("/")}>
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </aside>

      <main className="contenido">
        <h1 className="registro-titulo">Registro de asistencia</h1>

        <div className="panel">
          <div className="hora">{hora}</div>

          <div className="acciones">
            <button onClick={() => abrirConfirmacion("Entrada")}>
              Entrada
            </button>
            <button onClick={() => abrirConfirmacion("Salida")}>
              Salida
            </button>
            <button onClick={() => abrirConfirmacion("Inicio colación")}>
              Inicio colación
            </button>
            <button onClick={() => abrirConfirmacion("Fin colación")}>
              Fin colación
            </button>
          </div>
        </div>

        {/* LOGO */}
        <img src="/krono2.1.png" className="registro-logo" alt="Logo" />
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