import React, { useState, useEffect } from "react";
import {
    listarRoles,
    crearRol,
    actualizarRol,
    eliminarRol,
    obtenerRol,
    listarPermisos,
    listarPermisosPorRol,
    asignarPermisoARol,
    removerPermisoDeRol
} from "../api/userService";
import Loader from "./Loader";
import Alert from "./Alert";

const RolMain = () => {
    const [roles, setRoles] = useState([]);
    const [permisos, setPermisos] = useState([]);
    const [rolSeleccionado, setRolSeleccionado] = useState(null);
    const [permisosDelRol, setPermisosDelRol] = useState([]);
    const [modoEdicion, setModoEdicion] = useState(false);
    const [modoPermisos, setModoPermisos] = useState(false);
    const [cargando, setCargando] = useState(false);
    const [alert, setAlert] = useState({ show: false, type: "", message: "" });

    // Formulario de rol
    const [formRol, setFormRol] = useState({
        nombre: "",
        descripcion: ""
    });

    // Modal de confirmación
    const [modalConfirmacion, setModalConfirmacion] = useState({
        show: false,
        id: null,
        nombre: ""
    });

    useEffect(() => {
        cargarRoles();
        cargarPermisos();
    }, []);

    const cargarRoles = async () => {
        setCargando(true);
        try {
            const response = await listarRoles();
            setRoles(response.detail || []);
        } catch (error) {
            console.error("Error al cargar roles:", error);
            setAlert({
                show: true,
                type: "error",
                message: "Error al cargar los roles"
            });
        } finally {
            setCargando(false);
        }
    };

    const cargarPermisos = async () => {
        try {
            const response = await listarPermisos();
            setPermisos(response.detail || []);
        } catch (error) {
            console.error("Error al cargar permisos:", error);
        }
    };

    const cargarPermisosDelRol = async (rolId) => {
        try {
            const response = await listarPermisosPorRol({ rolId });
            setPermisosDelRol(response.detail || []);
        } catch (error) {
            console.error("Error al cargar permisos del rol:", error);
        }
    };

    const handleCrear = () => {
        setRolSeleccionado(null);
        setFormRol({ nombre: "", descripcion: "" });
        setModoEdicion(true);
    };

    const handleEditar = async (rol) => {
        setRolSeleccionado(rol);
        setFormRol({
            nombre: rol.nombre,
            descripcion: rol.descripcion || ""
        });
        setModoEdicion(true);
    };

    const handleEliminar = (rol) => {
        // No permitir eliminar roles predefinidos
        const rolesPredefinidos = ['Administrador', 'Punto de Venta', 'Bodega', 'Vendedor'];
        if (rolesPredefinidos.includes(rol.nombre)) {
            setAlert({
                show: true,
                type: "warning",
                message: "No se pueden eliminar los roles predefinidos del sistema"
            });
            return;
        }

        setModalConfirmacion({
            show: true,
            id: rol.id,
            nombre: rol.nombre
        });
    };

    const confirmarEliminar = async () => {
        setCargando(true);
        try {
            await eliminarRol({ id: modalConfirmacion.id });
            setAlert({
                show: true,
                type: "success",
                message: "Rol eliminado correctamente"
            });
            setModalConfirmacion({ show: false, id: null, nombre: "" });
            await cargarRoles();
        } catch (error) {
            console.error("Error al eliminar rol:", error);
            setAlert({
                show: true,
                type: "error",
                message: error.response?.data?.message || "Error al eliminar el rol"
            });
        } finally {
            setCargando(false);
        }
    };

    const handleSubmitRol = async (e) => {
        e.preventDefault();
        setCargando(true);
        try {
            if (rolSeleccionado) {
                await actualizarRol({
                    id: rolSeleccionado.id,
                    nombre: formRol.nombre,
                    descripcion: formRol.descripcion
                });
                setAlert({
                    show: true,
                    type: "success",
                    message: "Rol actualizado correctamente"
                });
            } else {
                await crearRol(formRol);
                setAlert({
                    show: true,
                    type: "success",
                    message: "Rol creado correctamente"
                });
            }
            setModoEdicion(false);
            await cargarRoles();
        } catch (error) {
            console.error("Error al guardar rol:", error);
            setAlert({
                show: true,
                type: "error",
                message: error.response?.data?.message || "Error al guardar el rol"
            });
        } finally {
            setCargando(false);
        }
    };

    const handleGestionarPermisos = async (rol) => {
        setRolSeleccionado(rol);
        await cargarPermisosDelRol(rol.id);
        setModoPermisos(true);
    };

    const handleTogglePermiso = async (permisoId) => {
        const tienePermiso = permisosDelRol.some(p => p.id === permisoId);

        try {
            if (tienePermiso) {
                await removerPermisoDeRol({
                    rolId: rolSeleccionado.id,
                    permisoId
                });
            } else {
                await asignarPermisoARol({
                    rolId: rolSeleccionado.id,
                    permisoId
                });
            }
            await cargarPermisosDelRol(rolSeleccionado.id);
        } catch (error) {
            console.error("Error al modificar permiso:", error);
            setAlert({
                show: true,
                type: "error",
                message: "Error al modificar el permiso"
            });
        }
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

    // Modal de edición de rol
    if (modoEdicion) {
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

                <div className="max-w-2xl mx-auto">
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-gray-800">
                            {rolSeleccionado ? "Editar Rol" : "Nuevo Rol"}
                        </h1>
                    </div>

                    <form onSubmit={handleSubmitRol}>
                        <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nombre del Rol <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formRol.nombre}
                                    onChange={(e) => setFormRol({ ...formRol, nombre: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Ej: Supervisor"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Descripción
                                </label>
                                <textarea
                                    value={formRol.descripcion}
                                    onChange={(e) => setFormRol({ ...formRol, descripcion: e.target.value })}
                                    rows="3"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Describe las responsabilidades de este rol..."
                                />
                            </div>

                            <div className="flex gap-3 pt-4 border-t">
                                <button
                                    type="button"
                                    onClick={() => setModoEdicion(false)}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                >
                                    {rolSeleccionado ? "Actualizar" : "Crear"}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        );
    }

    // Modal de gestión de permisos
    if (modoPermisos) {
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

                <div className="max-w-4xl mx-auto">
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-gray-800">
                            Permisos del Rol: {rolSeleccionado?.nombre}
                        </h1>
                        <p className="text-gray-600 mt-1">
                            Selecciona los permisos que tendrá este rol
                        </p>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="space-y-3">
                            {permisos.map((permiso) => {
                                const tienePermiso = permisosDelRol.some(p => p.id === permiso.id);
                                return (
                                    <label key={permiso.id} className="flex items-start p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={tienePermiso}
                                            onChange={() => handleTogglePermiso(permiso.id)}
                                            className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                        />
                                        <div className="ml-3">
                                            <span className="block text-sm font-medium text-gray-900">
                                                {permiso.nombre}
                                            </span>
                                            {permiso.descripcion && (
                                                <span className="block text-sm text-gray-500">
                                                    {permiso.descripcion}
                                                </span>
                                            )}
                                        </div>
                                    </label>
                                );
                            })}
                        </div>

                        <div className="mt-6 pt-4 border-t">
                            <button
                                onClick={() => setModoPermisos(false)}
                                className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                            >
                                Finalizar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Vista principal
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

            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Gestión de Roles</h1>
                <p className="text-gray-600 mt-1">
                    Administra los roles y sus permisos en el sistema
                </p>
            </div>

            <div className="mb-4">
                <button
                    onClick={handleCrear}
                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Nuevo Rol
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {roles.map((rol) => (
                    <div key={rol.id} className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-start justify-between mb-4">
                            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getRolBadgeColor(rol.nombre)}`}>
                                {rol.nombre}
                            </span>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleEditar(rol)}
                                    className="text-blue-600 hover:text-blue-900"
                                    title="Editar"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                </button>
                                <button
                                    onClick={() => handleEliminar(rol)}
                                    className="text-red-600 hover:text-red-900"
                                    title="Eliminar"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <p className="text-gray-600 text-sm mb-4">
                            {rol.descripcion || "Sin descripción"}
                        </p>

                        <button
                            onClick={() => handleGestionarPermisos(rol)}
                            className="w-full px-4 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 flex items-center justify-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                            Gestionar Permisos
                        </button>
                    </div>
                ))}
            </div>

            {/* Modal de confirmación */}
            {modalConfirmacion.show && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                        <div className="mt-3 text-center">
                            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                                <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <h3 className="text-lg leading-6 font-medium text-gray-900 mt-4">
                                Eliminar Rol
                            </h3>
                            <div className="mt-2 px-7 py-3">
                                <p className="text-sm text-gray-500">
                                    ¿Estás seguro que deseas eliminar el rol{" "}
                                    <span className="font-semibold">{modalConfirmacion.nombre}</span>?
                                    <br />
                                    Esta acción no se puede deshacer.
                                </p>
                            </div>
                            <div className="items-center px-4 py-3 flex gap-3">
                                <button
                                    onClick={() => setModalConfirmacion({ show: false, id: null, nombre: "" })}
                                    className="flex-1 px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={confirmarEliminar}
                                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
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

export default RolMain;