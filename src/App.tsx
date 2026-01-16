import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login/Login";
import RecupContrasena from "./pages/Recuperarcontrasena/Recupcontrasena";
import Registro from "./pages/Registros/Registro";
import Historial from "./pages/Historial/Historialpaginas";
import Perfil from "./pages/Perfil/Perfil";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/recuperar" element={<RecupContrasena />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/historial" element={<Historial />} /> {/* ← agregar */}
        <Route path="/perfil" element={<Perfil/>} />
      </Routes>
    </Router>
  );
}

export default App;
