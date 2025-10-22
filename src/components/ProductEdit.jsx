import React, { useState, useEffect } from "react";
import { validarCodigoProducto, listarProveedores } from "../api/userService";
import Loader from "./Loader";
import Alert from "./Alert";

const ProductEdit = ({ onSubmit, producto: productoInicial = null, onCancel }) => {
    const [formData, setFormData] = useState({
        codigo: "",
        nombre: "",
        categoria: "",
        precio: 0,
        stockMinimo: 0,
        proveedorId: null
    });

    const [proveedores, setProveedores] = useState([]);
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState({ show: false, type: "", message: "" });
    const [validaciones, setValidaciones] = useState({
        codigo: { validando: false, valido: true, mensaje: "" }
    });

    useEffect(() => {
        cargarProveedores();
        if (productoInicial) {
            setFormData({
                codigo: productoInicial.codigo || "",
                nombre: productoInicial.nombre || "",
                categoria: productoInicial.categoria || "",
                precio: productoInicial.precio || 0,
                stockMinimo: productoInicial.stockMinimo || 0,
                proveedorId: productoInicial.proveedorId || null
            });
        }
    }, [productoInicial]);

    const cargarProveedores = async () => {
        try {
            const response = await listarProveedores({ pagina: 1, elementosPorPagina: 100 });
            setProveedores(response.detail?.proveedores || []);
        } catch (error) {
            console.error("Error al cargar proveedores:", error);
        }
    };

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "number" ? (value === "" ? 0 : parseFloat(value)) : value,
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

        // Validaciones según el backend
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

        if (parseFloat(formData.precio) <= 0) {
            setAlert({
                show: true,
                type: "error",
                message: "El precio debe ser mayor a 0"
            });
            return;
        }

        if (parseInt(formData.stockMinimo) < 0) {
            setAlert({
                show: true,
                type: "error",
                message: "El stock mínimo no puede ser negativo"
            });
            return;
        }

        setLoading(true);
        try {
            // Preparar datos según el backend espera
            const dataToSend = {
                nombre: formData.nombre.trim(),
                codigo: formData.codigo.trim(),
                categoria: formData.categoria.trim() || null,
                precio: parseFloat(formData.precio),
                stockMinimo: parseInt(formData.stockMinimo),
                proveedorId: formData.proveedorId ? parseInt(formData.proveedorId) : null
            };

            await onSubmit(dataToSend);
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
                                maxLength={50}
                                className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 ${validaciones.codigo.validando
                                        ? "border-yellow-400 focus:ring-yellow-500"
                                        : validaciones.codigo.valido
                                            ? "border-gray-300 focus:ring-blue-500"
                                            : "border-red-500 focus:ring-red-500"
                                    }`}
                                required
                                disabled={productoInicial !== null}
                            />
                            {validaciones.codigo.mensaje && (
                                <p
                                    className={`text-sm mt-1 ${validaciones.codigo.valido ? "text-green-600" : "text-red-600"
                                        }`}
                                >
                                    {validaciones.codigo.mensaje}
                                </p>
                            )}
                            <p className="text-xs text-gray-500 mt-1">Máximo 50 caracteres</p>
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
                                maxLength={100}
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                            <p className="text-xs text-gray-500 mt-1">Máximo 100 caracteres</p>
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
                                maxLength={50}
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Ej: Bolsas Plásticas, Embalaje Industrial"
                            />
                            <p className="text-xs text-gray-500 mt-1">Máximo 50 caracteres (opcional)</p>
                        </div>

                        {/* Proveedor */}
                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-2">
                                Proveedor
                            </label>
                            <select
                                name="proveedorId"
                                value={formData.proveedorId || ""}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Seleccione un proveedor</option>
                                {proveedores.map((proveedor) => (
                                    <option key={proveedor.id} value={proveedor.id}>
                                        {proveedor.nombre}
                                    </option>
                                ))}
                            </select>
                            <p className="text-xs text-gray-500 mt-1">Opcional</p>
                        </div>

                        {/* Precio */}
                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-2">
                                Precio Unitario (GTQ) *
                            </label>
                            <input
                                name="precio"
                                type="number"
                                step="0.01"
                                min="0.01"
                                value={formData.precio}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                            <p className="text-xs text-gray-500 mt-1">Debe ser mayor a 0</p>
                        </div>

                        {/* Stock Mínimo */}
                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-2">
                                Stock Mínimo *
                            </label>
                            <input
                                name="stockMinimo"
                                type="number"
                                min="0"
                                value={formData.stockMinimo}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Cantidad mínima para generar alertas
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