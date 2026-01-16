import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login/Login";
import RecuperarPassword from "./pages/Recuperarcontrasena/Recuperarpassword";
import Registro from "./pages/Registros/Registro";
import Historial from "./pages/Historial/Historialpaginas";
import AdminHistorial from "./pages/Admin/AdminHistorial";
import AdminUsuarios from "./pages/Admin/AdminUsuarios";
import PerfilTest from "./pages/Perfil/Perfil";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/recuperarpassword" element={<RecuperarPassword />} />
        <Route path="/registro" element={<Registro />} />

        <Route path="/historial" element={<Historial />} />
        <Route path="/perfil" element={<PerfilTest />} />

        {/* página pública de historial */}
        <Route path="/historial" element={<Historial />} />

        {/* páginas admin: agrega estas rutas */}
        <Route path="/admin/usuarios" element={<AdminUsuarios />} />
        <Route path="/admin/historial" element={<AdminHistorial />} />
      </Routes>
    </Router>
  );
}

export default App;
