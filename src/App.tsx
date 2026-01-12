import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login/Login";
import RecupContrasena from "./pages/Recuperarcontrasena/Recupcontrasena";
import Registro from "./Registro";
import Historial from "./pages/Historial/Historialpaginas";
import Perfil from "./pages.n/Perfil-test";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/recuperar" element={<RecupContrasena />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/perfil-test" element={<Perfil />} />
      </Routes>
    </Router>
  );
}

export default App;
