import React, { useState, useEffect } from "react";
import { validarCorreoUsuario } from "../api/userService";
import { Info } from "lucide-react";
import Loader from "./Loader";
import Alert from "./Alert";

const UserEdit = ({ onSubmit, usuario: usuarioInicial = null, roles = [], onCancel }) => {
    const [formData, setFormData] = useState({
        nombre: "",
        correo: "",
        rolId: null,
        activo: true,
        forzarCambioPassword: false
    });

    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState({ show: false, type: "", message: "" });
    const [validaciones, setValidaciones] = useState({
        correo: { validando: false, valido: true, mensaje: "" }
    });

    useEffect(() => {
        if (usuarioInicial) {
            setFormData({
                nombre: usuarioInicial.nombre || "",
                correo: usuarioInicial.correo || "",
                rolId: usuarioInicial.rolId || null,
                activo: usuarioInicial.activo !== undefined ? usuarioInicial.activo : true,
                forzarCambioPassword: usuarioInicial.forzarCambioPassword || false
            });
        }
    }, [usuarioInicial]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : (name === "rolId" ? parseInt(value) : value),
        }));
    };

    const handleBlurCorreo = async (e) => {
        const correo = e.target.value.trim();
        if (!correo) {
            setValidaciones(prev => ({
                ...prev,
                correo: { validando: false, valido: false, mensaje: "El correo es obligatorio" }
            }));
            return;
        }

        // Validar formato de correo
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(correo)) {
            setValidaciones(prev => ({
                ...prev,
                correo: { validando: false, valido: false, mensaje: "El formato del correo no es válido" }
            }));
            return;
        }

        setValidaciones(prev => ({
            ...prev,
            correo: { validando: true, valido: true, mensaje: "Validando..." }
        }));

        try {
            const requestData = { correo };
            if (usuarioInicial?.id) {
                requestData.idExcluir = usuarioInicial.id;
            }

            const response = await validarCorreoUsuario(requestData);

            if (response.success && response.detail.existe) {
                setValidaciones(prev => ({
                    ...prev,
                    correo: {
                        validando: false,
                        valido: false,
                        mensaje: "Este correo ya está registrado"
                    }
                }));
            } else {
                setValidaciones(prev => ({
                    ...prev,
                    correo: {
                        validando: false,
                        valido: true,
                        mensaje: "Correo disponible"
                    }
                }));
            }
        } catch (error) {
            console.error("Error al validar correo:", error);
            setValidaciones(prev => ({
                ...prev,
                correo: {
                    validando: false,
                    valido: true,
                    mensaje: ""
                }
            }));
        }
    };

    const validarFormulario = () => {
        if (!formData.nombre.trim()) {
            setAlert({
                show: true,
                type: "error",
                message: "El nombre es obligatorio"
            });
            return false;
        }

        if (!formData.correo.trim()) {
            setAlert({
                show: true,
                type: "error",
                message: "El correo es obligatorio"
            });
            return false;
        }

        if (!validaciones.correo.valido) {
            setAlert({
                show: true,
                type: "error",
                message: "El correo no es válido o ya está registrado"
            });
            return false;
        }

        if (!formData.rolId) {
            setAlert({
                show: true,
                type: "error",
                message: "Debes seleccionar un rol"
            });
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validarFormulario()) {
            return;
        }

        setLoading(true);
        try {
            const datos = {
                nombre: formData.nombre.trim(),
                correo: formData.correo.trim().toLowerCase(),
                rolId: formData.rolId,
                activo: formData.activo,
                forzarCambioPassword: formData.forzarCambioPassword
            };

            await onSubmit(datos);
        } catch (error) {
            console.error("Error al guardar usuario:", error);
            setAlert({
                show: true,
                type: "error",
                message: error.response?.data?.message || "Error al guardar el usuario"
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
                    onClose={() => setAlert({ ...alert, show: false })}
                />
            )}

            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">
                        {usuarioInicial ? "Editar Usuario" : "Nuevo Usuario"}
                    </h1>
                    <p className="text-gray-600 mt-1">
                        {usuarioInicial
                            ? "Modifica la información del usuario"
                            : "Completa los datos para crear un nuevo usuario"}
                    </p>
                </div>

                {/* Mensaje informativo para nuevo usuario */}
                {!usuarioInicial && (
                    <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start">
                        <Info className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-blue-800">
                            <p className="font-medium mb-1">Generación automática de contraseña</p>
                            <p>
                                Se generará una contraseña temporal aleatoria que será enviada al correo electrónico del usuario.
                                El usuario deberá cambiarla en su primer inicio de sesión.
                            </p>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="space-y-6">
                        {/* Información básica */}
                        <div>
                            <h2 className="text-lg font-semibold text-gray-800 mb-4">
                                Información Personal
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Nombre Completo <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="nombre"
                                        value={formData.nombre}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Juan Pérez"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Correo Electrónico <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        name="correo"
                                        value={formData.correo}
                                        onChange={handleChange}
                                        onBlur={handleBlurCorreo}
                                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${validaciones.correo.validando
                                                ? "border-yellow-500 focus:ring-yellow-500"
                                                : validaciones.correo.valido && validaciones.correo.mensaje
                                                    ? "border-green-500 focus:ring-green-500"
                                                    : !validaciones.correo.valido
                                                        ? "border-red-500 focus:ring-red-500"
                                                        : "border-gray-300 focus:ring-blue-500"
                                            }`}
                                        placeholder="usuario@ejemplo.com"
                                        required
                                    />
                                    {validaciones.correo.mensaje && (
                                        <p
                                            className={`text-xs mt-1 ${validaciones.correo.validando
                                                    ? "text-yellow-600"
                                                    : validaciones.correo.valido
                                                        ? "text-green-600"
                                                        : "text-red-600"
                                                }`}
                                        >
                                            {validaciones.correo.mensaje}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Rol y permisos */}
                        <div>
                            <h2 className="text-lg font-semibold text-gray-800 mb-4">
                                Rol y Permisos
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Rol <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        name="rolId"
                                        value={formData.rolId || ""}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    >
                                        <option value="">Selecciona un rol</option>
                                        {roles.map((rol) => (
                                            <option key={rol.id} value={rol.id}>
                                                {rol.nombre}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Opciones adicionales */}
                        <div>
                            <h2 className="text-lg font-semibold text-gray-800 mb-4">
                                Opciones
                            </h2>
                            <div className="space-y-3">
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        name="activo"
                                        checked={formData.activo}
                                        onChange={handleChange}
                                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                    />
                                    <span className="ml-2 text-sm text-gray-700">
                                        Usuario activo
                                    </span>
                                </label>

                                {usuarioInicial && (
                                    <label className="flex items-center">
                                        <input
                                            type="checkbox"
                                            name="forzarCambioPassword"
                                            checked={formData.forzarCambioPassword}
                                            onChange={handleChange}
                                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                        />
                                        <span className="ml-2 text-sm text-gray-700">
                                            Forzar cambio de contraseña en el próximo inicio de sesión
                                        </span>
                                    </label>
                                )}
                            </div>
                        </div>

                        {/* Botones */}
                        <div className="flex gap-3 pt-4 border-t">
                            <button
                                type="button"
                                onClick={onCancel}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={loading || !validaciones.correo.valido}
                                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? "Guardando..." : usuarioInicial ? "Actualizar Usuario" : "Crear Usuario"}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserEdit;