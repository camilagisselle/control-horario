import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login/Login";
import RecuperarPassword from "./pages/Recuperarcontrasena/Recuperarpassword";
import Registro from "./pages/Registros/Registro";
import Historial from "./pages/Historial/Historialpaginas";
import Adminhistorial from "./pages/Admin/Adminhistorial";
import Adminusuarios from "./pages/Admin/Adminusuarios";
import Perfil from "./pages/Perfil/Perfil";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/recuperarpassword" element={<RecuperarPassword />} />
        <Route path="/registro" element={<Registro />} />

        <Route path="/historial" element={<Historial />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/historial" element={<Historial />} />

        {/* páginas admin: agrega estas rutas */}
        <Route path="/admin/usuarios" element={<Adminusuarios />} />
        <Route path="/admin/historial" element={<Adminhistorial />} />
      </Routes>
    </Router>
  );
}

export default App;
