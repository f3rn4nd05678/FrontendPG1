import React, { useState, useEffect } from "react";
import { getAlertasStock } from "../api/bodegaService";
import { X, AlertTriangle, AlertCircle, TrendingDown } from "lucide-react";

const BodegaAlertasModal = ({ bodega, onClose }) => {
    const [alertas, setAlertas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        cargarAlertas();
    }, [bodega]);

    const cargarAlertas = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await getAlertasStock(bodega.id);
            if (response.success) {
                setAlertas(response.data);
            }
        } catch (err) {
            setError("Error al cargar alertas: " + (err.message || "Error desconocido"));
        } finally {
            setLoading(false);
        }
    };

    const getIconoAlerta = (nivelAlerta) => {
        switch (nivelAlerta) {
            case "SIN_STOCK":
                return <AlertCircle className="w-5 h-5 text-red-600" />;
            case "CRITICO":
                return <AlertTriangle className="w-5 h-5 text-orange-600" />;
            case "BAJO":
                return <TrendingDown className="w-5 h-5 text-yellow-600" />;
            default:
                return null;
        }
    };

    const getColorAlerta = (nivelAlerta) => {
        switch (nivelAlerta) {
            case "SIN_STOCK":
                return "bg-red-50 border-red-200 text-red-800";
            case "CRITICO":
                return "bg-orange-50 border-orange-200 text-orange-800";
            case "BAJO":
                return "bg-yellow-50 border-yellow-200 text-yellow-800";
            default:
                return "bg-gray-50 border-gray-200 text-gray-800";
        }
    };

    const getNombreAlerta = (nivelAlerta) => {
        switch (nivelAlerta) {
            case "SIN_STOCK":
                return "Sin Stock";
            case "CRITICO":
                return "Crítico";
            case "BAJO":
                return "Bajo";
            default:
                return "Normal";
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-800">
                            Alertas de Stock - {bodega.nombre}
                        </h2>
                        <p className="text-sm text-gray-600 mt-1">
                            Productos con stock bajo, crítico o sin existencias
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {loading ? (
                        <div className="text-center py-8">
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                            <p className="mt-2 text-gray-600">Cargando alertas...</p>
                        </div>
                    ) : error ? (
                        <div className="bg-red-50 border border-red-200 rounded-md p-4 flex items-start gap-2">
                            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="font-medium text-red-800">Error</p>
                                <p className="text-sm text-red-700">{error}</p>
                            </div>
                        </div>
                    ) : alertas.length === 0 ? (
                        <div className="text-center py-8">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <p className="text-lg font-medium text-gray-900">Todo en orden</p>
                            <p className="text-gray-600">No hay alertas de stock en esta bodega</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {alertas.map((alerta) => (
                                <div
                                    key={alerta.idStock}
                                    className={`border rounded-lg p-4 ${getColorAlerta(alerta.nivelAlerta)}`}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className="flex-shrink-0 mt-0.5">
                                            {getIconoAlerta(alerta.nivelAlerta)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="flex-1">
                                                    <h3 className="font-medium text-gray-900">
                                                        {alerta.producto}
                                                    </h3>
                                                    <p className="text-sm text-gray-600 mt-0.5">
                                                        Código: {alerta.codigoProducto}
                                                    </p>
                                                </div>
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${alerta.nivelAlerta === "SIN_STOCK" ? "bg-red-100 text-red-800" :
                                                        alerta.nivelAlerta === "CRITICO" ? "bg-orange-100 text-orange-800" :
                                                            "bg-yellow-100 text-yellow-800"
                                                    }`}>
                                                    {getNombreAlerta(alerta.nivelAlerta)}
                                                </span>
                                            </div>

                                            <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                                                <div>
                                                    <p className="text-gray-600">Actual</p>
                                                    <p className="font-semibold">{alerta.cantidadActual}</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-600">Mínimo</p>
                                                    <p className="font-semibold">{alerta.cantidadMinima}</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-600">Reservado</p>
                                                    <p className="font-semibold">{alerta.cantidadReservada}</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-600">Disponible</p>
                                                    <p className="font-semibold text-blue-600">{alerta.cantidadDisponible}</p>
                                                </div>
                                            </div>

                                            {(alerta.ultimaEntrada || alerta.ultimaSalida) && (
                                                <div className="mt-3 flex flex-wrap gap-4 text-xs text-gray-600">
                                                    {alerta.ultimaEntrada && (
                                                        <div>
                                                            Última entrada: {new Date(alerta.ultimaEntrada).toLocaleDateString()}
                                                        </div>
                                                    )}
                                                    {alerta.ultimaSalida && (
                                                        <div>
                                                            Última salida: {new Date(alerta.ultimaSalida).toLocaleDateString()}
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-white transition"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BodegaAlertasModal;