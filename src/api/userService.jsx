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

export const listarClientes = () => api.post(ENDPOINTS.CLIENTE.LIST);

export const obtenerCliente = (id) =>
  api.post(ENDPOINTS.CLIENTE.GET, { id });

export const buscarCliente = (data) =>
  api.post(ENDPOINTS.CLIENTE.SEARCH, data);

export const crearCliente = (data) =>
  api.post(ENDPOINTS.CLIENTE.CREATE, data);

export const actualizarCliente = (data) =>
  api.post(ENDPOINTS.CLIENTE.UPDATE, data);

export const eliminarCliente = (id) =>
  api.post(ENDPOINTS.CLIENTE.DELETE, { id });

export const validarCodigo = (codigo) =>
  api.post(ENDPOINTS.CLIENTE.VALIDATE_CODE, { codigo });

export const validarNit = (nit) =>
  api.post(ENDPOINTS.CLIENTE.VALIDATE_NIT, { nit });