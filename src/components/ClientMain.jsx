import React, { useState, useEffect } from "react";
import { 
  listarClientes, 
  crearCliente, 
  actualizarCliente, 
  eliminarCliente, 
  obtenerCliente 
} from "../api/userService";
import ClientEdit from "./ClientEdit";
import Loader from "./Loader";
import Alert from "./Alert";

const ClientMain = () => {
    
  const [clientes, setClientes] = useState([]);
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
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
    cargarClientes();
  }, [filtros.pagina, filtros.elementosPorPagina]);

  const cargarClientes = async () => {
    setCargando(true);
    try {
      const response = await listarClientes({
        terminoBusqueda: filtros.terminoBusqueda,
        pagina: filtros.pagina,
        elementosPorPagina: filtros.elementosPorPagina
      });
      
      setClientes(response.detail.clientes || []);
      setPaginacion({
        totalRegistros: response.detail.total || 0,
        totalPaginas: response.detail.totalPaginas || 0,
        paginaActual: response.detail.pagina || 1
      });
    } catch (error) {
      console.error("Error al cargar clientes:", error);
      setAlert({
        show: true,
        type: "error",
        message: "Error al cargar la lista de clientes"
      });
    } finally {
      setCargando(false);
    }
  };

  const buscarClientes = async () => {
    setFiltros({ ...filtros, pagina: 1 });
    await cargarClientes();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFiltros((prev) => ({ ...prev, [name]: value }));
  };

  const handleCrear = () => {
    setClienteSeleccionado(null);
    setModoEdicion(true);
  };

  const handleEditar = async (id) => {
    setCargando(true);
    try {
      const response = await obtenerCliente({ id });
      setClienteSeleccionado(response.detail);
      setModoEdicion(true);
    } catch (error) {
      console.error("Error al obtener cliente:", error);
      setAlert({
        show: true,
        type: "error",
        message: "Error al obtener los datos del cliente"
      });
    } finally {
      setCargando(false);
    }
  };

  const handleEliminar = (cliente) => {
    setModalConfirmacion({
      show: true,
      id: cliente.id,
      nombre: cliente.nombre
    });
  };

  const confirmarEliminar = async () => {
    setCargando(true);
    try {
      await eliminarCliente({ id: modalConfirmacion.id });
      setAlert({
        show: true,
        type: "success",
        message: "Cliente eliminado correctamente"
      });
      setModalConfirmacion({ show: false, id: null, nombre: "" });
      cargarClientes();
    } catch (error) {
      console.error("Error al eliminar cliente:", error);
      setAlert({
        show: true,
        type: "error",
        message: "Error al eliminar el cliente"
      });
    } finally {
      setCargando(false);
    }
  };

  const handleCancelar = () => {
    setModoEdicion(false);
    setClienteSeleccionado(null);
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (clienteSeleccionado) {
        await actualizarCliente({
          id: clienteSeleccionado.id,
          cliente: formData
        });
      } else {
        await crearCliente(formData);
      }
      
      setTimeout(() => {
        setModoEdicion(false);
        setClienteSeleccionado(null);
        cargarClientes();
      }, 1500);
    } catch (error) {
      throw error;
    }
  };

  const cambiarPagina = (nuevaPagina) => {
    setFiltros({ ...filtros, pagina: nuevaPagina });
  };

  console.log("Estado actual - modoEdicion:", modoEdicion, "clienteSeleccionado:", clienteSeleccionado);

  return (
    <div className="p-4">
      {alert.show && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert({ ...alert, show: false })}
        />
      )}

      
      {modoEdicion ? (
        <ClientEdit
          cliente={clienteSeleccionado}
          onSubmit={handleFormSubmit}
          onCancel={handleCancelar}
        />
      ) : (
      
        <div className="bg-white rounded-lg shadow-md p-5">
      
          <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">
              Gestión de Clientes
            </h1>
            <button
              onClick={handleCrear}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Nuevo Cliente
            </button>
          </div>
          
    
          <div className="mb-6">
            <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-3">
              <div className="flex-1">
                <div className="relative">
                  <input
                    type="text"
                    name="terminoBusqueda"
                    value={filtros.terminoBusqueda}
                    onChange={handleInputChange}
                    placeholder="Buscar por código, nombre o NIT..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onKeyDown={(e) => e.key === "Enter" && buscarClientes()}
                  />
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
              </div>
              <div>
                <button
                  onClick={buscarClientes}
                  className="w-full md:w-auto bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-md flex items-center justify-center transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                  Buscar
                </button>
              </div>
            </div>
          </div>
          

          {!cargando && (
            <div className="mb-4">
              <p className="text-sm text-gray-600">
                {paginacion.totalRegistros > 0 
                  ? `Se encontraron ${paginacion.totalRegistros} cliente${paginacion.totalRegistros !== 1 ? 's' : ''}`
                  : 'No se encontraron clientes'
                }
              </p>
            </div>
          )}
          
   
          {cargando ? (
            <div className="flex justify-center items-center py-16">
              <div className="text-center">
                <Loader size="large" />
                <p className="mt-4 text-gray-600">Cargando clientes...</p>
              </div>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Código
                      </th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nombre
                      </th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        NIT
                      </th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Correo
                      </th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Teléfono
                      </th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Estado
                      </th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {clientes.length > 0 ? (
                      clientes.map((cliente) => (
                        <tr key={cliente.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                            {cliente.codigo}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                            {cliente.nombre}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                            {cliente.nit}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                            {cliente.correoElectronico || "-"}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                            {cliente.telefono1 || cliente.telefonoMovil || "-"}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">
                            <span
                              className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                cliente.activo
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {cliente.activo ? "Activo" : "Inactivo"}
                            </span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleEditar(cliente.id)}
                                className="text-blue-600 hover:text-blue-900 transition-colors"
                                title="Editar cliente"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                              </button>
                              <button
                                onClick={() => handleEliminar(cliente)}
                                className="text-red-600 hover:text-red-900 transition-colors"
                                title="Eliminar cliente"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="px-4 py-12 text-center">
                          <div className="text-gray-500">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            <p className="text-lg font-medium text-gray-900 mb-2">No hay clientes registrados</p>
                            <p className="text-gray-600 mb-4">Comienza creando tu primer cliente</p>
                            <button
                              onClick={handleCrear}
                              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
                            >
                              Crear Cliente
                            </button>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              
        
              {paginacion.totalPaginas > 1 && (
                <div className="flex flex-col sm:flex-row justify-between items-center mt-6 space-y-3 sm:space-y-0">
                  <div className="text-sm text-gray-700">
                    Mostrando <span className="font-medium">{(filtros.pagina - 1) * filtros.elementosPorPagina + 1}</span> a{" "}
                    <span className="font-medium">
                      {Math.min(filtros.pagina * filtros.elementosPorPagina, paginacion.totalRegistros)}
                    </span>{" "}
                    de <span className="font-medium">{paginacion.totalRegistros}</span> registros
                  </div>
                  <nav className="flex space-x-1">
                    <button
                      onClick={() => cambiarPagina(filtros.pagina - 1)}
                      disabled={filtros.pagina === 1}
                      className={`px-3 py-2 rounded-md text-sm ${
                        filtros.pagina === 1
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
                      }`}
                    >
                      Anterior
                    </button>
                    
                    {Array.from({ length: Math.min(5, paginacion.totalPaginas) }).map((_, index) => {
                      let numeroPagina;
                      if (paginacion.totalPaginas <= 5) {
                        numeroPagina = index + 1;
                      } else if (filtros.pagina <= 3) {
                        numeroPagina = index + 1;
                      } else if (filtros.pagina >= paginacion.totalPaginas - 2) {
                        numeroPagina = paginacion.totalPaginas - 4 + index;
                      } else {
                        numeroPagina = filtros.pagina - 2 + index;
                      }
                      
                      return (
                        <button
                          key={numeroPagina}
                          onClick={() => cambiarPagina(numeroPagina)}
                          className={`px-3 py-2 rounded-md text-sm border ${
                            filtros.pagina === numeroPagina
                              ? "bg-blue-600 text-white border-blue-600"
                              : "bg-white text-gray-700 hover:bg-gray-50 border-gray-300"
                          }`}
                        >
                          {numeroPagina}
                        </button>
                      );
                    })}
                    
                    <button
                      onClick={() => cambiarPagina(filtros.pagina + 1)}
                      disabled={filtros.pagina === paginacion.totalPaginas}
                      className={`px-3 py-2 rounded-md text-sm ${
                        filtros.pagina === paginacion.totalPaginas
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
                      }`}
                    >
                      Siguiente
                    </button>
                  </nav>
                </div>
              )}
            </>
          )}
        </div>
      )}
      

      {modalConfirmacion.show && (
        <div className="fixed z-50 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <svg className="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Eliminar Cliente
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        ¿Está seguro que desea eliminar al cliente <span className="font-semibold">{modalConfirmacion.nombre}</span>? Esta acción no se puede deshacer.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={confirmarEliminar}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm transition-colors"
                  disabled={cargando}
                >
                  {cargando ? (
                    <div className="flex items-center">
                      <Loader size="small" color="white" />
                      <span className="ml-2">Eliminando...</span>
                    </div>
                  ) : (
                    "Eliminar"
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setModalConfirmacion({ show: false, id: null, nombre: "" })}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientMain;