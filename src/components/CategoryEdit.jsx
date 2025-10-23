import React, { useState, useEffect } from "react";
import { validarCodigoCategoria } from "../api/userService";
import Loader from "./Loader";
import Alert from "./Alert";

const CategoryEdit = ({ onSubmit, categoria: categoriaInicial = null, onCancel }) => {
    const [formData, setFormData] = useState({
        nombre: "",
        codigoPrefijo: "",
        descripcion: "",
        activo: true
    });

    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState({ show: false, type: "", message: "" });
    const [validaciones, setValidaciones] = useState({
        codigoPrefijo: { validando: false, valido: true, mensaje: "" }
    });
    const [touched, setTouched] = useState({});

    useEffect(() => {
        if (categoriaInicial) {
            setFormData({
                nombre: categoriaInicial.nombre || "",
                codigoPrefijo: categoriaInicial.codigoPrefijo || "",
                descripcion: categoriaInicial.descripcion || "",
                activo: categoriaInicial.activo ?? true
            });
        }
    }, [categoriaInicial]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        let newValue = value;
        if (name === "codigoPrefijo") {
            // Convertir a mayúsculas y solo letras
            newValue = value.toUpperCase().replace(/[^A-Z]/g, '');
        }

        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : newValue,
        }));

        setTouched(prev => ({ ...prev, [name]: true }));

        // Validar código prefijo en tiempo real
        if (name === "codigoPrefijo" && newValue.length >= 3) {
            validarCodigoPrefijo(newValue);
        }
    };

    const handleBlur = (e) => {
        const { name } = e.target;
        setTouched(prev => ({ ...prev, [name]: true }));
    };

    const validarCodigoPrefijo = async (codigo) => {
        if (!codigo || (categoriaInicial && categoriaInicial.codigoPrefijo === codigo)) {
            setValidaciones(prev => ({
                ...prev,
                codigoPrefijo: { validando: false, valido: true, mensaje: "" }
            }));
            return;
        }

        setValidaciones(prev => ({
            ...prev,
            codigoPrefijo: { ...prev.codigoPrefijo, validando: true, mensaje: "Validando..." }
        }));

        try {
            const response = await validarCodigoCategoria(
                codigo,
                categoriaInicial?.id || null
            );

            if (response.isSuccess) {
                const existe = response.detail?.existe || false;
                setValidaciones(prev => ({
                    ...prev,
                    codigoPrefijo: {
                        validando: false,
                        valido: !existe,
                        mensaje: existe ? "Este código ya está en uso" : "Código disponible"
                    }
                }));
            }
        } catch (error) {
            console.error("Error al validar código:", error);
            setValidaciones(prev => ({
                ...prev,
                codigoPrefijo: {
                    validando: false,
                    valido: true,
                    mensaje: "Error al validar el código"
                }
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Marcar todos como tocados
        setTouched({
            nombre: true,
            codigoPrefijo: true
        });

        if (!isFormValid()) {
            setAlert({
                show: true,
                type: "error",
                message: "Por favor complete todos los campos obligatorios correctamente"
            });
            return;
        }

        setLoading(true);

        try {
            await onSubmit(formData);

            if (!categoriaInicial) {
                // Resetear formulario
                setFormData({
                    nombre: "",
                    codigoPrefijo: "",
                    descripcion: "",
                    activo: true
                });
                setTouched({});
                setValidaciones({
                    codigoPrefijo: { validando: false, valido: true, mensaje: "" }
                });
            }
        } catch (error) {
            setAlert({
                show: true,
                type: "error",
                message: error.message || "Error al guardar la categoría"
            });
        } finally {
            setLoading(false);
        }
    };

    const isFormValid = () => {
        const camposObligatorios =
            formData.nombre?.trim() &&
            formData.codigoPrefijo?.trim() &&
            formData.codigoPrefijo.length >= 3;

        const validacionesOk =
            validaciones.codigoPrefijo.valido &&
            !validaciones.codigoPrefijo.validando;

        return camposObligatorios && validacionesOk;
    };

    const getFieldClass = (fieldName, isValid = true) => {
        const baseClass = "w-full p-3 border rounded-lg focus:outline-none focus:ring-2 transition-all";

        if (!touched[fieldName]) {
            return `${baseClass} border-gray-300 focus:ring-blue-500`;
        }

        if (!isValid) {
            return `${baseClass} border-red-500 focus:ring-red-500 bg-red-50`;
        }

        return `${baseClass} border-gray-300 focus:ring-blue-500`;
    };

    return (
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6">
            {loading && <Loader fullScreen />}
            {alert.show && (
                <Alert
                    type={alert.type}
                    message={alert.message}
                    onClose={() => setAlert({ show: false, type: "", message: "" })}
                />
            )}

            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900">
                        {categoriaInicial ? "Editar Categoría" : "Nueva Categoría"}
                    </h1>
                    <p className="text-gray-600 mt-3 text-lg">
                        Los campos marcados con <span className="text-red-600 font-semibold">*</span> son obligatorios
                    </p>
                </div>

                {/* Formulario */}
                <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8">

                    <div className="mb-10">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-6 pb-3 border-b-2 border-blue-500">
                            Información de la Categoría
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                            {/* Código Prefijo */}
                            <div>
                                <label className="block text-gray-700 text-sm font-medium mb-2">
                                    Código Prefijo <span className="text-red-600">*</span>
                                </label>
                                <input
                                    name="codigoPrefijo"
                                    type="text"
                                    value={formData.codigoPrefijo}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    maxLength={10}
                                    className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${validaciones.codigoPrefijo.validando
                                            ? "border-yellow-400 focus:ring-yellow-500"
                                            : touched.codigoPrefijo && !formData.codigoPrefijo?.trim()
                                                ? "border-red-500 focus:ring-red-500 bg-red-50"
                                                : !validaciones.codigoPrefijo.valido && formData.codigoPrefijo?.trim()
                                                    ? "border-red-500 focus:ring-red-500 bg-red-50"
                                                    : validaciones.codigoPrefijo.valido && formData.codigoPrefijo?.trim() && validaciones.codigoPrefijo.mensaje
                                                        ? "border-green-500 focus:ring-green-500"
                                                        : "border-gray-300 focus:ring-blue-500"
                                        }`}
                                    placeholder="Ej: ELE, HOG, OFI"
                                    required
                                />
                                {validaciones.codigoPrefijo.mensaje && (
                                    <p className={`text-xs mt-1 ${validaciones.codigoPrefijo.validando ? "text-yellow-600" :
                                            validaciones.codigoPrefijo.valido ? "text-green-600" : "text-red-600"
                                        }`}>
                                        {validaciones.codigoPrefijo.mensaje}
                                    </p>
                                )}
                                {touched.codigoPrefijo && !formData.codigoPrefijo?.trim() && !validaciones.codigoPrefijo.mensaje && (
                                    <p className="text-xs text-red-600 mt-1">Este campo es obligatorio</p>
                                )}
                                <p className="text-xs text-gray-500 mt-1">
                                    Solo letras mayúsculas, mínimo 3 caracteres (se usa en códigos de productos)
                                </p>
                            </div>

                            {/* Nombre */}
                            <div>
                                <label className="block text-gray-700 text-sm font-medium mb-2">
                                    Nombre de la Categoría <span className="text-red-600">*</span>
                                </label>
                                <input
                                    name="nombre"
                                    type="text"
                                    value={formData.nombre}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    maxLength={100}
                                    className={getFieldClass('nombre', formData.nombre?.trim())}
                                    placeholder="Ej: Electrónica, Hogar, Oficina"
                                    required
                                />
                                {touched.nombre && !formData.nombre?.trim() && (
                                    <p className="text-xs text-red-600 mt-1">Este campo es obligatorio</p>
                                )}
                            </div>

                            {/* Descripción */}
                            <div className="md:col-span-2">
                                <label className="block text-gray-700 text-sm font-medium mb-2">
                                    Descripción
                                </label>
                                <textarea
                                    name="descripcion"
                                    value={formData.descripcion}
                                    onChange={handleChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    rows="3"
                                    maxLength={500}
                                    placeholder="Descripción opcional de la categoría (máximo 500 caracteres)"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    {formData.descripcion.length}/500 caracteres
                                </p>
                            </div>

                            {/* Estado (solo en edición) */}
                            {categoriaInicial && (
                                <div className="md:col-span-2">
                                    <label className="flex items-center cursor-pointer">
                                        <input
                                            name="activo"
                                            type="checkbox"
                                            checked={formData.activo}
                                            onChange={handleChange}
                                            className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                        />
                                        <span className="ml-3 text-gray-700 font-medium">
                                            Categoría activa
                                        </span>
                                    </label>
                                    <p className="text-xs text-gray-500 mt-1 ml-8">
                                        Las categorías inactivas no aparecerán en los listados de productos
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Botones de Acción */}
                    <div className="flex justify-end gap-4 pt-8 border-t-2 border-gray-200">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="px-8 py-3 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-gray-400"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={!isFormValid() || loading}
                            className={`px-8 py-3 bg-blue-600 text-white rounded-lg transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 ${!isFormValid() || loading
                                    ? "opacity-50 cursor-not-allowed"
                                    : "hover:bg-blue-700 shadow-lg hover:shadow-xl"
                                }`}
                            title={!isFormValid() ? "Complete los campos obligatorios" : ""}
                        >
                            {loading ? (
                                <div className="flex items-center">
                                    <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    <span>{categoriaInicial ? "Actualizando..." : "Guardando..."}</span>
                                </div>
                            ) : (
                                <span>{categoriaInicial ? "Actualizar Categoría" : "Guardar Categoría"}</span>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CategoryEdit;