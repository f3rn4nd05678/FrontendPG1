import api from "./apiService";
import ENDPOINTS from "./apiEndpoints";

export const login = async (credentials) => {
  const response = await api.post(ENDPOINTS.AUTH.LOGIN, credentials);
  return response.data;
};

export const getUsers = async () => {
  const response = await api.post(ENDPOINTS.AUTH.USERS);
  return response.data;
};

export const getMenu = async () => {
  const response = await api.get(ENDPOINTS.MENU.GET_MENU);
  return response.data;
};

export const listarClientes = async (filtros = {}) => {
  const response = await api.get(ENDPOINTS.CLIENTE.LIST);
  return response.data;
};

export const obtenerCliente = async (data) => {
  const response = await api.post(ENDPOINTS.CLIENTE.GET, data);
  return response.data;
};

export const buscarCliente = async (data) => {
  const response = await api.post(ENDPOINTS.CLIENTE.SEARCH, data);
  return response.data;
};

export const crearCliente = async (data) => {
  const response = await api.post(ENDPOINTS.CLIENTE.CREATE, data);
  return response.data;
};

export const actualizarCliente = async (data) => {
  const response = await api.post(ENDPOINTS.CLIENTE.UPDATE, data);
  return response.data;
};

export const eliminarCliente = async (data) => {
  const response = await api.post(ENDPOINTS.CLIENTE.DELETE, data);
  return response.data;
};

export const validarCodigo = async (data) => {
  const response = await api.post(ENDPOINTS.CLIENTE.VALIDATE_CODE, data);
  return response.data;
};

export const validarNit = async (data) => {
  const response = await api.post(ENDPOINTS.CLIENTE.VALIDATE_NIT, data);
  return response.data;
};