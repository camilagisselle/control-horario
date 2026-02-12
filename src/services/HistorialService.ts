import api from "./api";

export type CrearHistorialDTO = {
  fecha: string;
  entrada?: string;
  salida?: string;
  inicioColacion?: string;
  finColacion?: string;
};

export const crearHistorial = async (
  correo: string,
  data: CrearHistorialDTO
) => {
  return api.post(`/historial/${correo}`, data);
};

export const obtenerTodosLosHistoriales = async () => {
  const response = await api.get("/historial");
  return response.data;
};

export const obtenerHistorialPorCorreo = async (correo: string) => {
  const response = await api.get(`/usuario/${correo}`);
  return response.data;
};