import React, { useState, useEffect } from "react";
import { crearBodega, actualizarBodega, validarNombreBodega } from "../api/bodegaService";
import { X } from "lucide-react";

const BodegaForm = ({ bodega, modo, onClose, onSuccess }) => {
    const esVista = modo === "ver";
    const esEdicion = modo === "editar";

    const [formData, setFormData] = useState({
        nombre: "",
        direccion: "",
        responsable: "",
        telefono: "",
        capacidadM3: "",
        activa: true
    });

    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (bodega) {
            setFormData({
                nombre: bodega.nombre || "",
                direccion: bodega.direccion || "",
                responsable: bodega.responsable || "",
                telefono: bodega.telefono || "",
                capacidadM3: bodega.capacidadM3 || "",
                activa: bodega.activa ?? true
            });
        }
    }, [bodega]);

    const validarFormulario = async () => {
        const newErrors = {};

        // Nombre requerido
        if (!formData.nombre.trim()) {
            newErrors.nombre = "El nombre es obligatorio";
        } else if (formData.nombre.length > 100) {
            newErrors.nombre = "El nombre no puede exceder 100 caracteres";
        } else {
            // Validar unicidad del nombre
            try {
                const response = await validarNombreBodega(
                    formData.nombre,
                    esEdicion ? bodega.id : null
                );
                if (response.data.existe) {
                    newErrors.nombre = "Ya existe una bodega con este nombre";
                }
            } catch (err) {
                console.error("Error al validar nombre:", err);
            }
        }

        // Dirección opcional pero con límite
        if (formData.direccion && formData.direccion.length > 200) {
            newErrors.direccion = "La dirección no puede exceder 200 caracteres";
        }

        // Responsable opcional pero con límite
        if (formData.responsable && formData.responsable.length > 100) {
            newErrors.responsable = "El responsable no puede exceder 100 caracteres";
        }

        // Teléfono opcional pero con formato básico
        if (formData.telefono) {
            if (formData.telefono.length > 20) {
                newErrors.telefono = "El teléfono no puede exceder 20 caracteres";
            }
            // Formato básico: solo números, guiones y espacios
            if (!/^[\d\s\-()]+$/.test(formData.telefono)) {
                newErrors.telefono = "Formato de teléfono inválido";
            }
        }

        // Capacidad opcional pero debe ser positiva
        if (formData.capacidadM3) {
            const capacidad = parseFloat(formData.capacidadM3);
            if (isNaN(capacidad) || capacidad <= 0) {
                newErrors.capacidadM3 = "La capacidad debe ser un número positivo";
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (esVista) {
            onClose();
            return;
        }

        if (!(await validarFormulario())) {
            return;
        }

        setSubmitting(true);
        try {
            const bodegaData = {
                nombre: formData.nombre.trim(),
                direccion: formData.direccion.trim() || null,
                responsable: formData.responsable.trim() || null,
                telefono: formData.telefono.trim() || null,
                capacidadM3: formData.capacidadM3 ? parseFloat(formData.capacidadM3) : null,
                activa: formData.activa
            };

            if (esEdicion) {
                await actualizarBodega(bodega.id, bodegaData);
                alert("Bodega actualizada correctamente");
            } else {
                await crearBodega(bodegaData);
                alert("Bodega creada correctamente");
            }

            onSuccess();
        } catch (err) {
            const mensaje = err.response?.data?.message || err.message || "Error desconocido";
            alert(`Error: ${mensaje}`);
        } finally {
            setSubmitting(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));

        // Limpiar error del campo al escribir
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-800">
                        {modo === "crear" && "Nueva Bodega"}
                        {modo === "editar" && "Editar Bodega"}
                        {modo === "ver" && "Detalles de Bodega"}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Nombre */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Nombre <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="nombre"
                            value={formData.nombre}
                            onChange={handleChange}
                            disabled={esVista}
                            className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.nombre ? 'border-red-500' : 'border-gray-300'
                                } ${esVista ? 'bg-gray-50' : ''}`}
                            placeholder="Ej: Bodega Central"
                        />
                        {errors.nombre && (
                            <p className="mt-1 text-sm text-red-600">{errors.nombre}</p>
                        )}
                    </div>

                    {/* Dirección */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Dirección
                        </label>
                        <input
                            type="text"
                            name="direccion"
                            value={formData.direccion}
                            onChange={handleChange}
                            disabled={esVista}
                            className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.direccion ? 'border-red-500' : 'border-gray-300'
                                } ${esVista ? 'bg-gray-50' : ''}`}
                            placeholder="Ej: Zona 1, Ciudad de Guatemala"
                        />
                        {errors.direccion && (
                            <p className="mt-1 text-sm text-red-600">{errors.direccion}</p>
                        )}
                    </div>

                    {/* Responsable y Teléfono en fila */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Responsable
                            </label>
                            <input
                                type="text"
                                name="responsable"
                                value={formData.responsable}
                                onChange={handleChange}
                                disabled={esVista}
                                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.responsable ? 'border-red-500' : 'border-gray-300'
                                    } ${esVista ? 'bg-gray-50' : ''}`}
                                placeholder="Ej: Juan Pérez"
                            />
                            {errors.responsable && (
                                <p className="mt-1 text-sm text-red-600">{errors.responsable}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Teléfono
                            </label>
                            <input
                                type="text"
                                name="telefono"
                                value={formData.telefono}
                                onChange={handleChange}
                                disabled={esVista}
                                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.telefono ? 'border-red-500' : 'border-gray-300'
                                    } ${esVista ? 'bg-gray-50' : ''}`}
                                placeholder="Ej: 2345-6789"
                            />
                            {errors.telefono && (
                                <p className="mt-1 text-sm text-red-600">{errors.telefono}</p>
                            )}
                        </div>
                    </div>

                    {/* Capacidad */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Capacidad (m³)
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            name="capacidadM3"
                            value={formData.capacidadM3}
                            onChange={handleChange}
                            disabled={esVista}
                            className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.capacidadM3 ? 'border-red-500' : 'border-gray-300'
                                } ${esVista ? 'bg-gray-50' : ''}`}
                            placeholder="Ej: 1000.50"
                        />
                        {errors.capacidadM3 && (
                            <p className="mt-1 text-sm text-red-600">{errors.capacidadM3}</p>
                        )}
                    </div>

                    {/* Estado (solo en edición) */}
                    {(esEdicion || esVista) && (
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                name="activa"
                                checked={formData.activa}
                                onChange={handleChange}
                                disabled={esVista}
                                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                            />
                            <label className="text-sm font-medium text-gray-700">
                                Bodega activa
                            </label>
                        </div>
                    )}

                    {/* Botones */}
                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition"
                        >
                            {esVista ? "Cerrar" : "Cancelar"}
                        </button>
                        {!esVista && (
                            <button
                                type="submit"
                                disabled={submitting}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {submitting
                                    ? "Guardando..."
                                    : esEdicion ? "Actualizar" : "Crear"
                                }
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BodegaForm;