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

export const detallePerfilUsuario = async (
  correo: string
): Promise<UsuarioAPI> => {
  const response = await api.get<UsuarioAPI>(
    `/usuario/${encodeURIComponent(correo)}`
  );

  return response.data;
};

export const actualizarUsuario = async (
  correo: string,
  data: { nombre?: string; password?: string }
) => {
  const response = await api.put(`/usuario/${encodeURIComponent(correo)}`, data);
  return response.data;
};