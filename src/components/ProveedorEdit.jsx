import React, { useState, useEffect } from "react";
import Loader from "./Loader";
import Alert from "./Alert";

const ProveedorEdit = ({ onSubmit, proveedor: proveedorInicial = null, onCancel }) => {
    const [formData, setFormData] = useState({
        nombre: "",
        contacto: "",
    });

    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState({ show: false, type: "", message: "" });
    const [errores, setErrores] = useState({});

    useEffect(() => {
        if (proveedorInicial) {
            setFormData({
                nombre: proveedorInicial.nombre || "",
                contacto: proveedorInicial.contacto || "",
            });
        }
    }, [proveedorInicial]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        
        // Limpiar error del campo
        if (errores[name]) {
            setErrores((prev) => ({ ...prev, [name]: "" }));
        }
    };

    const validarFormulario = () => {
        const nuevosErrores = {};

        if (!formData.nombre.trim()) {
            nuevosErrores.nombre = "El nombre es obligatorio";
        }

        setErrores(nuevosErrores);
        return Object.keys(nuevosErrores).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validarFormulario()) {
            setAlert({
                show: true,
                type: "error",
                message: "Por favor completa todos los campos obligatorios",
            });
            return;
        }

        setLoading(true);
        try {
            await onSubmit(formData);
        } catch (error) {
            console.error("Error al guardar:", error);
            setAlert({
                show: true,
                type: "error",
                message: "Error al guardar el proveedor",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full">
            {loading && <Loader />}
            {alert.show && (
                <Alert
                    type={alert.type}
                    message={alert.message}
                    onClose={() => setAlert({ show: false, type: "", message: "" })}
                />
            )}

            <div className="bg-white rounded-lg shadow-md p-6">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">
                        {proveedorInicial ? "Editar Proveedor" : "Nuevo Proveedor"}
                    </h2>
                    <button
                        onClick={onCancel}
                        className="text-gray-600 hover:text-gray-800"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Formulario */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Nombre */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Nombre del Proveedor <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="nombre"
                                value={formData.nombre}
                                onChange={handleChange}
                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                    errores.nombre ? "border-red-500" : "border-gray-300"
                                }`}
                                placeholder="Ingrese el nombre del proveedor"
                            />
                            {errores.nombre && (
                                <p className="text-red-500 text-sm mt-1">{errores.nombre}</p>
                            )}
                        </div>

                        {/* Contacto */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Contacto
                            </label>
                            <input
                                type="text"
                                name="contacto"
                                value={formData.contacto}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Nombre del contacto o teléfono"
                            />
                        </div>
                    </div>

                    {/* Botones de Acción */}
                    <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? "Guardando..." : "Guardar"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProveedorEdit;