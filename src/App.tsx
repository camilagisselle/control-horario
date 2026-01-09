import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Login";
import RecupContrasena from "./RecupContrasena";
import Registro from "./Registro";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/recuperar" element={<RecupContrasena />} />
        <Route path="/registro" element={<Registro />} />
      </Routes>
    </Router>
  );
}

export default App;
