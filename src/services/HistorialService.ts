import api from "./api";
import { getDeviceId } from "./DeviceService";

export type CrearHistorialDTO = {
  fecha: string;
  entrada?: string;
  salida?: string;
  inicioColacion?: string;
  finColacion?: string;
};

export type ActualizarHistorialDTO = {
  entrada?: string;
  salida?: string;
  inicioColacion?: string;
  finColacion?: string;
};
interface HistorialItem {
  id: number;
  usuario: string;
  fecha: string;
  entrada: string;
  inicioColacion: string;
  finColacion: string;
  salida: string;
  totalHoras: string;
}

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

export const obtenerTodosLosHistoriales = async () => {
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

export const listarHistorial = async (): Promise<HistorialItem[]> => {
  const response = await api.get("/historial");
  return response.data;
};