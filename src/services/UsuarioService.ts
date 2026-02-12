import api from "./api";

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

export type CrearUsuarioDTO = {
  nombre: string;
  correo: string;
  password: string;
  perfilId: number;
};

export const listarUsuarios = async (): Promise<UsuarioAPI[]> => {
  const response = await api.get("/usuario");
  //console.log("token de api: " + response.data);

  return response.data;
};

export const obtenerUsuarioPorCorreo = async (
  correo: string,
): Promise<UsuarioAPI> => {
  const response = await api.get(`/usuario/${correo}`);
  return response.data;
};

export const crearUsuario = async (
  data: CrearUsuarioDTO,
): Promise<UsuarioAPI> => {
  const response = await api.post("/usuario", {
    nombre: data.nombre,
    correo: data.correo,
    password: data.password,
    perfilId: data.perfilId,
  });

  return response.data;
};

export type ActualizarUsuarioDTO = {
  nombre?: string;
  estado?: number;
};

export const actualizarUsuario = async (
  correo: string,
  data: ActualizarUsuarioDTO,
): Promise<UsuarioAPI> => {
  const response = await api.put(`/usuario/${correo}`, data);
  return response.data;
};
