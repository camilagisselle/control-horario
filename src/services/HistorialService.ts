import api from "./api";
import { getDeviceId } from "./DeviceService";

export type CrearHistorialDTO = {
  fecha: string;
  entrada?: string;
  salida?: string;
  inicioColacion?: string;
  finColacion?: string;
};

export interface HistorialDTO {
  id: number;
  correoUsuario: string;
  fecha: string;
  entrada?: string | null;
  inicioColacion?: string | null;
  finColacion?: string | null;
  salida?: string | null;
  totalHoras?: string | number | null;
}

export type ActualizarHistorialDTO = {
  entrada?: string;
  salida?: string;
  inicioColacion?: string;
  finColacion?: string;
};

export const crearHistorial = async (
  correo: string,
  data: CrearHistorialDTO
) => {
  const deviceId = getDeviceId();

  return api.post(`/historial/${correo}`, data, {
    headers: {
      "UUID": deviceId,
    },
  });
};

export const obtenerTodosLosHistoriales = async (): Promise<HistorialDTO[]> => {
  const response = await api.get("/historial");
  return response.data;
};

export const obtenerHistorialPorCorreo = async (correo: string) => {
  const response = await api.get(`/historial/usuario/${correo}`);
  return response.data;
};

export const actualizarHistorial = async (
  id: number,
  data: ActualizarHistorialDTO
) => {
  const deviceId = getDeviceId();

  const response = await api.put(`/historial/${id}`, data, {
    headers: {
      "UUID": deviceId,
    },
  });

  return response.data;
};