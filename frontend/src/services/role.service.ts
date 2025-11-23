import axios from "axios";

const API_URL = "http://localhost:3000/api/roles";

export const getRoles = async () => {
  const res = await axios.get(API_URL);
  return res.data;
};

export const crearRol = async (data: any) => {
  const res = await axios.post(API_URL, data);
  return res.data;
};

export const editarRol = async (id: number, data: any) => {
  const res = await axios.put(`${API_URL}/${id}`, data);
  return res.data;
};

export const eliminarRol = async (id: number) => {
  const res = await axios.delete(`${API_URL}/${id}`);
  return res.data;
};
