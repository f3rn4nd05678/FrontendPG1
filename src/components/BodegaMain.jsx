import React, { useState, useEffect } from "react";
import {
    getBodegasConFiltros,
    eliminarBodega,
    cambiarEstadoBodega
} from "../api/bodegaService";
import BodegaForm from "./BodegaForm";
import BodegaAlertasModal from "./BodegaAlertasModal";
import { AlertCircle, Warehouse, Search, Plus, Edit, Trash2, Eye, CheckCircle, XCircle } from "lucide-react";

const BodegaMain = () => {
    const [bodegas, setBodegas] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [busqueda, setBusqueda] = useState("");
    const [soloActivas, setSoloActivas] = useState(true);

    // Modal de formulario
    const [showForm, setShowForm] = useState(false);
    const [bodegaSeleccionada, setBodegaSeleccionada] = useState(null);
    const [modoFormulario, setModoFormulario] = useState("crear"); // crear, editar, ver

    // Modal de alertas
    const [showAlertas, setShowAlertas] = useState(false);
    const [bodegaAlertas, setBodegaAlertas] = useState(null);

    // Paginación
    const [paginacion, setPaginacion] = useState({
        paginaActual: 1,
        elementosPorPagina: 10,
        totalPaginas: 0,
        totalRegistros: 0
    });

    useEffect(() => {
        cargarBodegas();
    }, [paginacion.paginaActual, paginacion.elementosPorPagina, busqueda, soloActivas]);

    const cargarBodegas = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await getBodegasConFiltros({
                terminoBusqueda: busqueda,
                soloActivas: soloActivas,
                pagina: paginacion.paginaActual,
                elementosPorPagina: paginacion.elementosPorPagina
            });

            if (response.success) {
                setBodegas(response.data.bodegas);
                setPaginacion(prev => ({
                    ...prev,
                    totalPaginas: response.data.totalPaginas,
                    totalRegistros: response.data.total
                }));
            }
        } catch (err) {
            setError("Error al cargar las bodegas: " + (err.message || "Error desconocido"));
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleNuevaBodega = () => {
        setBodegaSeleccionada(null);
        setModoFormulario("crear");
        setShowForm(true);
    };

    const handleEditarBodega = (bodega) => {
        setBodegaSeleccionada(bodega);
        setModoFormulario("editar");
        setShowForm(true);
    };

    const handleVerBodega = (bodega) => {
        setBodegaSeleccionada(bodega);
        setModoFormulario("ver");
        setShowForm(true);
    };

    const handleEliminarBodega = async (id) => {
        if (!window.confirm("¿Está seguro de eliminar esta bodega?")) return;

        try {
            const response = await eliminarBodega(id);
            if (response.success) {
                alert("Bodega eliminada correctamente");
                cargarBodegas();
            }
        } catch (err) {
            alert("Error al eliminar: " + (err.response?.data?.message || err.message));
        }
    };

    const handleCambiarEstado = async (id, estadoActual) => {
        const nuevoEstado = !estadoActual;
        const accion = nuevoEstado ? "activar" : "desactivar";

        if (!window.confirm(`¿Está seguro de ${accion} esta bodega?`)) return;

        try {
            const response = await cambiarEstadoBodega(id, nuevoEstado);
            if (response.success) {
                alert(`Bodega ${accion}da correctamente`);
                cargarBodegas();
            }
        } catch (err) {
            alert(`Error al ${accion}: ` + (err.response?.data?.message || err.message));
        }
    };

    const handleVerAlertas = (bodega) => {
        setBodegaAlertas(bodega);
        setShowAlertas(true);
    };

    const handleFormSuccess = () => {
        setShowForm(false);
        cargarBodegas();
    };

    const cambiarPagina = (nuevaPagina) => {
        if (nuevaPagina >= 1 && nuevaPagina <= paginacion.totalPaginas) {
            setPaginacion(prev => ({ ...prev, paginaActual: nuevaPagina }));
        }
    };

    const calcularRangoMostrado = (pagina, porPagina, total) => {
        const inicio = (pagina - 1) * porPagina + 1;
        const fin = Math.min(pagina * porPagina, total);
        return { inicio, fin };
    };

    const { inicio, fin } = calcularRangoMostrado(
        paginacion.paginaActual,
        paginacion.elementosPorPagina,
        paginacion.totalRegistros
    );

    return (
        <div className="bg-white rounded-md shadow-md p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                    <Warehouse className="w-6 h-6 text-blue-600" />
                    <h1 className="text-2xl font-bold text-gray-800">Gestión de Bodegas</h1>
                </div>
                <button
                    onClick={handleNuevaBodega}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition"
                >
                    <Plus className="w-4 h-4" />
                    Nueva Bodega
                </button>
            </div>

            {/* Filtros */}
            <div className="mb-4 flex gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Buscar por nombre, responsable o dirección..."
                        value={busqueda}
                        onChange={(e) => {
                            setBusqueda(e.target.value);
                            setPaginacion(prev => ({ ...prev, paginaActual: 1 }));
                        }}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
                <label className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        checked={soloActivas}
                        onChange={(e) => {
                            setSoloActivas(e.target.checked);
                            setPaginacion(prev => ({ ...prev, paginaActual: 1 }));
                        }}
                        className="w-4 h-4 text-blue-600"
                    />
                    <span className="text-sm text-gray-700">Solo activas</span>
                </label>
            </div>

            {/* Tabla */}
            {loading ? (
                <div className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <p className="mt-2 text-gray-600">Cargando bodegas...</p>
                </div>
            ) : error ? (
                <div className="bg-red-50 border border-red-200 rounded-md p-4 flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                        <p className="font-medium text-red-800">Error</p>
                        <p className="text-sm text-red-700">{error}</p>
                    </div>
                </div>
            ) : bodegas.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                    <Warehouse className="w-16 h-16 mx-auto mb-2 text-gray-400" />
                    <p>No se encontraron bodegas</p>
                </div>
            ) : (
                <>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
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
                                        Productos
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
                                {bodegas.map((bodega) => (
                                    <tr key={bodega.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                {bodega.nombre}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900 max-w-xs truncate">
                                                {bodega.direccion || "-"}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                                {bodega.responsable || "-"}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                                {bodega.telefono || "-"}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <button
                                                onClick={() => handleVerAlertas(bodega)}
                                                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                                            >
                                                {bodega.totalProductos}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${bodega.activa
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                                }`}>
                                                {bodega.activa ? 'Activa' : 'Inactiva'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => handleVerBodega(bodega)}
                                                    className="text-blue-600 hover:text-blue-900"
                                                    title="Ver detalles"
                                                >
                                                    <Eye className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() => handleEditarBodega(bodega)}
                                                    className="text-yellow-600 hover:text-yellow-900"
                                                    title="Editar"
                                                >
                                                    <Edit className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() => handleCambiarEstado(bodega.id, bodega.activa)}
                                                    className={`${bodega.activa ? 'text-orange-600 hover:text-orange-900' : 'text-green-600 hover:text-green-900'}`}
                                                    title={bodega.activa ? 'Desactivar' : 'Activar'}
                                                >
                                                    {bodega.activa ? <XCircle className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
                                                </button>
                                                <button
                                                    onClick={() => handleEliminarBodega(bodega.id)}
                                                    className="text-red-600 hover:text-red-900"
                                                    title="Eliminar"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Paginación */}
                    <div className="mt-4 flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
                        <div className="flex flex-1 justify-between sm:hidden">
                            <button
                                onClick={() => cambiarPagina(paginacion.paginaActual - 1)}
                                disabled={paginacion.paginaActual === 1}
                                className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                            >
                                Anterior
                            </button>
                            <button
                                onClick={() => cambiarPagina(paginacion.paginaActual + 1)}
                                disabled={paginacion.paginaActual === paginacion.totalPaginas}
                                className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                            >
                                Siguiente
                            </button>
                        </div>
                        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm text-gray-700">
                                    Mostrando <span className="font-medium">{inicio}</span> a{' '}
                                    <span className="font-medium">{fin}</span> de{' '}
                                    <span className="font-medium">{paginacion.totalRegistros}</span> bodegas
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
                                                numeroPagina === 2 &&
                                                paginacion.paginaActual > 3
                                            ) {
                                                return (
                                                    <span key={numeroPagina} className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                                                        ...
                                                    </span>
                                                );
                                            }
                                            if (
                                                numeroPagina === paginacion.totalPaginas - 1 &&
                                                paginacion.paginaActual < paginacion.totalPaginas - 2
                                            ) {
                                                return (
                                                    <span key={numeroPagina} className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
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
                                                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${paginacion.paginaActual === numeroPagina
                                                        ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
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
                </>
            )}

            {/* Modal de Formulario */}
            {showForm && (
                <BodegaForm
                    bodega={bodegaSeleccionada}
                    modo={modoFormulario}
                    onClose={() => setShowForm(false)}
                    onSuccess={handleFormSuccess}
                />
            )}

            {/* Modal de Alertas */}
            {showAlertas && (
                <BodegaAlertasModal
                    bodega={bodegaAlertas}
                    onClose={() => setShowAlertas(false)}
                />
            )}
        </div>
    );
};

export default BodegaMain;