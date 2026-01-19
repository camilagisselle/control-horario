import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "./Perfil.css";

export default function PerfilTest() {
  const navigate = useNavigate();
  const [menu, setMenu] = useState(false);

  const [nombre, setNombre] = useState("Camila Pinilla Cabrera");
  const [correo] = useState("camila@email.com");
  const [password, setPassword] = useState("123456");
  const [avatar, setAvatar] = useState("/avatar.jpeg");

  const cambiarAvatar = (e: any) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => setAvatar(reader.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <div className="perfil-root">
      {/* SIDEBAR */}
      <aside className={`perfil-sidebar ${menu ? "open" : ""}`}>
        <div className="perfil-user" onClick={() => setMenu(!menu)}>
          <img src={avatar} />
          <div>
            <p>Usuario</p>
            <strong>{nombre}</strong>
          </div>
        </div>

        {/* ✅ MENÚ: UN SOLO RENDER */}
        {menu && (
          <div className="perfil-menu">
            <button onClick={() => navigate("/registro")}>Registrar</button>
            <button onClick={() => navigate("/historial")}>Historial</button>
            <button onClick={() => navigate("/")}>Cerrar sesión</button>
          </div>
        )}
      </aside>

      {/* CONTENIDO */}
      <main className="perfil-contenido">
        {/* BOTÓN MOBILE */}
        <button className="hamburguesa" onClick={() => setMenu(!menu)}>
          ☰
        </button>

        <div className="perfil-top">
          <h1>Perfil</h1>
        </div>

        {/* TARJETA PERFIL */}
        <div className="perfil-card">
          <div className="perfil-avatar-grande">
            <label htmlFor="avatarInput">
              <img src={avatar} />
              <span>✏</span>
            </label>
            <input
              id="avatarInput"
              type="file"
              accept="image/*"
              hidden
              onChange={cambiarAvatar}
            />
          </div>

          <div className="perfil-info">
            <div>
              <label>Nombre</label>
              <input
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />
            </div>

            <div>
              <label>Correo</label>
              <input value={correo} disabled />
            </div>

            <div>
              <label>Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
        </div>

        <img src="/krono2.1.png" className="perfil-logo" />
      </main>
    </div>
  );
}
