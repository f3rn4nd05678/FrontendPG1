import api from "./apiService";
import ENDPOINTS from "./apiEndpoints";

// ========================================
// AUTENTICACIÓN
// ========================================


export const login = (credentials) => api.post(ENDPOINTS.AUTH.LOGIN, credentials).then((res) => {

  const detail = res?.data?.detail;
  if (!detail) {
    const msg = res?.data?.message || "Respuesta inválida del servidor";
    throw new Error(msg);
  }
  return detail; // <- devuelve el payload directo
});

export const getUsers = async () => {
  const response = await api.post(ENDPOINTS.AUTH.USERS);
  return response.data;
};

export const getMenu = async () => {
  const response = await api.get(ENDPOINTS.MENU.GET_MENU);
  return response.data;
};

// ========================================
// USUARIOS
// ========================================

export const listarUsuarios = async (filtros = {}) => {
  const response = await api.post(ENDPOINTS.USUARIO.LIST, filtros);
  return response.data;
};

export const obtenerUsuario = async (data) => {
  const response = await api.post(ENDPOINTS.USUARIO.GET, data);
  return response.data;
};

export const crearUsuario = async (data) => {
  const response = await api.post(ENDPOINTS.USUARIO.CREATE, data);
  return response.data;
};

export const actualizarUsuario = async (data) => {
  const { id, ...datos } = data;
  const response = await api.post(ENDPOINTS.USUARIO.UPDATE, {
    id,
    datos
  });
  return response.data;
};

export const eliminarUsuario = async (data) => {
  const response = await api.post(ENDPOINTS.USUARIO.DELETE, data);
  return response.data;
};

export const validarCorreoUsuario = async (data) => {
  const response = await api.post(ENDPOINTS.USUARIO.VALIDATE_CORREO, data);
  return response.data;
};

export const cambiarPasswordUsuario = async (data) => {
  const response = await api.post(ENDPOINTS.USUARIO.CAMBIAR_PASSWORD, data);
  return response.data;
};

export const activarDesactivarUsuario = async (data) => {
  const response = await api.post(ENDPOINTS.USUARIO.ACTIVAR_DESACTIVAR, data);
  return response.data;
};

// ========================================
// ROLES
// ========================================

export const listarRoles = async (filtros = {}) => {
  const response = await api.post(ENDPOINTS.ROL.LIST, filtros);
  return response.data;
};

export const obtenerRol = async (data) => {
  const response = await api.post(ENDPOINTS.ROL.GET, data);
  return response.data;
};

export const crearRol = async (data) => {
  const response = await api.post(ENDPOINTS.ROL.CREATE, data);
  return response.data;
};

export const actualizarRol = async (data) => {
  const { id, ...datos } = data;
  const response = await api.post(ENDPOINTS.ROL.UPDATE, {
    id,
    datos
  });
  return response.data;
};

export const eliminarRol = async (data) => {
  const response = await api.post(ENDPOINTS.ROL.DELETE, data);
  return response.data;
};

// ========================================
// PERMISOS
// ========================================

export const listarPermisos = async (filtros = {}) => {
  const response = await api.post(ENDPOINTS.PERMISO.LIST, filtros);
  return response.data;
};

export const obtenerPermiso = async (data) => {
  const response = await api.post(ENDPOINTS.PERMISO.GET, data);
  return response.data;
};

export const asignarPermisoARol = async (data) => {
  const response = await api.post(ENDPOINTS.PERMISO.ASIGNAR_ROL, data);
  return response.data;
};

export const removerPermisoDeRol = async (data) => {
  const response = await api.post(ENDPOINTS.PERMISO.REMOVER_ROL, data);
  return response.data;
};

export const listarPermisosPorRol = async (data) => {
  const response = await api.post(ENDPOINTS.PERMISO.LISTAR_POR_ROL, data);
  return response.data;
};

// ========================================
// CLIENTES
// ========================================

export const listarClientes = async (filtros = {}) => {
  const response = await api.post(ENDPOINTS.CLIENTE.LIST, filtros);
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

// ========================================
// PRODUCTOS
// ========================================

export const listarProductos = async (filtros = {}) => {
  const response = await api.post(ENDPOINTS.PRODUCTO.LIST, filtros);
  return response.data;
};

export const obtenerProducto = async (data) => {
  const response = await api.post(ENDPOINTS.PRODUCTO.GET, data);
  return response.data;
};

export const buscarProducto = async (data) => {
  const response = await api.post(ENDPOINTS.PRODUCTO.SEARCH, data);
  return response.data;
};

export const crearProducto = async (data) => {
  const response = await api.post(ENDPOINTS.PRODUCTO.CREATE, data);
  return response.data;
};

/**
 * Actualizar un producto existente
 * Backend espera: { id: number, datos: ActualizarProductoDto }
 */
export const actualizarProducto = async (data) => {
  const { id, ...datos } = data;
  const response = await api.post(ENDPOINTS.PRODUCTO.UPDATE, {
    id,
    datos
  });
  return response.data;
};

export const eliminarProducto = async (data) => {
  const response = await api.post(ENDPOINTS.PRODUCTO.DELETE, data);
  return response.data;
};

export const validarCodigoProducto = async (data) => {
  const response = await api.post(ENDPOINTS.PRODUCTO.VALIDATE_CODE, data);
  return response.data;
};

// ========================================
// PROVEEDORES
// ========================================

export const listarProveedores = async (filtros = {}) => {
  const response = await api.post(ENDPOINTS.PROVEEDOR.LIST, filtros);
  return response.data;
};

export const obtenerProveedor = async (data) => {
  const response = await api.post(ENDPOINTS.PROVEEDOR.GET, data);
  return response.data;
};

export const buscarProveedor = async (data) => {
  const response = await api.post(ENDPOINTS.PROVEEDOR.SEARCH, data);
  return response.data;
};

export const crearProveedor = async (data) => {
  const response = await api.post(ENDPOINTS.PROVEEDOR.CREATE, data);
  return response.data;
};

export const actualizarProveedor = async (data) => {
  const { id, ...datos } = data;
  const response = await api.post(ENDPOINTS.PROVEEDOR.UPDATE, {
    id,
    datos
  });
  return response.data;
};

export const eliminarProveedor = async (data) => {
  const response = await api.post(ENDPOINTS.PROVEEDOR.DELETE, data);
  return response.data;
};

export const validarNombreProveedor = async (data) => {
  const response = await api.post(ENDPOINTS.PROVEEDOR.VALIDATE_NAME, data);
  return response.data;
};

export const cambiarPasswordPrimerLogin = async (data) => {
  const response = await api.post(ENDPOINTS.USUARIO.CAMBIAR_PASSWORD_PRIMER_LOGIN, data);
  return response.data;
};

export const solicitarResetPassword = async (correo) => {
  const response = await api.post(ENDPOINTS.AUTH.FORGOT_PASSWORD, { correo });
  return response.data;
};