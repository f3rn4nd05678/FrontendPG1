import React, { useState, useEffect } from "react";
import { validarCorreoUsuario } from "../api/userService";
import Loader from "./Loader";
import Alert from "./Alert";

const UserEdit = ({ onSubmit, usuario: usuarioInicial = null, roles = [], onCancel }) => {
    const [formData, setFormData] = useState({
        nombre: "",
        correo: "",
        password: "",
        confirmarPassword: "",
        rolId: null,
        activo: true,
        forzarCambioPassword: false
    });

    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState({ show: false, type: "", message: "" });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [validaciones, setValidaciones] = useState({
        correo: { validando: false, valido: true, mensaje: "" },
        password: { valido: true, mensaje: "" }
    });

    useEffect(() => {
        if (usuarioInicial) {
            setFormData({
                nombre: usuarioInicial.nombre || "",
                correo: usuarioInicial.correo || "",
                password: "",
                confirmarPassword: "",
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

        // Validar password en tiempo real
        if (name === "password" || name === "confirmarPassword") {
            validarPasswordsCoinciden(
                name === "password" ? value : formData.password,
                name === "confirmarPassword" ? value : formData.confirmarPassword
            );
        }
    };

    const validarPasswordsCoinciden = (password, confirmar) => {
        if (confirmar && password !== confirmar) {
            setValidaciones(prev => ({
                ...prev,
                password: {
                    valido: false,
                    mensaje: "Las contraseñas no coinciden"
                }
            }));
        } else {
            setValidaciones(prev => ({
                ...prev,
                password: {
                    valido: true,
                    mensaje: ""
                }
            }));
        }
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
        // Validar campos obligatorios
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

        if (!formData.rolId) {
            setAlert({
                show: true,
                type: "error",
                message: "Debe seleccionar un rol"
            });
            return false;
        }

        // Validar correo
        if (!validaciones.correo.valido) {
            setAlert({
                show: true,
                type: "error",
                message: validaciones.correo.mensaje || "El correo no es válido"
            });
            return false;
        }

        // Validar password solo si es usuario nuevo o si se está cambiando
        if (!usuarioInicial) {
            if (!formData.password) {
                setAlert({
                    show: true,
                    type: "error",
                    message: "La contraseña es obligatoria"
                });
                return false;
            }

            if (formData.password.length < 6) {
                setAlert({
                    show: true,
                    type: "error",
                    message: "La contraseña debe tener al menos 6 caracteres"
                });
                return false;
            }

            if (formData.password !== formData.confirmarPassword) {
                setAlert({
                    show: true,
                    type: "error",
                    message: "Las contraseñas no coinciden"
                });
                return false;
            }
        } else if (formData.password) {
            // Si es edición y se está cambiando la contraseña
            if (formData.password.length < 6) {
                setAlert({
                    show: true,
                    type: "error",
                    message: "La contraseña debe tener al menos 6 caracteres"
                });
                return false;
            }

            if (formData.password !== formData.confirmarPassword) {
                setAlert({
                    show: true,
                    type: "error",
                    message: "Las contraseñas no coinciden"
                });
                return false;
            }
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

            // Solo incluir password si es nuevo usuario o si se está cambiando
            if (!usuarioInicial || formData.password) {
                datos.password = formData.password;
            }

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
                            ? "Modifica los datos del usuario"
                            : "Completa el formulario para crear un nuevo usuario"}
                    </p>
                </div>

                {/* Formulario */}
                <form onSubmit={handleSubmit}>
                    <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
                        {/* Información básica */}
                        <div>
                            <h2 className="text-lg font-semibold text-gray-800 mb-4">
                                Información Básica
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
                                        placeholder="Ingresa el nombre completo"
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

                        {/* Contraseña */}
                        <div>
                            <h2 className="text-lg font-semibold text-gray-800 mb-4">
                                {usuarioInicial ? "Cambiar Contraseña (Opcional)" : "Contraseña"}
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Contraseña {!usuarioInicial && <span className="text-red-500">*</span>}
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder={usuarioInicial ? "Dejar vacío para mantener" : "Mínimo 6 caracteres"}
                                            required={!usuarioInicial}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                        >
                                            {showPassword ? (
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                                </svg>
                                            ) : (
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Confirmar Contraseña {!usuarioInicial && <span className="text-red-500">*</span>}
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            name="confirmarPassword"
                                            value={formData.confirmarPassword}
                                            onChange={handleChange}
                                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${!validaciones.password.valido
                                                    ? "border-red-500 focus:ring-red-500"
                                                    : "border-gray-300 focus:ring-blue-500"
                                                }`}
                                            placeholder="Confirma la contraseña"
                                            required={!usuarioInicial || formData.password}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                        >
                                            {showConfirmPassword ? (
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                                </svg>
                                            ) : (
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                    {!validaciones.password.valido && (
                                        <p className="text-xs text-red-600 mt-1">
                                            {validaciones.password.mensaje}
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
                                disabled={loading || !validaciones.correo.valido || !validaciones.password.valido}
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