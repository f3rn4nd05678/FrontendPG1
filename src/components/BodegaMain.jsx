import React, { useState, useEffect } from "react";
import { listarBodegas, eliminarBodega } from "../api/userService";
import BodegaEdit from "./BodegaEdit";
import Loader from "./Loader";
import Alert from "./Alert";

const BodegaMain = () => {
    const [bodegas, setBodegas] = useState([]);
    const [cargando, setCargando] = useState(false);
    const [modoEdicion, setModoEdicion] = useState(false);
    const [bodegaSeleccionada, setBodegaSeleccionada] = useState(null);
    const [busqueda, setBusqueda] = useState("");
    const [alert, setAlert] = useState({ show: false, type: "", message: "" });
    const [modalConfirmacion, setModalConfirmacion] = useState({ show: false, id: null, nombre: "" });

    useEffect(() => {
        cargarBodegas();
    }, []);

    const cargarBodegas = async () => {
        try {
            setCargando(true);

            const response = await listarBodegas();

            const data = response?.data ?? response;

            const ok = data?.isSuccess ?? data?.success ?? false;

            if (!ok) {
                throw new Error(data?.message || "No se pudieron obtener las bodegas");
            }

            const bodegasData = data?.detail?.bodegas ?? [];
            setBodegas(bodegasData);
        } catch (error) {
            console.error("Error al cargar bodegas:", error);
            setAlert({
                show: true,
                type: "error",
                message: error?.message || "Error al cargar las bodegas",
            });
        } finally {
            setCargando(false);
        }
    };


    const handleNuevo = () => {
        setBodegaSeleccionada(null);
        setModoEdicion(true);
    };

    const handleEditar = (bodega) => {
        setBodegaSeleccionada(bodega);
        setModoEdicion(true);
    };

    const handleEliminar = (id, nombre) => {
        setModalConfirmacion({ show: true, id, nombre });
    };

    const confirmarEliminar = async () => {
        try {
            setCargando(true);
            const response = await eliminarBodega({ id: modalConfirmacion.id });

            const data = response?.data ?? response;
            const ok = data?.isSuccess ?? data?.success ?? false;

            if (ok) {
                setAlert({
                    show: true,
                    type: "success",
                    message: "Bodega eliminada correctamente"
                });
                await cargarBodegas();
            }
        } catch (error) {
            console.error("Error al eliminar bodega:", error);
            setAlert({
                show: true,
                type: "error",
                message: error.response?.data?.message || "Error al eliminar la bodega"
            });
        } finally {
            setCargando(false);
            setModalConfirmacion({ show: false, id: null, nombre: "" });
        }
    };

    const cancelarEliminar = () => {
        setModalConfirmacion({ show: false, id: null, nombre: "" });
    };

    const handleGuardar = async () => {
        setModoEdicion(false);
        await cargarBodegas();
    };

    const handleCancelar = () => {
        setModoEdicion(false);
        setBodegaSeleccionada(null);
    };

    // Filtrado seguro
    const bodegasFiltradas = bodegas.filter((bodega) => {
        if (!busqueda) return true;

        const busquedaLower = busqueda.toLowerCase();
        const codigo = (bodega.codigo || "").toLowerCase();
        const nombre = (bodega.nombre || "").toLowerCase();
        const responsable = (bodega.responsable || "").toLowerCase();

        return codigo.includes(busquedaLower) ||
            nombre.includes(busquedaLower) ||
            responsable.includes(busquedaLower);
    });



    // Si está en modo edición, renderizar BodegaEdit
    if (modoEdicion) {
        return (
            <BodegaEdit
                bodega={bodegaSeleccionada}
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
                <h1 className="text-3xl font-bold text-gray-800">Gestión de Bodegas</h1>
                <p className="text-gray-600 mt-2">Administra las bodegas del sistema</p>
            </div>

            {/* Barra de acciones */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <div className="w-full md:w-96">
                    <input
                        type="text"
                        placeholder="Buscar por código, nombre o responsable..."
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <button
                    onClick={handleNuevo}
                    className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
                >
                    + Nueva Bodega
                </button>
            </div>

            {/* Tabla */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Código
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Nombre
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Dirección
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Responsable
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Teléfono
                                </th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Estado
                                </th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {bodegasFiltradas.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                                        {bodegas.length === 0 ? "No hay bodegas registradas" : "No se encontraron bodegas con ese criterio"}
                                    </td>
                                </tr>
                            ) : (
                                bodegasFiltradas.map((bodega) => (
                                    <tr key={bodega.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {bodega.codigo || "-"}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {bodega.nombre}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {bodega.direccion || "-"}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            {bodega.responsable || "-"}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            {bodega.telefono || "-"}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <span
                                                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${bodega.activa
                                                    ? "bg-green-100 text-green-800"
                                                    : "bg-red-100 text-red-800"
                                                    }`}
                                            >
                                                {bodega.activa ? "Activa" : "Inactiva"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                            <button
                                                onClick={() => handleEditar(bodega)}
                                                className="text-blue-600 hover:text-blue-900 mr-4"
                                                title="Editar"
                                            >
                                                <svg className="w-5 h-5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() => handleEliminar(bodega.id, bodega.nombre)}
                                                className="text-red-600 hover:text-red-900"
                                                title="Eliminar"
                                            >
                                                <svg className="w-5 h-5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal de confirmación de eliminación */}
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
                                Eliminar Bodega
                            </h3>
                            <div className="mt-2 px-7 py-3">
                                <p className="text-sm text-gray-500">
                                    ¿Está seguro de eliminar la bodega "<strong>{modalConfirmacion.nombre}</strong>"?
                                    Esta acción no se puede deshacer.
                                </p>
                            </div>
                            <div className="flex gap-4 justify-center mt-4">
                                <button
                                    onClick={cancelarEliminar}
                                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={confirmarEliminar}
                                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
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

export default BodegaMain;