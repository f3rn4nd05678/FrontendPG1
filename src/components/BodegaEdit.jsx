import React, { useState, useEffect } from "react";
import { crearBodega, actualizarBodega, validarCodigoBodega } from "../api/userService";
import Loader from "./Loader";
import Alert from "./Alert";

const BodegaEdit = ({ bodega: bodegaInicial, onSubmit, onCancel }) => {
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState({ show: false, type: "", message: "" });

    const [formData, setFormData] = useState({
        codigo: "",
        nombre: "",
        direccion: "",
        telefono: "",
        responsable: "",
        activo: true,
    });

    const [validaciones, setValidaciones] = useState({
        codigo: { valido: true, mensaje: "", validando: false },
    });

    useEffect(() => {
        if (bodegaInicial) {
            setFormData({
                codigo: bodegaInicial.codigo || "",
                nombre: bodegaInicial.nombre || "",
                direccion: bodegaInicial.direccion || "",
                telefono: bodegaInicial.telefono || "",
                responsable: bodegaInicial.responsable || "",
                activo: bodegaInicial.activa !== undefined ? bodegaInicial.activa : true,
            });
        }
    }, [bodegaInicial]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const handleBlurCodigo = async () => {
        // Solo validar si hay código y estamos editando
        if (!formData.codigo.trim() || !bodegaInicial) return;

        setValidaciones(prev => ({
            ...prev,
            codigo: { valido: true, mensaje: "", validando: true }
        }));

        try {
            const response = await validarCodigoBodega({
                codigo: formData.codigo,
                excluirId: bodegaInicial?.id
            });

            const data = response?.data ?? response;
            const ok = data?.isSuccess ?? data?.success ?? false;

            setValidaciones(prev => ({
                ...prev,
                codigo: {
                    valido: ok,
                    mensaje: ok ? "" : "El código ya está en uso",
                    validando: false
                }
            }));
        } catch (error) {
            setValidaciones(prev => ({
                ...prev,
                codigo: {
                    valido: false,
                    mensaje: "Error al validar código",
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
                direccion: formData.direccion.trim(),
                telefono: formData.telefono.trim(),
                responsable: formData.responsable.trim(),
                activa: formData.activo,  // ⬅️ CAMBIAR activo por activa
            };

            // Si es edición, agregar ID y código
            if (bodegaInicial) {
                dataToSend.id = bodegaInicial.id;  // ⬅️ CAMBIAR idBodega por id
                dataToSend.codigo = formData.codigo.trim();
            }
            // Si es creación y hay código, agregarlo (sino se genera automático)
            else if (formData.codigo.trim()) {
                dataToSend.codigo = formData.codigo.trim();
            }

            let response;
            if (bodegaInicial) {
                response = await actualizarBodega(dataToSend);
            } else {
                response = await crearBodega(dataToSend);
            }

            const data = response?.data ?? response;
            const ok = data?.isSuccess ?? data?.success ?? false;

            if (ok) {
                setAlert({
                    show: true,
                    type: "success",
                    message: bodegaInicial ? "Bodega actualizada correctamente" : "Bodega creada correctamente"
                });
                setTimeout(() => {
                    onSubmit();  // Esto ya llama a cargarBodegas() en BodegaMain
                }, 1500);
            }
        } catch (error) {
            console.error("Error al guardar bodega:", error); 1
            setAlert({
                show: true,
                type: "error",
                message: error.response?.data?.message || "Error al guardar la bodega"
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
                    {bodegaInicial ? "Editar Bodega" : "Nueva Bodega"}
                </h1>
                <p className="text-gray-600 mt-2">
                    Complete el formulario con la información de la bodega
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
                                Código de la Bodega {!bodegaInicial && "(Se genera automáticamente)"}
                            </label>
                            <input
                                name="codigo"
                                type="text"
                                value={formData.codigo}
                                onChange={handleChange}
                                onBlur={handleBlurCodigo}
                                maxLength={20}
                                placeholder={!bodegaInicial ? "Se generará automáticamente" : ""}
                                disabled={!bodegaInicial}
                                className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 ${validaciones.codigo.validando
                                    ? "border-yellow-400 focus:ring-yellow-500"
                                    : validaciones.codigo.valido
                                        ? "border-gray-300 focus:ring-blue-500"
                                        : "border-red-500 focus:ring-red-500"
                                    } ${!bodegaInicial ? "bg-gray-100 cursor-not-allowed" : ""}`}
                            />
                            {validaciones.codigo.mensaje && (
                                <p className={`text-sm mt-1 ${validaciones.codigo.valido ? "text-green-600" : "text-red-600"}`}>
                                    {validaciones.codigo.mensaje}
                                </p>
                            )}
                            {!bodegaInicial && (
                                <p className="text-xs text-gray-500 mt-1">
                                    El código se asignará automáticamente al crear la bodega
                                </p>
                            )}
                        </div>

                        {/* Nombre */}
                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-2">
                                Nombre de la Bodega *
                            </label>
                            <input
                                name="nombre"
                                type="text"
                                value={formData.nombre}
                                onChange={handleChange}
                                maxLength={100}
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Ej: Bodega Central"
                                required
                            />
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
                                rows="3"
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Dirección completa de la bodega"
                            />
                        </div>

                        {/* Teléfono */}
                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-2">
                                Teléfono
                            </label>
                            <input
                                name="telefono"
                                type="text"
                                value={formData.telefono}
                                onChange={handleChange}
                                maxLength={20}
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Ej: 2345-6789"
                            />
                        </div>

                        {/* Responsable */}
                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-2">
                                Responsable
                            </label>
                            <input
                                name="responsable"
                                type="text"
                                value={formData.responsable}
                                onChange={handleChange}
                                maxLength={100}
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Nombre del responsable"
                            />
                        </div>

                        {/* Estado (solo en edición) */}
                        {bodegaInicial && (
                            <div className="md:col-span-2 flex items-center pt-2">
                                <input
                                    name="activo"
                                    type="checkbox"
                                    checked={formData.activo}
                                    onChange={handleChange}
                                    className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <label className="ml-2 block text-sm text-gray-700 font-medium">
                                    Bodega Activa
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
                        disabled={loading || !validaciones.codigo.valido}
                        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {bodegaInicial ? "Actualizar" : "Crear"} Bodega
                    </button>
                </div>
            </form>
        </div>
    );
};

export default BodegaEdit;