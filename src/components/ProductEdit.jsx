import React, { useState, useEffect } from "react";
import { validarCodigoProducto, listarProveedores, listarCategorias } from "../api/userService";
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
    const [categorias, setCategorias] = useState([]);

    useEffect(() => {
        cargarCategorias();
    }, []);

    const cargarCategorias = async () => {
        try {
            const res = await listarCategorias();
            const payload = res?.detail ?? res;

            const list =
                Array.isArray(payload?.detail) ? payload.detail :
                    Array.isArray(payload?.categorias) ? payload.categorias :
                        Array.isArray(payload) ? payload :
                            [];

            setCategorias(list);
        } catch (error) {
            console.error("Error al cargar categorías:", error);
            setAlert({
                show: true,
                type: "error",
                message: "Error al cargar las categorías",
            });
        }
    };

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

    const handleBlurCodigo = async () => {
        const codigo = formData.codigo.trim();

        if (!codigo) {
            setValidaciones(prev => ({
                ...prev,
                codigo: { valido: false, mensaje: "El código es requerido", validando: false }
            }));
            return;
        }

        setValidaciones(prev => ({
            ...prev,
            codigo: { ...prev.codigo, validando: true, mensaje: "Validando..." }
        }));

        try {
            // Solo validar si estamos editando, en crear el backend lo genera
            if (productoInicial) {
                const response = await validarCodigoProducto(codigo, productoInicial.id);

                if (response.detail && response.detail.existe) {
                    setValidaciones(prev => ({
                        ...prev,
                        codigo: {
                            valido: false,
                            mensaje: "Este código ya está en uso",
                            validando: false
                        }
                    }));
                } else {
                    setValidaciones(prev => ({
                        ...prev,
                        codigo: {
                            valido: true,
                            mensaje: "Código disponible",
                            validando: false
                        }
                    }));
                }
            } else {
                setValidaciones(prev => ({
                    ...prev,
                    codigo: {
                        valido: true,
                        mensaje: "El código se generará automáticamente",
                        validando: false
                    }
                }));
            }
        } catch (error) {
            console.error("Error al validar código:", error);
            setValidaciones(prev => ({
                ...prev,
                codigo: {
                    valido: false,
                    mensaje: "Error al validar el código",
                    validando: false
                }
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const dataToSend = {
                nombre: formData.nombre.trim(),
                codigo: productoInicial ? formData.codigo.trim() : null,
                categoriaId: parseInt(formData.categoria),
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
                                Código del Producto {!productoInicial && "(Se genera automáticamente)"}
                            </label>
                            <input
                                name="codigo"
                                type="text"
                                value={formData.codigo}
                                onChange={handleChange}
                                onBlur={handleBlurCodigo}
                                maxLength={50}
                                placeholder={!productoInicial ? "Se generará automáticamente" : ""}
                                className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 ${validaciones.codigo.validando
                                        ? "border-yellow-400 focus:ring-yellow-500"
                                        : validaciones.codigo.valido
                                            ? "border-gray-300 focus:ring-blue-500"
                                            : "border-red-500 focus:ring-red-500"
                                    } ${!productoInicial ? 'bg-gray-100 cursor-not-allowed' : 'bg-gray-100 cursor-not-allowed'}`}
                                disabled={true}
                                title={productoInicial ? "El código no se puede modificar" : "El código se genera automáticamente"}
                            />
                            {validaciones.codigo.mensaje && !productoInicial && (
                                <p className="text-sm mt-1 text-gray-600">
                                    {validaciones.codigo.mensaje}
                                </p>
                            )}
                            {productoInicial && (
                                <p className="text-xs text-gray-500 mt-1">
                                    El código no se puede modificar
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
                                maxLength={100}
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                            <p className="text-xs text-gray-500 mt-1">Máximo 100 caracteres</p>
                        </div>

                        {/* Categoría */}
                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-2">
                                Categoría *
                            </label>
                            <select
                                name="categoria"
                                value={formData.categoria}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            >
                                <option value="">Seleccione una categoría</option>
                                {categorias.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.nombre}
                                    </option>
                                ))}
                            </select>
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