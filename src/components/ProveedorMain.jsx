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

    // Filtros y paginación
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

    // Modal de confirmación para eliminar
    const [modalConfirmacion, setModalConfirmacion] = useState({
        show: false,
        id: null,
        nombre: ""
    });

    // Cargar proveedores al montar el componente y cuando cambien los filtros
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
            id: proveedor.id,
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
                message: "Proveedor eliminado correctamente"
            });
            setModalConfirmacion({ show: false, id: null, nombre: "" });
            await cargarProveedores();
        } catch (error) {
            console.error("Error al eliminar proveedor:", error);
            const mensaje = error.response?.data?.message || "Error al eliminar el proveedor";
            setAlert({
                show: true,
                type: "error",
                message: mensaje
            });
        } finally {
            setCargando(false);
        }
    };

    const cancelarEliminar = () => {
        setModalConfirmacion({ show: false, id: null, nombre: "" });
    };

    const handleGuardar = async (proveedor) => {
        setCargando(true);
        try {
            if (proveedorSeleccionado) {
                // Actualizar - enviar id dentro del objeto
                await actualizarProveedor({
                    id: proveedorSeleccionado.id,
                    ...proveedor
                });
                setAlert({
                    show: true,
                    type: "success",
                    message: "Proveedor actualizado correctamente"
                });
            } else {
                // Crear
                await crearProveedor(proveedor);
                setAlert({
                    show: true,
                    type: "success",
                    message: "Proveedor creado correctamente"
                });
            }
            setModoEdicion(false);
            await cargarProveedores();
        } catch (error) {
            console.error("Error al guardar proveedor:", error);
            setAlert({
                show: true,
                type: "error",
                message: error.response?.data?.message || "Error al guardar el proveedor"
            });
        } finally {
            setCargando(false);
        }
    };

    const handleCancelar = () => {
        setModoEdicion(false);
        setProveedorSeleccionado(null);
    };

    const cambiarPagina = (nuevaPagina) => {
        if (nuevaPagina >= 1 && nuevaPagina <= paginacion.totalPaginas) {
            setFiltros({ ...filtros, pagina: nuevaPagina });
        }
    };

    // Renderizar vista de edición/creación
    if (modoEdicion) {
        return (
            <ProveedorEdit
                proveedor={proveedorSeleccionado}
                onSubmit={handleGuardar}
                onCancel={handleCancelar}
            />
        );
    }

    // Renderizar vista principal
    return (
        <div className="p-6">
            {cargando && <Loader />}
            {alert.show && (
                <Alert
                    type={alert.type}
                    message={alert.message}
                    onClose={() => setAlert({ show: false, type: "", message: "" })}
                />
            )}

            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Gestión de Proveedores</h1>
                <p className="text-gray-600 mt-2">
                    Administra los proveedores del sistema
                </p>
            </div>

            {/* Barra de búsqueda y botón nuevo */}
            <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                <div className="flex flex-col md:flex-row gap-4 items-end">
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Buscar proveedor
                        </label>
                        <input
                            type="text"
                            name="terminoBusqueda"
                            value={filtros.terminoBusqueda}
                            onChange={handleInputChange}
                            placeholder="Buscar por nombre, contacto, NIT..."
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onKeyPress={(e) => {
                                if (e.key === "Enter") buscarProveedores();
                            }}
                        />
                    </div>

                    <button
                        onClick={buscarProveedores}
                        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                        🔍 Buscar
                    </button>

                    <button
                        onClick={handleCrear}
                        className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                    >
                        ➕ Nuevo Proveedor
                    </button>
                </div>
            </div>

            {/* Tabla de proveedores */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Nombre
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Contacto
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    NIT
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Teléfono
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Productos
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Estado
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {proveedores.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                                        No se encontraron proveedores
                                    </td>
                                </tr>
                            ) : (
                                proveedores.map((proveedor) => (
                                    <tr key={proveedor.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                {proveedor.nombre}
                                            </div>
                                            {proveedor.email && (
                                                <div className="text-sm text-gray-500">
                                                    {proveedor.email}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {proveedor.contacto || "-"}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {proveedor.nit || "-"}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {proveedor.telefono || "-"}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                                                {proveedor.cantidadProductos || 0}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span
                                                className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${proveedor.activo
                                                        ? "bg-green-100 text-green-800"
                                                        : "bg-red-100 text-red-800"
                                                    }`}
                                            >
                                                {proveedor.activo ? "Activo" : "Inactivo"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button
                                                onClick={() => handleEditar(proveedor.id)}
                                                className="text-blue-600 hover:text-blue-900 mr-4"
                                            >
                                                ✏️ Editar
                                            </button>
                                            <button
                                                onClick={() => handleEliminar(proveedor)}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                🗑️ Eliminar
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Paginación */}
                {paginacion.totalPaginas > 1 && (
                    <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                        <div className="flex-1 flex justify-between sm:hidden">
                            <button
                                onClick={() => cambiarPagina(paginacion.paginaActual - 1)}
                                disabled={paginacion.paginaActual === 1}
                                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                            >
                                Anterior
                            </button>
                            <button
                                onClick={() => cambiarPagina(paginacion.paginaActual + 1)}
                                disabled={paginacion.paginaActual === paginacion.totalPaginas}
                                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                            >
                                Siguiente
                            </button>
                        </div>
                        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm text-gray-700">
                                    Mostrando{" "}
                                    <span className="font-medium">
                                        {(paginacion.paginaActual - 1) * filtros.elementosPorPagina + 1}
                                    </span>{" "}
                                    a{" "}
                                    <span className="font-medium">
                                        {Math.min(
                                            paginacion.paginaActual * filtros.elementosPorPagina,
                                            paginacion.totalRegistros
                                        )}
                                    </span>{" "}
                                    de{" "}
                                    <span className="font-medium">{paginacion.totalRegistros}</span>{" "}
                                    proveedores
                                </p>
                            </div>
                            <div>
                                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                                    <button
                                        onClick={() => cambiarPagina(paginacion.paginaActual - 1)}
                                        disabled={paginacion.paginaActual === 1}
                                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                                    >
                                        ‹ Anterior
                                    </button>

                                    {[...Array(paginacion.totalPaginas)].map((_, index) => {
                                        const numeroPagina = index + 1;
                                        const mostrar =
                                            numeroPagina === 1 ||
                                            numeroPagina === paginacion.totalPaginas ||
                                            (numeroPagina >= paginacion.paginaActual - 1 &&
                                                numeroPagina <= paginacion.paginaActual + 1);

                                        if (!mostrar) {
                                            if (
                                                numeroPagina === paginacion.paginaActual - 2 ||
                                                numeroPagina === paginacion.paginaActual + 2
                                            ) {
                                                return (
                                                    <span
                                                        key={numeroPagina}
                                                        className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
                                                    >
                                                        ...
                                                    </span>
                                                );
                                            }
                                            return null;
                                        }

                                        return (
                                            <button
                                                key={numeroPagina}
                                                onClick={() => cambiarPagina(numeroPagina)}
                                                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${numeroPagina === paginacion.paginaActual
                                                        ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                                                        : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                                                    }`}
                                            >
                                                {numeroPagina}
                                            </button>
                                        );
                                    })}

                                    <button
                                        onClick={() => cambiarPagina(paginacion.paginaActual + 1)}
                                        disabled={paginacion.paginaActual === paginacion.totalPaginas}
                                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                                    >
                                        Siguiente ›
                                    </button>
                                </nav>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Modal de confirmación para eliminar */}
            {modalConfirmacion.show && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                        <div className="mt-3 text-center">
                            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                                <span className="text-2xl">⚠️</span>
                            </div>
                            <h3 className="text-lg leading-6 font-medium text-gray-900 mt-4">
                                Eliminar Proveedor
                            </h3>
                            <div className="mt-2 px-7 py-3">
                                <p className="text-sm text-gray-500">
                                    ¿Está seguro que desea eliminar el proveedor{" "}
                                    <span className="font-semibold">{modalConfirmacion.nombre}</span>?
                                    Esta acción no se puede deshacer.
                                </p>
                            </div>
                            <div className="flex gap-4 px-4 py-3">
                                <button
                                    onClick={cancelarEliminar}
                                    className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 text-base font-medium rounded-md shadow-sm hover:bg-gray-400 focus:outline-none"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={confirmarEliminar}
                                    className="flex-1 px-4 py-2 bg-red-600 text-white text-base font-medium rounded-md shadow-sm hover:bg-red-700 focus:outline-none"
                                >
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProveedorMain;