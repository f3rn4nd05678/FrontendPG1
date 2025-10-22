import React, { useState, useEffect } from "react";
import { validarCodigoProducto } from "../api/userService";
import Loader from "./Loader";
import Alert from "./Alert";

const ProductEdit = ({ onSubmit, producto: productoInicial = null, onCancel }) => {
    const [formData, setFormData] = useState({
        codigo: "",
        nombre: "",
        descripcion: "",
        categoria: "",
        precio: 0,
        activo: true,
        // Campos adicionales según tu modelo
        proveedorId: "",
        stock: 0,
        stockMinimo: 0,
        unidadMedida: "Unidad"
    });

    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState({ show: false, type: "", message: "" });
    const [validaciones, setValidaciones] = useState({
        codigo: { validando: false, valido: true, mensaje: "" }
    });

    useEffect(() => {
        if (productoInicial) {
            setFormData(prev => ({ ...prev, ...productoInicial }));
        }
    }, [productoInicial]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleBlurCodigo = async (e) => {
        const codigo = e.target.value.trim();
        if (!codigo) {
            setValidaciones(prev => ({
                ...prev,
                codigo: { validando: false, valido: false, mensaje: "El código es obligatorio" }
            }));
            return;
        }

        setValidaciones(prev => ({
            ...prev,
            codigo: { validando: true, valido: true, mensaje: "Validando..." }
        }));

        try {
            const requestData = { codigo };
            if (productoInicial?.id) {
                requestData.idExcluir = productoInicial.id;
            }

            const response = await validarCodigoProducto(requestData);

            if (response.success && response.detail.existe) {
                setValidaciones(prev => ({
                    ...prev,
                    codigo: {
                        validando: false,
                        valido: false,
                        mensaje: "Este código ya está en uso"
                    }
                }));
            } else {
                setValidaciones(prev => ({
                    ...prev,
                    codigo: {
                        validando: false,
                        valido: true,
                        mensaje: "✓ Código disponible"
                    }
                }));
            }
        } catch (error) {
            console.error("Error al validar código:", error);
            setValidaciones(prev => ({
                ...prev,
                codigo: {
                    validando: false,
                    valido: true,
                    mensaje: ""
                }
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validaciones básicas
        if (!formData.codigo.trim()) {
            setAlert({
                show: true,
                type: "error",
                message: "El código del producto es obligatorio"
            });
            return;
        }

        if (!formData.nombre.trim()) {
            setAlert({
                show: true,
                type: "error",
                message: "El nombre del producto es obligatorio"
            });
            return;
        }

        if (!validaciones.codigo.valido) {
            setAlert({
                show: true,
                type: "error",
                message: "El código del producto ya existe"
            });
            return;
        }

        if (parseFloat(formData.precio) < 0) {
            setAlert({
                show: true,
                type: "error",
                message: "El precio no puede ser negativo"
            });
            return;
        }

        setLoading(true);
        try {
            await onSubmit(formData);
        } catch (error) {
            setAlert({
                show: true,
                type: "error",
                message: error.message || "Error al guardar el producto"
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
                <h1 className="text-3xl font-bold text-gray-800">
                    {productoInicial ? "Editar Producto" : "Nuevo Producto"}
                </h1>
                <p className="text-gray-600 mt-2">
                    Complete el formulario con la información del producto
                </p>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
                {/* Información General */}
                <div className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
                        Información General
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Código */}
                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-2">
                                Código del Producto *
                            </label>
                            <input
                                name="codigo"
                                type="text"
                                value={formData.codigo}
                                onChange={handleChange}
                                onBlur={handleBlurCodigo}
                                className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 ${validaciones.codigo.validando
                                        ? "border-yellow-400 focus:ring-yellow-500"
                                        : validaciones.codigo.valido
                                            ? "border-gray-300 focus:ring-blue-500"
                                            : "border-red-500 focus:ring-red-500"
                                    }`}
                                required
                                disabled={productoInicial !== null} // No editable si es actualización
                            />
                            {validaciones.codigo.mensaje && (
                                <p
                                    className={`text-sm mt-1 ${validaciones.codigo.valido ? "text-green-600" : "text-red-600"
                                        }`}
                                >
                                    {validaciones.codigo.mensaje}
                                </p>
                            )}
                        </div>

                        {/* Nombre */}
                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-2">
                                Nombre del Producto *
                            </label>
                            <input
                                name="nombre"
                                type="text"
                                value={formData.nombre}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        {/* Categoría */}
                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-2">
                                Categoría
                            </label>
                            <input
                                name="categoria"
                                type="text"
                                value={formData.categoria}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Ej: Electrónica, Alimentos, etc."
                            />
                        </div>

                        {/* Unidad de Medida */}
                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-2">
                                Unidad de Medida
                            </label>
                            <select
                                name="unidadMedida"
                                value={formData.unidadMedida}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="Unidad">Unidad</option>
                                <option value="Caja">Caja</option>
                                <option value="Paquete">Paquete</option>
                                <option value="Kg">Kilogramo (Kg)</option>
                                <option value="Litro">Litro</option>
                                <option value="Metro">Metro</option>
                                <option value="Docena">Docena</option>
                            </select>
                        </div>

                        {/* Precio */}
                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-2">
                                Precio (GTQ) *
                            </label>
                            <input
                                name="precio"
                                type="number"
                                step="0.01"
                                min="0"
                                value={formData.precio}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        {/* Estado */}
                        <div className="flex items-center pt-7">
                            <input
                                name="activo"
                                type="checkbox"
                                checked={formData.activo}
                                onChange={handleChange}
                                className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label className="ml-2 block text-sm text-gray-700 font-medium">
                                Producto Activo
                            </label>
                        </div>
                    </div>

                    {/* Descripción */}
                    <div className="mt-4">
                        <label className="block text-gray-700 text-sm font-medium mb-2">
                            Descripción
                        </label>
                        <textarea
                            name="descripcion"
                            value={formData.descripcion}
                            onChange={handleChange}
                            rows="3"
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Descripción detallada del producto..."
                        />
                    </div>
                </div>

                {/* Inventario */}
                <div className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
                        Control de Inventario
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Stock Actual */}
                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-2">
                                Stock Actual
                            </label>
                            <input
                                name="stock"
                                type="number"
                                min="0"
                                value={formData.stock}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Cantidad disponible en inventario
                            </p>
                        </div>

                        {/* Stock Mínimo */}
                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-2">
                                Stock Mínimo
                            </label>
                            <input
                                name="stockMinimo"
                                type="number"
                                min="0"
                                value={formData.stockMinimo}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Alerta cuando el stock llegue a este nivel
                            </p>
                        </div>
                    </div>
                </div>

                {/* Botones de acción */}
                <div className="flex justify-end gap-4 pt-6 border-t">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-6 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={!validaciones.codigo.valido || loading}
                        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {productoInicial ? "Actualizar" : "Crear"} Producto
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProductEdit;