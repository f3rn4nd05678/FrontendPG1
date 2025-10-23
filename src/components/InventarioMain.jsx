import React, { useState } from "react";
import StockMain from "./StockMain";
import EntradaInventario from "./EntradaInventario";
import SalidaInventario from "./SalidaInventario";
import MovimientosMain from "./MovimientosMain";

const InventarioMain = () => {
    const [vistaActual, setVistaActual] = useState("stock");

    const renderVista = () => {
        switch (vistaActual) {
            case "stock":
                return <StockMain />;
            case "entrada":
                return (
                    <EntradaInventario
                        onSuccess={() => setVistaActual("stock")}
                        onCancel={() => setVistaActual("stock")}
                    />
                );
            case "salida":
                return (
                    <SalidaInventario
                        onSuccess={() => setVistaActual("stock")}
                        onCancel={() => setVistaActual("stock")}
                    />
                );
            case "movimientos":
                return <MovimientosMain />;
            default:
                return <StockMain />;
        }
    };

    return (
        <div>
            {/* Tabs de navegación */}
            <div className="bg-white rounded-t-lg shadow-md">
                <div className="border-b border-gray-200">
                    <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
                        <button
                            onClick={() => setVistaActual("stock")}
                            className={`${vistaActual === "stock"
                                    ? "border-blue-500 text-blue-600"
                                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
                        >
                            <svg
                                className="w-5 h-5 inline mr-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                                />
                            </svg>
                            Stock Actual
                        </button>

                        <button
                            onClick={() => setVistaActual("entrada")}
                            className={`${vistaActual === "entrada"
                                    ? "border-green-500 text-green-600"
                                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
                        >
                            <svg
                                className="w-5 h-5 inline mr-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                                />
                            </svg>
                            Entrada
                        </button>

                        <button
                            onClick={() => setVistaActual("salida")}
                            className={`${vistaActual === "salida"
                                    ? "border-red-500 text-red-600"
                                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
                        >
                            <svg
                                className="w-5 h-5 inline mr-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M17 16V4m0 0l-4 4m4-4l4 4M7 20v-12m0 0l-4 4m4-4l4 4"
                                />
                            </svg>
                            Salida
                        </button>

                        <button
                            onClick={() => setVistaActual("movimientos")}
                            className={`${vistaActual === "movimientos"
                                    ? "border-purple-500 text-purple-600"
                                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
                        >
                            <svg
                                className="w-5 h-5 inline mr-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                />
                            </svg>
                            Movimientos
                        </button>
                    </nav>
                </div>
            </div>

            {/* Contenido */}
            <div className="mt-0">{renderVista()}</div>
        </div>
    );
};

export default InventarioMain;