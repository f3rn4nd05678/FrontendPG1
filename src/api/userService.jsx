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

export const listarCategorias = async () => {
  const response = await api.get(ENDPOINTS.PRODUCTO.CATEGORIA);
  return response.data;
};


export const listarCategoriasActivas = async () => {
  const response = await api.get(ENDPOINTS.CATEGORIA.ACTIVAS);
  return response.data;
};

export const obtenerCategoria = async (data) => {
  const response = await api.post(ENDPOINTS.CATEGORIA.GET, data);
  return response.data;
};

export const crearCategoria = async (data) => {
  const response = await api.post(ENDPOINTS.CATEGORIA.CREATE, data);
  return response.data;
};

export const actualizarCategoria = async (data) => {
  const { id, ...datos } = data;
  const response = await api.post(ENDPOINTS.CATEGORIA.UPDATE, {
    id,
    datos
  });
  return response.data;
};

export const eliminarCategoria = async (data) => {
  const response = await api.post(ENDPOINTS.CATEGORIA.DELETE, data);
  return response.data;
};

export const validarCodigoCategoria = async (codigoPrefijo, excluirId = null) => {
  const response = await api.post(ENDPOINTS.CATEGORIA.VALIDATE_CODE, {
    codigoPrefijo,
    excluirId
  });
  return response.data;
};

export const listarBodegas = async (filtros = {}) => {
  const response = await api.post(ENDPOINTS.BODEGA.LIST, filtros);
  return response.data;
};

export const obtenerBodega = async (data) => {
  const response = await api.post(ENDPOINTS.BODEGA.GET, data);
  return response.data;
};

export const crearBodega = async (data) => {
  const response = await api.post(ENDPOINTS.BODEGA.CREATE, data);
  return response.data;
};

export const actualizarBodega = async (data) => {
  const { id, ...datos } = data;
  const response = await api.post(ENDPOINTS.BODEGA.UPDATE, {
    id,
    datos
  });
  return response.data;
};

export const eliminarBodega = async (data) => {
  const response = await api.post(ENDPOINTS.BODEGA.DELETE, data);
  return response.data;
};

export const validarCodigoBodega = async (data) => {
  const response = await api.post(ENDPOINTS.BODEGA.VALIDATE_CODE, data);
  return response.data;
};

// ==================== STOCK ====================
export const listarStock = async (filtros = {}) => {
  try {
    const response = await api.post(API_ENDPOINTS.STOCK.LIST, filtros);
    return response.data;
  } catch (error) {
    console.error("Error al listar stock:", error);
    throw error;
  }
};

export const obtenerStock = async (id) => {
  try {
    const response = await api.post(API_ENDPOINTS.STOCK.GET, { id });
    return response.data;
  } catch (error) {
    console.error("Error al obtener stock:", error);
    throw error;
  }
};

export const obtenerStockProductoBodega = async (idProducto, idBodega) => {
  try {
    const response = await api.post(API_ENDPOINTS.STOCK.PRODUCTO_BODEGA, {
      idProducto,
      idBodega,
    });
    return response.data;
  } catch (error) {
    console.error("Error al obtener stock producto-bodega:", error);
    throw error;
  }
};

export const obtenerAlertasStock = async () => {
  try {
    const response = await api.get(API_ENDPOINTS.STOCK.ALERTAS);
    return response.data;
  } catch (error) {
    console.error("Error al obtener alertas de stock:", error);
    throw error;
  }
};

export const obtenerStockPorBodega = async (idBodega) => {
  try {
    const response = await api.get(`${API_ENDPOINTS.STOCK.BY_BODEGA}/${idBodega}`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener stock por bodega:", error);
    throw error;
  }
};

export const obtenerStockPorProducto = async (idProducto) => {
  try {
    const response = await api.get(`${API_ENDPOINTS.STOCK.BY_PRODUCTO}/${idProducto}`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener stock por producto:", error);
    throw error;
  }
};

// ==================== MOVIMIENTOS DE INVENTARIO ====================
export const listarMovimientos = async (filtros = {}) => {
  try {
    const response = await api.post(API_ENDPOINTS.MOVIMIENTO_INVENTARIO.LIST, filtros);
    return response.data;
  } catch (error) {
    console.error("Error al listar movimientos:", error);
    throw error;
  }
};

export const obtenerMovimiento = async (id) => {
  try {
    const response = await api.post(API_ENDPOINTS.MOVIMIENTO_INVENTARIO.GET, { id });
    return response.data;
  } catch (error) {
    console.error("Error al obtener movimiento:", error);
    throw error;
  }
};

export const registrarEntrada = async (entrada) => {
  try {
    const response = await api.post(API_ENDPOINTS.MOVIMIENTO_INVENTARIO.ENTRADA, entrada);
    return response.data;
  } catch (error) {
    console.error("Error al registrar entrada:", error);
    throw error;
  }
};

export const registrarSalida = async (salida) => {
  try {
    const response = await api.post(API_ENDPOINTS.MOVIMIENTO_INVENTARIO.SALIDA, salida);
    return response.data;
  } catch (error) {
    console.error("Error al registrar salida:", error);
    throw error;
  }
};

export const obtenerMovimientosPorProducto = async (idProducto) => {
  try {
    const response = await api.get(`${API_ENDPOINTS.MOVIMIENTO_INVENTARIO.BY_PRODUCTO}/${idProducto}`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener movimientos por producto:", error);
    throw error;
  }
};

export const obtenerMovimientosPorBodega = async (idBodega) => {
  try {
    const response = await api.get(`${API_ENDPOINTS.MOVIMIENTO_INVENTARIO.BY_BODEGA}/${idBodega}`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener movimientos por bodega:", error);
    throw error;
  }
};