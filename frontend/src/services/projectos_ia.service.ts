// src/services/proyectos.service.ts
import api from "./api"; // tu instancia axios (baseURL: /api)

export const crearProyecto = async (data: any) => {
  const res = await api.post("/proyectos", data);
  return res.data;
};

export const listarMetodologias = async () => {
  const res = await api.get("/metodologias");
  return res.data;
};
