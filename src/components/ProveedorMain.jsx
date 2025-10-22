import React, { useState, useEffect } from "react";
import { 
  listarProveedores, 
  crearProveedor, 
  actualizarProveedor, 
  eliminarProveedor, 
  obtenerProveedor 
} from "../api/userService";
import ProveedorEdit from "./ProveedorEdit";
import Loader from "./Loader";
import Alert from "./Alert";

const ProveedorMain = () => {
    
  const [proveedores, setProveedores] = useState([]);
  const [proveedorSeleccionado, setProveedorSeleccionado] = useState(null);
  const [modoEdicion, setModoEdicion] = useState(false); 
  const [cargando, setCargando] = useState(false);
  const [alert, setAlert] = useState({ show: false, type: "", message: "" });
  
  const [filtros, setFiltros] = useState({
    terminoBusqueda: "",
    pagina: 1,
    elementosPorPagina: 10
  });
  
  const [paginacion, setPaginacion] = useState({
    totalRegistros: 0,
    totalPaginas: 0,
    paginaActual: 1
  });

  const [modalConfirmacion, setModalConfirmacion] = useState({
    show: false,
    id: null,
    nombre: ""
  });

  useEffect(() => {
    cargarProveedores();
  }, [filtros.pagina, filtros.elementosPorPagina]);

  const cargarProveedores = async () => {
    setCargando(true);
    try {
      const response = await listarProveedores({
        terminoBusqueda: filtros.terminoBusqueda,
        pagina: filtros.pagina,
        elementosPorPagina: filtros.elementosPorPagina
      });
      
      setProveedores(response.detail.proveedores || []);
      setPaginacion({
        totalRegistros: response.detail.total || 0,
        totalPaginas: response.detail.totalPaginas || 0,
        paginaActual: response.detail.pagina || 1
      });
    } catch (error) {
      console.error("Error al cargar proveedores:", error);
      setAlert({
        show: true,
        type: "error",
        message: "Error al cargar la lista de proveedores"
      });
    } finally {
      setCargando(false);
    }
  };

  const buscarProveedores = async () => {
    setFiltros({ ...filtros, pagina: 1 });
    await cargarProveedores();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFiltros((prev) => ({ ...prev, [name]: value }));
  };

  const handleCrear = () => {
    setProveedorSeleccionado(null);
    setModoEdicion(true);
  };

  const handleEditar = async (id) => {
    setCargando(true);
    try {
      const response = await obtenerProveedor({ id });
      setProveedorSeleccionado(response.detail);
      setModoEdicion(true);
    } catch (error) {
      console.error("Error al obtener proveedor:", error);
      setAlert({
        show: true,
        type: "error",
        message: "Error al obtener los datos del proveedor"
      });
    } finally {
      setCargando(false);
    }
  };

  const handleEliminar = (proveedor) => {
    setModalConfirmacion({
      show: true,
      id: proveedor.idProveedor,
      nombre: proveedor.nombre
    });
  };

  const confirmarEliminar = async () => {
    setCargando(true);
    try {
      await eliminarProveedor({ id: modalConfirmacion.id });
      setAlert({
        show: true,
        type: "success",
        message: "Proveedor eliminado exitosamente"
      });
      await cargarProveedores();
      setModalConfirmacion({ show: false, id: null, nombre: "" });
    } catch (error) {
      console.error("Error al eliminar proveedor:", error);
      setAlert({
        show: true,
        type: "error",
        message: error.response?.data?.message || "Error al eliminar proveedor"
      });
    } finally {
      setCargando(false);
    }
  };

  const handleGuardar = async (data) => {
    setCargando(true);
    try {
      if (proveedorSeleccionado) {
        await actualizarProveedor({ ...data, id: proveedorSeleccionado.idProveedor });
        setAlert({
          show: true,
          type: "success",
          message: "Proveedor actualizado exitosamente"
        });
      } else {
        await crearProveedor(data);
        setAlert({
          show: true,
          type: "success",
          message: "Proveedor creado exitosamente"
        });
      }
      await cargarProveedores();
      setModoEdicion(false);
      setProveedorSeleccionado(null);
    } catch (error) {
      console.error("Error al guardar proveedor:", error);
      setAlert({
        show: true,
        type: "error",
        message: error.response?.data?.message || "Error al guardar proveedor"
      });
    } finally {
      setCargando(false);
    }
  };

  const cambiarPagina = (nuevaPagina) => {
    if (nuevaPagina >= 1 && nuevaPagina <= paginacion.totalPaginas) {
      setFiltros({ ...filtros, pagina: nuevaPagina });
    }
  };

  if (modoEdicion) {
    return (
      <ProveedorEdit
        proveedor={proveedorSeleccionado}
        onSubmit={handleGuardar}
        onCancel={() => {
          setModoEdicion(false);
          setProveedorSeleccionado(null);
        }}
      />
    );
  }

  return (
    <div className="w-full">
      {cargando && <Loader />}
      {alert.show && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert({ show: false, type: "", message: "" })}
        />
      )}

      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-800">
            Gestión de Proveedores
          </h1>
          <button
            onClick={handleCrear}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            + Nuevo Proveedor
          </button>
        </div>

        {/* Filtros */}
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Buscar
            </label>
            <input
              type="text"
              name="terminoBusqueda"
              value={filtros.terminoBusqueda}
              onChange={handleInputChange}
              placeholder="Buscar por nombre o contacto..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={buscarProveedores}
            className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
          >
            Buscar
          </button>
        </div>
      </div>

      {/* Tabla de Proveedores */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nombre
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contacto
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {proveedores.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                    No se encontraron proveedores
                  </td>
                </tr>
              ) : (
                proveedores.map((proveedor) => (
                  <tr key={proveedor.idProveedor} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {proveedor.idProveedor}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {proveedor.nombre}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {proveedor.contacto || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleEditar(proveedor.idProveedor)}
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleEliminar(proveedor)}
                          className="text-red-600 hover:text-red-800 font-medium"
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        {paginacion.totalPaginas > 1 && (
          <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-200">
            <div className="text-sm text-gray-700">
              Mostrando página {paginacion.paginaActual} de {paginacion.totalPaginas}
              {" - "}Total: {paginacion.totalRegistros} registros
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => cambiarPagina(paginacion.paginaActual - 1)}
                disabled={paginacion.paginaActual === 1}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Anterior
              </button>
              <button
                onClick={() => cambiarPagina(paginacion.paginaActual + 1)}
                disabled={paginacion.paginaActual === paginacion.totalPaginas}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Siguiente
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal de Confirmación */}
      {modalConfirmacion.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Confirmar Eliminación
            </h3>
            <p className="text-gray-600 mb-6">
              ¿Estás seguro de que deseas eliminar el proveedor <strong>{modalConfirmacion.nombre}</strong>? Esta acción no se puede deshacer.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setModalConfirmacion({ show: false, id: null, nombre: "" })}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={confirmarEliminar}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProveedorMain;