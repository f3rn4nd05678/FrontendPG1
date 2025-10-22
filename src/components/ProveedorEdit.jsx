import React, { useState, useEffect } from "react";
import { validarNombreProveedor } from "../api/userService";
import Loader from "./Loader";
import Alert from "./Alert";

const ProveedorEdit = ({ onSubmit, proveedor: proveedorInicial = null, onCancel }) => {
    const [formData, setFormData] = useState({
        nombre: "",
        contacto: "",
        nit: "",
        direccion: "",
        telefono: "",
        email: "",
        activo: true
    });

    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState({ show: false, type: "", message: "" });
    const [validaciones, setValidaciones] = useState({
        nombre: { validando: false, valido: true, mensaje: "" }
    });

    useEffect(() => {
        if (proveedorInicial) {
            setFormData({
                nombre: proveedorInicial.nombre || "",
                contacto: proveedorInicial.contacto || "",
                nit: proveedorInicial.nit || "",
                direccion: proveedorInicial.direccion || "",
                telefono: proveedorInicial.telefono || "",
                email: proveedorInicial.email || "",
                activo: proveedorInicial.activo !== undefined ? proveedorInicial.activo : true
            });
        }
    }, [proveedorInicial]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleBlurNombre = async (e) => {
        const nombre = e.target.value.trim();
        if (!nombre) {
            setValidaciones(prev => ({
                ...prev,
                nombre: { validando: false, valido: false, mensaje: "El nombre es obligatorio" }
            }));
            return;
        }

        setValidaciones(prev => ({
            ...prev,
            nombre: { validando: true, valido: true, mensaje: "Validando..." }
        }));

        try {
            const requestData = { nombre };
            if (proveedorInicial?.id) {
                requestData.idExcluir = proveedorInicial.id;
            }
            
            const response = await validarNombreProveedor(requestData);
            
            if (response.success && response.detail.existe) {
                setValidaciones(prev => ({
                    ...prev,
                    nombre: { 
                        validando: false, 
                        valido: false, 
                        mensaje: "Este nombre ya está en uso" 
                    }
                }));
            } else {
                setValidaciones(prev => ({
                    ...prev,
                    nombre: { 
                        validando: false, 
                        valido: true, 
                        mensaje: "✓ Nombre disponible" 
                    }
                }));
            }
        } catch (error) {
            console.error("Error al validar nombre:", error);
            setValidaciones(prev => ({
                ...prev,
                nombre: { 
                    validando: false, 
                    valido: true, 
                    mensaje: "" 
                }
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validaciones
        if (!formData.nombre.trim()) {
            setAlert({
                show: true,
                type: "error",
                message: "El nombre del proveedor es obligatorio"
            });
            return;
        }

        if (!validaciones.nombre.valido) {
            setAlert({
                show: true,
                type: "error",
                message: "El nombre del proveedor ya existe"
            });
            return;
        }

        // Validar email si está presente
        if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            setAlert({
                show: true,
                type: "error",
                message: "El formato del email no es válido"
            });
            return;
        }

        setLoading(true);
        try {
            // Preparar datos según el backend espera
            const dataToSend = {
                nombre: formData.nombre.trim(),
                contacto: formData.contacto.trim() || null,
                nit: formData.nit.trim() || null,
                direccion: formData.direccion.trim() || null,
                telefono: formData.telefono.trim() || null,
                email: formData.email.trim() || null
            };

            // Solo incluir activo si es actualización
            if (proveedorInicial) {
                dataToSend.activo = formData.activo;
            }

            await onSubmit(dataToSend);
        } catch (error) {
            setAlert({
                show: true,
                type: "error",
                message: error.message || "Error al guardar el proveedor"
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
                    {proveedorInicial ? "Editar Proveedor" : "Nuevo Proveedor"}
                </h1>
                <p className="text-gray-600 mt-2">
                    Complete el formulario con la información del proveedor
                </p>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
                {/* Información General */}
                <div className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
                        Información General
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Nombre */}
                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-2">
                                Nombre del Proveedor *
                            </label>
                            <input
                                name="nombre"
                                type="text"
                                value={formData.nombre}
                                onChange={handleChange}
                                onBlur={handleBlurNombre}
                                maxLength={100}
                                className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 ${
                                    validaciones.nombre.validando
                                        ? "border-yellow-400 focus:ring-yellow-500"
                                        : validaciones.nombre.valido
                                        ? "border-gray-300 focus:ring-blue-500"
                                        : "border-red-500 focus:ring-red-500"
                                }`}
                                required
                            />
                            {validaciones.nombre.mensaje && (
                                <p
                                    className={`text-sm mt-1 ${
                                        validaciones.nombre.valido ? "text-green-600" : "text-red-600"
                                    }`}
                                >
                                    {validaciones.nombre.mensaje}
                                </p>
                            )}
                            <p className="text-xs text-gray-500 mt-1">Máximo 100 caracteres</p>
                        </div>

                        {/* Contacto */}
                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-2">
                                Persona de Contacto
                            </label>
                            <input
                                name="contacto"
                                type="text"
                                value={formData.contacto}
                                onChange={handleChange}
                                maxLength={100}
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <p className="text-xs text-gray-500 mt-1">Máximo 100 caracteres</p>
                        </div>

                        {/* NIT */}
                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-2">
                                NIT
                            </label>
                            <input
                                name="nit"
                                type="text"
                                value={formData.nit}
                                onChange={handleChange}
                                maxLength={20}
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Ej: 12345678-9"
                            />
                            <p className="text-xs text-gray-500 mt-1">Máximo 20 caracteres</p>
                        </div>

                        {/* Teléfono */}
                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-2">
                                Teléfono
                            </label>
                            <input
                                name="telefono"
                                type="tel"
                                value={formData.telefono}
                                onChange={handleChange}
                                maxLength={20}
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Ej: 2345-6789"
                            />
                            <p className="text-xs text-gray-500 mt-1">Máximo 20 caracteres</p>
                        </div>

                        {/* Email */}
                        <div className="md:col-span-2">
                            <label className="block text-gray-700 text-sm font-medium mb-2">
                                Correo Electrónico
                            </label>
                            <input
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                maxLength={100}
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="ejemplo@correo.com"
                            />
                            <p className="text-xs text-gray-500 mt-1">Máximo 100 caracteres</p>
                        </div>

                        {/* Dirección */}
                        <div className="md:col-span-2">
                            <label className="block text-gray-700 text-sm font-medium mb-2">
                                Dirección
                            </label>
                            <textarea
                                name="direccion"
                                value={formData.direccion}
                                onChange={handleChange}
                                maxLength={200}
                                rows="3"
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Dirección completa del proveedor"
                            />
                            <p className="text-xs text-gray-500 mt-1">Máximo 200 caracteres</p>
                        </div>

                        {/* Estado (solo en edición) */}
                        {proveedorInicial && (
                            <div className="md:col-span-2 flex items-center pt-2">
                                <input
                                    name="activo"
                                    type="checkbox"
                                    checked={formData.activo}
                                    onChange={handleChange}
                                    className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <label className="ml-2 block text-sm text-gray-700 font-medium">
                                    Proveedor Activo
                                </label>
                            </div>
                        )}
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
                        disabled={!validaciones.nombre.valido || loading}
                        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {proveedorInicial ? "Actualizar" : "Crear"} Proveedor
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProveedorEdit;