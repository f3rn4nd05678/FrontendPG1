import React, { useState, useEffect } from "react";
import { listarStock, listarBodegas } from "../api/userService";
import Loader from "./Loader";
import Alert from "./Alert";

const StockMain = () => {
    const [stocks, setStocks] = useState([]);
    const [bodegas, setBodegas] = useState([]);
    const [cargando, setCargando] = useState(false);
    const [alert, setAlert] = useState({ show: false, type: "", message: "" });

    const [filtros, setFiltros] = useState({
        terminoBusqueda: "",
        idBodega: "",
        nivelAlerta: "",
        pagina: 1,
        elementosPorPagina: 20,
    });

    const [paginacion, setPaginacion] = useState({
        total: 0,
        totalPaginas: 0,
    });

    useEffect(() => {
        cargarBodegas();
        cargarStock();
    }, []);

    useEffect(() => {
        cargarStock();
    }, [filtros.pagina]);

    const cargarBodegas = async () => {
        try {
            const response = await listarBodegas();
            const data = response?.data ?? response;
            const ok = data?.isSuccess ?? data?.success ?? false;
            if (ok) {
                const bodegasData = data?.detail?.bodegas ?? data?.detail ?? [];
                setBodegas(bodegasData.filter(b => b.activa));
            }
        } catch (error) {
            console.error("Error al cargar bodegas:", error);
        }
    };

    const cargarStock = async () => {
        try {
            setCargando(true);
            const response = await listarStock(filtros);
            const data = response?.data ?? response;
            const ok = data?.isSuccess ?? data?.success ?? false;

            if (ok) {
                const stocksData = data?.detail?.stocks ?? [];
                setStocks(stocksData);
                setPaginacion({
                    total: data?.detail?.total ?? 0,
                    totalPaginas: data?.detail?.totalPaginas ?? 0,
                });
            }
        } catch (error) {
            console.error("Error al cargar stock:", error);
            setAlert({
                show: true,
                type: "error",
                message: "Error al cargar el stock",
            });
        } finally {
            setCargando(false);
        }
    };

    const handleFiltroChange = (e) => {
        const { name, value } = e.target;
        setFiltros({
            ...filtros,
            [name]: value,
            pagina: 1, // Reset a página 1 cuando cambia un filtro
        });
    };

    const handleBuscar = () => {
        cargarStock();
    };

    const handleLimpiarFiltros = () => {
        setFiltros({
            terminoBusqueda: "",
            idBodega: "",
            nivelAlerta: "",
            pagina: 1,
            elementosPorPagina: 20,
        });
        setTimeout(() => cargarStock(), 100);
    };

    const cambiarPagina = (nuevaPagina) => {
        setFiltros({ ...filtros, pagina: nuevaPagina });
    };

    const obtenerBadgeAlerta = (nivelAlerta) => {
        switch (nivelAlerta) {
            case "SIN_STOCK":
                return "bg-red-100 text-red-800";
            case "CRITICO":
                return "bg-orange-100 text-orange-800";
            case "BAJO":
                return "bg-yellow-100 text-yellow-800";
            default:
                return "bg-green-100 text-green-800";
        }
    };

    const obtenerTextoAlerta = (nivelAlerta) => {
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
                <h1 className="text-3xl font-bold text-gray-800">Stock Actual</h1>
                <p className="text-gray-600 mt-2">Consulta las existencias por bodega</p>
            </div>

            {/* Filtros */}
            <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Búsqueda */}
                    <div>
                        <label className="block text-gray-700 text-sm font-medium mb-2">
                            Buscar
                        </label>
                        <input
                            type="text"
                            name="terminoBusqueda"
                            value={filtros.terminoBusqueda}
                            onChange={handleFiltroChange}
                            placeholder="Código o nombre del producto..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Bodega */}
                    <div>
                        <label className="block text-gray-700 text-sm font-medium mb-2">
                            Bodega
                        </label>
                        <select
                            name="idBodega"
                            value={filtros.idBodega}
                            onChange={handleFiltroChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Todas las bodegas</option>
                            {bodegas.map((bodega) => (
                                <option key={bodega.id} value={bodega.id}>
                                    {bodega.nombre}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Nivel de Alerta */}
                    <div>
                        <label className="block text-gray-700 text-sm font-medium mb-2">
                            Nivel de Alerta
                        </label>
                        <select
                            name="nivelAlerta"
                            value={filtros.nivelAlerta}
                            onChange={handleFiltroChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Todos</option>
                            <option value="SIN_STOCK">Sin Stock</option>
                            <option value="CRITICO">Crítico</option>
                            <option value="BAJO">Bajo</option>
                            <option value="NORMAL">Normal</option>
                        </select>
                    </div>

                    {/* Botones */}
                    <div className="flex items-end gap-2">
                        <button
                            onClick={handleBuscar}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
                        >
                            Buscar
                        </button>
                        <button
                            onClick={handleLimpiarFiltros}
                            className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md transition-colors"
                        >
                            Limpiar
                        </button>
                    </div>
                </div>
            </div>

            {/* Resumen */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-lg shadow p-4">
                    <p className="text-gray-600 text-sm">Total Productos</p>
                    <p className="text-2xl font-bold text-gray-800">{paginacion.total}</p>
                </div>
                <div className="bg-red-50 rounded-lg shadow p-4">
                    <p className="text-red-600 text-sm">Sin Stock</p>
                    <p className="text-2xl font-bold text-red-800">
                        {stocks.filter(s => s.nivelAlerta === "SIN_STOCK").length}
                    </p>
                </div>
                <div className="bg-orange-50 rounded-lg shadow p-4">
                    <p className="text-orange-600 text-sm">Crítico</p>
                    <p className="text-2xl font-bold text-orange-800">
                        {stocks.filter(s => s.nivelAlerta === "CRITICO").length}
                    </p>
                </div>
                <div className="bg-yellow-50 rounded-lg shadow p-4">
                    <p className="text-yellow-600 text-sm">Bajo</p>
                    <p className="text-2xl font-bold text-yellow-800">
                        {stocks.filter(s => s.nivelAlerta === "BAJO").length}
                    </p>
                </div>
            </div>

            {/* Tabla */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Producto
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Bodega
                                </th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Disponible
                                </th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Reservado
                                </th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Mínimo
                                </th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Estado
                                </th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Última Entrada
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {stocks.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                                        No se encontró stock
                                    </td>
                                </tr>
                            ) : (
                                stocks.map((stock) => (
                                    <tr key={stock.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">
                                                    {stock.nombreProducto}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {stock.codigoProducto} - {stock.categoriaProducto}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900">
                                            {stock.nombreBodega}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="text-sm font-semibold text-gray-900">
                                                {stock.cantidadDisponible.toFixed(2)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center text-sm text-gray-600">
                                            {stock.cantidadReservada.toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 text-center text-sm text-gray-600">
                                            {stock.cantidadMinima.toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span
                                                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${obtenerBadgeAlerta(
                                                    stock.nivelAlerta
                                                )}`}
                                            >
                                                {obtenerTextoAlerta(stock.nivelAlerta)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center text-sm text-gray-600">
                                            {stock.ultimaEntrada
                                                ? new Date(stock.ultimaEntrada).toLocaleDateString()
                                                : "-"}
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
                                onClick={() => cambiarPagina(filtros.pagina - 1)}
                                disabled={filtros.pagina === 1}
                                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                            >
                                Anterior
                            </button>
                            <button
                                onClick={() => cambiarPagina(filtros.pagina + 1)}
                                disabled={filtros.pagina === paginacion.totalPaginas}
                                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                            >
                                Siguiente
                            </button>
                        </div>
                        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm text-gray-700">
                                    Mostrando página <span className="font-medium">{filtros.pagina}</span> de{" "}
                                    <span className="font-medium">{paginacion.totalPaginas}</span>
                                    {" "}({paginacion.total} productos)
                                </p>
                            </div>
                            <div>
                                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                                    <button
                                        onClick={() => cambiarPagina(filtros.pagina - 1)}
                                        disabled={filtros.pagina === 1}
                                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                                    >
                                        Anterior
                                    </button>
                                    <button
                                        onClick={() => cambiarPagina(filtros.pagina + 1)}
                                        disabled={filtros.pagina === paginacion.totalPaginas}
                                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                                    >
                                        Siguiente
                                    </button>
                                </nav>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StockMain;