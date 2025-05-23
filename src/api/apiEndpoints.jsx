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
    SEARCH: "/Cliente/buscar",
    CREATE: "/Cliente/crear",
    UPDATE: "/Cliente/actualizar",
    DELETE: "/Cliente/eliminar",
    VALIDATE_CODE: "/Cliente/validar-codigo",
    VALIDATE_NIT: "/Cliente/validar-nit",
  },
  MENU: {
    GET_MENU: "/Menu/Obtener-menu",
    GET_ALL_MENUS: "/Menu/Obtener-todos-menus",
  },
};

export default API_ENDPOINTS;
