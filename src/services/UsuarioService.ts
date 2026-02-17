import api from "./api";

export type UsuarioAPI = {
  correo: string;
  nombre: string;
  estado: number;
  perfil: {
    id: number;
    nombre: string;
    perfil_nombre: string;
  };
};

export type CrearUsuarioDTO = {
  nombre: string;
  correo: string;
  password: string;
  perfilId: number;
  estado: number;
};

export type PerfilAPI = {
  perfil_id: number;
  perfil_nombre: string;
};

export type CambiarPasswordDTO = {
  passwordNueva: string;
};

export const listarUsuarios = async (): Promise<UsuarioAPI[]> => {
  const response = await api.get("/usuario");
  return response.data;
};

export const crearUsuario = async (
  data: CrearUsuarioDTO,
): Promise<UsuarioAPI> => {
  const response = await api.post("/usuario", data);
  return response.data;
};

export const actualizarUsuario = async (
  correo: string,
  data: {
    nombre?: string;
    correo?: string;
    estado?: number;
    perfilId?: number;
  },
): Promise<UsuarioAPI> => {
  const response = await api.put(`/usuario/${correo}`, data);
  return response.data;
};

export const cambiarPassword = async (
  data: CambiarPasswordDTO,
): Promise<void> => {
  await api.put(`/usuario/password`, data);
};

export const listarPerfiles = async (): Promise<PerfilAPI[]> => {
  const response = await api.get("/perfil");
  return response.data;
};