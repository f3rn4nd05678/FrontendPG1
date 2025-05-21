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
