import api from "./api";

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

export const listarHistorial = async (): Promise<HistorialItem> => {
  const response = await api.get("/historial");
  console.log("Historial desde el back: " + response.data);

  return response.data;
};