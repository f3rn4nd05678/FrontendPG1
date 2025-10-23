import React, { useState, useEffect } from "react";
import { registrarEntrada } from "../api/userService";
import { listarProductos } from "../api/userService";
import { listarBodegas } from "../api/userService";
import Loader from "./Loader";
import Alert from "./Alert";

const EntradaInventario = ({ onSuccess, onCancel }) => {
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState({ show: false, type: "", message: "" });

    const [productos, setProductos] = useState([]);
    const [bodegas, setBodegas] = useState([]);
    const [productoSeleccionado, setProductoSeleccionado] = useState(null);

    const [formData, setFormData] = useState({
        idProducto: "",
        idBodega: "",
        cantidad: "",
        precioUnitario: "",
        observacion: "",
        referencia: "",
    });

    useEffect(() => {
        cargarDatos();
    }, []);

    const cargarDatos = async () => {
        try {
            setLoading(true);

            // Cargar productos
            const resProductos = await listarProductos();
            const dataProductos = resProductos?.data ?? resProductos;
            const okProductos = dataProductos?.isSuccess ?? dataProductos?.success ?? false;
            if (okProductos) {
                const productosData = dataProductos?.detail?.productos ?? dataProductos?.detail ?? [];
                setProductos(productosData.filter(p => p.activo));
            }

            // Cargar bodegas
            const resBodegas = await listarBodegas();
            const dataBodegas = resBodegas?.data ?? resBodegas;
            const okBodegas = dataBodegas?.isSuccess ?? dataBodegas?.success ?? false;
            if (okBodegas) {
                const bodegasData = dataBodegas?.detail?.bodegas ?? dataBodegas?.detail ?? [];
                setBodegas(bodegasData.filter(b => b.activa));
            }
        } catch (error) {
            console.error("Error al cargar datos:", error);
            setAlert({
                show: true,
                type: "error",
                message: "Error al cargar los datos necesarios",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });

        // Si cambia el producto, actualizar info del producto seleccionado
        if (name === "idProducto") {
            const producto = productos.find(p => p.id === parseInt(value));
            setProductoSeleccionado(producto || null);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const dataToSend = {
                idProducto: parseInt(formData.idProducto),
                idBodega: parseInt(formData.idBodega),
                cantidad: parseFloat(formData.cantidad),
                precioUnitario: formData.precioUnitario ? parseFloat(formData.precioUnitario) : null,
                observacion: formData.observacion.trim() || null,
                referencia: formData.referencia.trim() || null,
            };

            const response = await registrarEntrada(dataToSend);
            const data = response?.data ?? response;
            const ok = data?.isSuccess ?? data?.success ?? false;

            if (ok) {
                setAlert({
                    show: true,
                    type: "success",
                    message: "Entrada de inventario registrada correctamente",
                });
                setTimeout(() => {
                    if (onSuccess) onSuccess();
                }, 1500);
            }
        } catch (error) {
            console.error("Error al registrar entrada:", error);
            setAlert({
                show: true,
                type: "error",
                message: error.response?.data?.message || "Error al registrar la entrada",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6">
            {loading && <Loader />}
            {alert.show && (
                <Alert
                    type={alert.type}
                    message={alert.message}
                    onClose={() => setAlert({ show: false, type: "", message: "" })}
                />
            )}

            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Entrada de Inventario</h1>
                <p className="text-gray-600 mt-2">Registra productos que ingresan a bodega</p>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Producto */}
                    <div>
                        <label className="block text-gray-700 text-sm font-medium mb-2">
                            Producto *
                        </label>
                        <select
                            name="idProducto"
                            value={formData.idProducto}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        >
                            <option value="">Seleccione un producto</option>
                            {productos.map((producto) => (
                                <option key={producto.id} value={producto.id}>
                                    {producto.codigo} - {producto.nombre}
                                </option>
                            ))}
                        </select>
                        {productoSeleccionado && (
                            <p className="text-xs text-gray-500 mt-1">
                                Categoría: {productoSeleccionado.nombreCategoria}
                            </p>
                        )}
                    </div>

                    {/* Bodega */}
                    <div>
                        <label className="block text-gray-700 text-sm font-medium mb-2">
                            Bodega *
                        </label>
                        <select
                            name="idBodega"
                            value={formData.idBodega}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        >
                            <option value="">Seleccione una bodega</option>
                            {bodegas.map((bodega) => (
                                <option key={bodega.id} value={bodega.id}>
                                    {bodega.codigo} - {bodega.nombre}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Cantidad */}
                    <div>
                        <label className="block text-gray-700 text-sm font-medium mb-2">
                            Cantidad *
                        </label>
                        <input
                            name="cantidad"
                            type="number"
                            step="0.01"
                            min="0.01"
                            value={formData.cantidad}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Ej: 100"
                            required
                        />
                    </div>

                    {/* Precio Unitario */}
                    <div>
                        <label className="block text-gray-700 text-sm font-medium mb-2">
                            Precio Unitario (Opcional)
                        </label>
                        <input
                            name="precioUnitario"
                            type="number"
                            step="0.01"
                            min="0"
                            value={formData.precioUnitario}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Ej: 25.50"
                        />
                    </div>

                    {/* Referencia */}
                    <div>
                        <label className="block text-gray-700 text-sm font-medium mb-2">
                            Referencia (Opcional)
                        </label>
                        <input
                            name="referencia"
                            type="text"
                            maxLength={50}
                            value={formData.referencia}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Ej: OC-2024-001"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Número de orden de compra, factura, etc.
                        </p>
                    </div>

                    {/* Observación */}
                    <div className="md:col-span-2">
                        <label className="block text-gray-700 text-sm font-medium mb-2">
                            Observación (Opcional)
                        </label>
                        <textarea
                            name="observacion"
                            value={formData.observacion}
                            onChange={handleChange}
                            rows="3"
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Notas adicionales sobre esta entrada..."
                        />
                    </div>
                </div>

                {/* Botones */}
                <div className="flex justify-end gap-4 mt-6 pt-6 border-t">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-6 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Registrar Entrada
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EntradaInventario;