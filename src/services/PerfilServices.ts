import api from "./api";

export type RegistrarAccesoDTO = {
  pagina: string;
};

export type RegistrarAccesoResponse = {
  message: string;
};

export type UsuarioAPI = {
  id: number;
  nombre: string;
  correo: string;
  estado: number;
  perfil: {
    id: number;
    nombre: string;
  };
};

const storedUser = localStorage.getItem("user");
const correo = storedUser ? JSON.parse(storedUser).correo : "";
console.log("correo en perfil services: " + correo);
export const detallePerfilUsuario = async (): Promise<UsuarioAPI> => {
  const response = await api.get<UsuarioAPI>(
    `/usuario/${encodeURIComponent(correo)}`
  );
  
  return response.data;
};

// export const obtenerAccesosPorUsuario = async (
//   correo: string
// ): Promise<AccesoLog[]> => {
//   const response = await api.get<AccesoLog[]>(`/acceso-log/${correo}`);
//   return response.data;
// };