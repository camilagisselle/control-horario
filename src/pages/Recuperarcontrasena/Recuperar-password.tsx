import "./App.css";
import logo from "./assets/logo.png";

function App() {
  return (
    <div className="background">
      {/* Logo */}
      <div className="logo">
        <img src={logo} alt="Logo KRONO" />
      </div>

      {/* Título */}
      <h1 className="title">RECUPERAR CONTRASEÑA</h1>

      {/* Recuadro */}
      <div className="card">
        <div className="form">
          <label>Ingrese e-mail:</label>
          <input type="email" />
        </div>

        <button>Aceptar</button>
      </div>
    </div>
  );
}

export default App;