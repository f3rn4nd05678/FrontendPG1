const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/Auth/login",
    REGISTER: "/Auth/crear-usuario",
    RESET_PASSWORD: "/Auth/reiniciar-contrasenia",
    USERS: "/Auth/listar-usuarios",
  },
  CLIENTE: {
    LIST: "/Cliente/listar",
    GET: "/Cliente/obtener",
    CREATE: "/Cliente/crear",
    UPDATE: "/Cliente/actualizar",
    DELETE: "/Cliente/eliminar",
  },
  MENU: {
    GET_MENU: "/Menu/Obtener-menu",
    GET_ALL_MENUS: "/Menu/Obtener-todos-menus",
  },
};

export default API_ENDPOINTS;
