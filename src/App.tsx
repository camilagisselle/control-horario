import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./pages/Login/Login";
import RecupContrasena from "./pages/Recuperarcontrasena/Recupcontrasena";
import Registro from "./pages/Registros/Registro";
import Historial from "./pages/Historial/Historialpaginas";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/recuperar" element={<RecupContrasena />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/historial" element={<Historial />} /> {/* ← agregar */}
      </Routes>
    </Router>
  );
}
<<<<<<< HEAD
 
export default App;
=======

export default App;
>>>>>>> 40e1e0ebf0fc30e5f2e2ebbcc60c6a89092ce4eb
