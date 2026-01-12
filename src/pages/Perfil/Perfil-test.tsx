import { useNavigate } from "react-router-dom";

export default function PerfilTest() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: "40px" }}>
      <h1>Perfil del Usuario</h1>

      <p><strong>Nombre:</strong> Camila Pinilla Cabrera</p>
      <p><strong>Correo:</strong> camila@email.com</p>

      <button onClick={() => navigate("/registro")}>
        ⬅ Volver a Registro
      </button>
    </div>
  );
}
