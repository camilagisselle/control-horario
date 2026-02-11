import { useEffect, useState } from "react";
import "./AdminUsuarios.css";
import { listarUsuarios } from "../../services/UsuarioService";

interface Usuario {
  id: number;
  nombre: string;
  correo: string;
  estado: number;
  perfil: {
    id: number;
    nombre: string;
  };
}

const AdminUsuarios = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [busqueda, setBusqueda] = useState("");
  // const [usuarioEditando, setUsuarioEditando] = useState<Usuario | null>(null);

  useEffect(() => {
    listarUsuarios()
      .then((data) => {
        setUsuarios(data);
      })
      .catch((error) => {
        console.error("Error al listar usuarios:", error);
      });
  }, []);

  const usuariosFiltrados = usuarios.filter((u) =>
    u.nombre.toLowerCase().includes(busqueda.toLowerCase()),
  );

  return (
    <div className="admin-usuarios">
      <h2>Usuarios</h2>

      <input
        type="text"
        placeholder="Buscar usuario"
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      />

      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Correo</th>
            <th>Perfil</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {usuariosFiltrados.map((u) => (
            <tr key={u.id}>
              <td>{u.nombre}</td>
              <td>{u.correo}</td>
              <td>{u.perfil.nombre}</td>
              <td>{u.estado === 1 ? "Activo" : "Inactivo"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminUsuarios;
