import axios from "axios";

const API_URL = "http://localhost:3000/api/usuarios";

export const getUsuarios = async () => {
  const res = await axios.get(API_URL);
  return res.data;
};

export const buscarUsuarios = async (query: string) => {
  const res = await axios.get(`${API_URL}/buscar?q=${query}`);
  return res.data;
};

export const crearUsuario = async (data: any) => {
  const res = await axios.post(API_URL, data);
  return res.data;
};

export const editarUsuario = async (id: number, data: any) => {
  const res = await axios.put(`${API_URL}/${id}`, data);
  return res.data;
};

export const cambiarEstadoUsuario = async (id: number) => {
  const res = await axios.patch(`${API_URL}/${id}/estado`);
  return res.data;
};
