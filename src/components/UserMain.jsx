import React, { useState, useEffect } from "react";
import {
    listarUsuarios,
    crearUsuario,
    actualizarUsuario,
    eliminarUsuario,
    obtenerUsuario,
    listarRoles
} from "../api/userService";
import UserEdit from "./UserEdit";
import Loader from "./Loader";
import Alert from "./Alert";

const UserMain = () => {

    const [usuarios, setUsuarios] = useState([]);
    const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
    const [modoEdicion, setModoEdicion] = useState(false);
    const [cargando, setCargando] = useState(false);
    const [alert, setAlert] = useState({ show: false, type: "", message: "" });
    const [roles, setRoles] = useState([]);

    // Filtros y paginación
    const [filtros, setFiltros] = useState({
        terminoBusqueda: "",
        rolId: null,
        activo: null,
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

    // Cargar usuarios y roles al montar el componente
    useEffect(() => {
        cargarRoles();
        cargarUsuarios();
    }, [filtros.pagina, filtros.elementosPorPagina]);

    const cargarRoles = async () => {
        try {
            const response = await listarRoles();
            setRoles(response.detail || []);
        } catch (error) {
            console.error("Error al cargar roles:", error);
        }
    };

    const cargarUsuarios = async () => {
        setCargando(true);
        try {
            const response = await listarUsuarios({
                terminoBusqueda: filtros.terminoBusqueda,
                rolId: filtros.rolId,
                activo: filtros.activo,
                pagina: filtros.pagina,
                elementosPorPagina: filtros.elementosPorPagina
            });

            setUsuarios(response.detail.usuarios || []);
            setPaginacion({
                totalRegistros: response.detail.total || 0,
                totalPaginas: response.detail.totalPaginas || 0,
                paginaActual: response.detail.pagina || 1
            });
        } catch (error) {
            console.error("Error al cargar usuarios:", error);
            setAlert({
                show: true,
                type: "error",
                message: "Error al cargar la lista de usuarios"
            });
        } finally {
            setCargando(false);
        }
    };

    const buscarUsuarios = async () => {
        setFiltros({ ...filtros, pagina: 1 });
        await cargarUsuarios();
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFiltros((prev) => ({
            ...prev,
            [name]: value === "" ? null : (name === "rolId" ? parseInt(value) : value)
        }));
    };

    const handleCrear = () => {
        setUsuarioSeleccionado(null);
        setModoEdicion(true);
    };

    const handleEditar = async (id) => {
        setCargando(true);
        try {
            const response = await obtenerUsuario({ id });
            setUsuarioSeleccionado(response.detail);
            setModoEdicion(true);
        } catch (error) {
            console.error("Error al obtener usuario:", error);
            setAlert({
                show: true,
                type: "error",
                message: "Error al obtener los datos del usuario"
            });
        } finally {
            setCargando(false);
        }
    };

    const handleEliminar = (usuario) => {
        setModalConfirmacion({
            show: true,
            id: usuario.id,
            nombre: usuario.nombre
        });
    };

    const confirmarEliminar = async () => {
        setCargando(true);
        try {
            await eliminarUsuario({ id: modalConfirmacion.id });
            setAlert({
                show: true,
                type: "success",
                message: "Usuario eliminado correctamente"
            });
            setModalConfirmacion({ show: false, id: null, nombre: "" });
            await cargarUsuarios();
        } catch (error) {
            console.error("Error al eliminar usuario:", error);
            setAlert({
                show: true,
                type: "error",
                message: error.response?.data?.message || "Error al eliminar el usuario"
            });
        } finally {
            setCargando(false);
        }
    };

    const handleSubmit = async (datos) => {
        setCargando(true);
        try {
            if (usuarioSeleccionado) {
                await actualizarUsuario({ id: usuarioSeleccionado.id, ...datos });
                setAlert({
                    show: true,
                    type: "success",
                    message: "Usuario actualizado correctamente"
                });
            } else {
                await crearUsuario(datos);
                setAlert({
                    show: true,
                    type: "success",
                    message: "Usuario creado correctamente"
                });
            }
            setModoEdicion(false);
            setUsuarioSeleccionado(null);
            await cargarUsuarios();
        } catch (error) {
            console.error("Error al guardar usuario:", error);
            setAlert({
                show: true,
                type: "error",
                message: error.response?.data?.message || "Error al guardar el usuario"
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

    const limpiarFiltros = () => {
        setFiltros({
            terminoBusqueda: "",
            rolId: null,
            activo: null,
            pagina: 1,
            elementosPorPagina: 10
        });
    };

    const getRolBadgeColor = (rolNombre) => {
        const colors = {
            'Administrador': 'bg-red-100 text-red-800',
            'Punto de Venta': 'bg-blue-100 text-blue-800',
            'Bodega': 'bg-green-100 text-green-800',
            'Vendedor': 'bg-purple-100 text-purple-800'
        };
        return colors[rolNombre] || 'bg-gray-100 text-gray-800';
    };

    if (modoEdicion) {
        return (
            <UserEdit
                onSubmit={handleSubmit}
                usuario={usuarioSeleccionado}
                roles={roles}
                onCancel={() => {
                    setModoEdicion(false);
                    setUsuarioSeleccionado(null);
                }}
            />
        );
    }

    return (
        <div className="p-6">
            {cargando && <Loader />}

            {alert.show && (
                <Alert
                    type={alert.type}
                    message={alert.message}
                    onClose={() => setAlert({ ...alert, show: false })}
                />
            )}

            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Gestión de Usuarios</h1>
                <p className="text-gray-600 mt-1">
                    Administra los usuarios del sistema y sus permisos
                </p>
            </div>

            {/* Filtros */}
            <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Buscar
                        </label>
                        <input
                            type="text"
                            name="terminoBusqueda"
                            value={filtros.terminoBusqueda}
                            onChange={handleInputChange}
                            placeholder="Nombre o correo..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Rol
                        </label>
                        <select
                            name="rolId"
                            value={filtros.rolId || ""}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Todos los roles</option>
                            {roles.map((rol) => (
                                <option key={rol.id} value={rol.id}>
                                    {rol.nombre}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Estado
                        </label>
                        <select
                            name="activo"
                            value={filtros.activo === null ? "" : filtros.activo}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Todos</option>
                            <option value="true">Activos</option>
                            <option value="false">Inactivos</option>
                        </select>
                    </div>

                    <div className="flex items-end gap-2">
                        <button
                            onClick={buscarUsuarios}
                            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                        >
                            Buscar
                        </button>
                        <button
                            onClick={limpiarFiltros}
                            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                        >
                            Limpiar
                        </button>
                    </div>
                </div>
            </div>

            {/* Botón Nuevo Usuario */}
            <div className="mb-4">
                <button
                    onClick={handleCrear}
                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors flex items-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Nuevo Usuario
                </button>
            </div>

            {/* Tabla de Usuarios */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Usuario
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Correo
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Rol
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Estado
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Último Login
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {usuarios.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                                        No se encontraron usuarios
                                    </td>
                                </tr>
                            ) : (
                                usuarios.map((usuario) => (
                                    <tr key={usuario.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10">
                                                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                                        <span className="text-blue-600 font-medium text-sm">
                                                            {usuario.nombre.charAt(0).toUpperCase()}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {usuario.nombre}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{usuario.correo}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getRolBadgeColor(usuario.rolNombre)}`}>
                                                {usuario.rolNombre}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${usuario.activo
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                                }`}>
                                                {usuario.activo ? 'Activo' : 'Inactivo'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {usuario.ultimoLogin
                                                ? new Date(usuario.ultimoLogin).toLocaleString('es-GT')
                                                : 'Nunca'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button
                                                onClick={() => handleEditar(usuario.id)}
                                                className="text-blue-600 hover:text-blue-900 mr-3"
                                                title="Editar"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() => handleEliminar(usuario)}
                                                className="text-red-600 hover:text-red-900"
                                                title="Eliminar"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
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
                                    resultados
                                </p>
                            </div>
                            <div>
                                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                                    <button
                                        onClick={() => cambiarPagina(paginacion.paginaActual - 1)}
                                        disabled={paginacion.paginaActual === 1}
                                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                                    >
                                        <span className="sr-only">Anterior</span>
                                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                    {[...Array(paginacion.totalPaginas)].map((_, index) => {
                                        const pageNumber = index + 1;
                                        if (
                                            pageNumber === 1 ||
                                            pageNumber === paginacion.totalPaginas ||
                                            (pageNumber >= paginacion.paginaActual - 1 &&
                                                pageNumber <= paginacion.paginaActual + 1)
                                        ) {
                                            return (
                                                <button
                                                    key={pageNumber}
                                                    onClick={() => cambiarPagina(pageNumber)}
                                                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${pageNumber === paginacion.paginaActual
                                                            ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                                                            : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                                                        }`}
                                                >
                                                    {pageNumber}
                                                </button>
                                            );
                                        } else if (
                                            pageNumber === paginacion.paginaActual - 2 ||
                                            pageNumber === paginacion.paginaActual + 2
                                        ) {
                                            return (
                                                <span
                                                    key={pageNumber}
                                                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
                                                >
                                                    ...
                                                </span>
                                            );
                                        }
                                        return null;
                                    })}
                                    <button
                                        onClick={() => cambiarPagina(paginacion.paginaActual + 1)}
                                        disabled={paginacion.paginaActual === paginacion.totalPaginas}
                                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                                    >
                                        <span className="sr-only">Siguiente</span>
                                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                        </svg>
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
                                <svg
                                    className="h-6 w-6 text-red-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-lg leading-6 font-medium text-gray-900 mt-4">
                                Eliminar Usuario
                            </h3>
                            <div className="mt-2 px-7 py-3">
                                <p className="text-sm text-gray-500">
                                    ¿Estás seguro que deseas eliminar al usuario{" "}
                                    <span className="font-semibold">{modalConfirmacion.nombre}</span>?
                                    <br />
                                    Esta acción no se puede deshacer.
                                </p>
                            </div>
                            <div className="items-center px-4 py-3 flex gap-3">
                                <button
                                    onClick={() =>
                                        setModalConfirmacion({ show: false, id: null, nombre: "" })
                                    }
                                    className="flex-1 px-4 py-2 bg-gray-300 text-gray-800 text-base font-medium rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={confirmarEliminar}
                                    className="flex-1 px-4 py-2 bg-red-600 text-white text-base font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-300"
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

export default UserMain;