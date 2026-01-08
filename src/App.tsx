import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Login";
import RecupContraseña from "./Recupcontrasena";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/recuperar" element={<RecupContraseña />} />
      </Routes>
    </Router>
  );
}

export default App;
