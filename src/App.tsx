import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./pages/Login/Login";
import RecuperarPassword from "./pages/Recuperarcontrasena/Recuperarpassword";
import Registro from "./pages/Registros/Registro";
import Historial from "./pages/Historial/Historialpaginas";
import PerfilTest from "./pages/Perfil/Perfil-test";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/recuperarpassword" element={<RecuperarPassword />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/historial" element={<Historial />} />
        <Route path="/perfil" element={<PerfilTest />} />
      </Routes>
    </Router>
  );
}

export default App;
