import api from "./api"; // tu instancia axios

export const crearProyecto = async (data: any) => {
  const res = await api.post("/proyectos", data);
  return res.data;
};
