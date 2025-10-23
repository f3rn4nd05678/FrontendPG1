import React, { useState, useEffect } from "react";
import { validarNit } from "../api/userService";
import Loader from "./Loader";
import Alert from "./Alert";

const ClientEdit = ({ onSubmit, cliente: clienteInicial = null, onCancel }) => {
    const [formData, setFormData] = useState({
        tipoCliente: "Regular",
        nombre: "",
        nombreExtranjero: "",
        grupo: "",
        moneda: "GTQ",
        nit: "",
        direccion: "",
        telefono1: "",
        telefono2: "",
        telefonoMovil: "",
        fax: "",
        correoElectronico: "",
        sitioWeb: "",
        limiteCredito: 0,
        diasCredito: 30,
        descuentoPorcentaje: 0,
        bloquearMarketing: false,
        observaciones1: "",
    });

    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState({ show: false, type: "", message: "" });
    const [validaciones, setValidaciones] = useState({
        nit: { validando: false, valido: true, mensaje: "" },
    });
    const [touched, setTouched] = useState({});

    useEffect(() => {
        if (clienteInicial) {
            setFormData(prev => ({ ...prev, ...clienteInicial }));
        }
    }, [clienteInicial]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));

        // Marcar el campo como "tocado"
        setTouched(prev => ({ ...prev, [name]: true }));

        if (name === "nit" && value.trim().length > 5) {
            validarNitCliente(value);
        }
    };

    const handleBlur = (e) => {
        const { name } = e.target;
        setTouched(prev => ({ ...prev, [name]: true }));
    };

    const validarNitCliente = async (nit) => {
        if (!nit || clienteInicial?.nit === nit) return;

        setValidaciones(prev => ({
            ...prev,
            nit: { ...prev.nit, validando: true, mensaje: "Validando NIT..." }
        }));

        try {
            const response = await validarNit({ nit });
            setValidaciones(prev => ({
                ...prev,
                nit: {
                    validando: false,
                    valido: response.detail.disponible,
                    mensaje: response.detail.mensaje
                }
            }));
        } catch (error) {
            setValidaciones(prev => ({
                ...prev,
                nit: { validando: false, valido: false, mensaje: "Error al validar el NIT" }
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Marcar todos los campos como tocados
        setTouched({
            nombre: true,
            nit: true,
            telefono1: true,
            correoElectronico: true,
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
            setAlert({
                show: true,
                type: "success",
                message: clienteInicial ? "Cliente actualizado exitosamente" : "Cliente creado exitosamente"
            });

            if (!clienteInicial) {
                // Resetear formulario
                setFormData({
                    tipoCliente: "Regular",
                    nombre: "",
                    nombreExtranjero: "",
                    grupo: "",
                    moneda: "GTQ",
                    nit: "",
                    direccion: "",
                    telefono1: "",
                    telefono2: "",
                    telefonoMovil: "",
                    fax: "",
                    correoElectronico: "",
                    sitioWeb: "",
                    limiteCredito: 0,
                    diasCredito: 30,
                    descuentoPorcentaje: 0,
                    bloquearMarketing: false,
                    observaciones1: "",
                });
                setTouched({});
                setValidaciones({
                    nit: { validando: false, valido: true, mensaje: "" }
                });
            }
        } catch (error) {
            console.error("Error al guardar cliente:", error);
            setAlert({
                show: true,
                type: "error",
                message: error.response?.data?.message || "Error al guardar el cliente"
            });
        } finally {
            setLoading(false);
        }
    };

    const isFormValid = () => {
        const camposObligatorios =
            formData.nombre?.trim() &&
            formData.nit?.trim() &&
            formData.correoElectronico?.trim() &&
            formData.telefono1?.trim();

        const validacionesOk =
            validaciones.nit.valido &&
            !validaciones.nit.validando;

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
        <div className="h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
            {loading && <Loader />}
            {alert.show && (
                <Alert
                    type={alert.type}
                    message={alert.message}
                    onClose={() => setAlert({ show: false, type: "", message: "" })}
                />
            )}

            <div className="w-auto mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900">
                        {clienteInicial ? "Editar Cliente" : "Nuevo Cliente"}
                    </h1>
                    <p className="text-gray-600 mt-3 text-lg">
                        Los campos marcados con <span className="text-red-600 font-semibold">*</span> son obligatorios
                    </p>
                </div>

                {/* Formulario */}
                <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8">

                    {/* Sección: Información Básica */}
                    <div className="mb-10">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-6 pb-3 border-b-2 border-blue-500">
                            Información Básica
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                            {/* Código - Solo lectura */}
                            <div>
                                <label className="block text-gray-700 text-sm font-medium mb-2">
                                    Código del Cliente
                                </label>
                                <input
                                    type="text"
                                    value={clienteInicial?.codigo || "Se generará automáticamente"}
                                    className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
                                    disabled
                                    readOnly
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    {clienteInicial ? "El código no se puede modificar" : "El código se asigna automáticamente"}
                                </p>
                            </div>

                            {/* Tipo de Cliente */}
                            <div>
                                <label className="block text-gray-700 text-sm font-medium mb-2">
                                    Tipo de Cliente <span className="text-red-600">*</span>
                                </label>
                                <select
                                    name="tipoCliente"
                                    value={formData.tipoCliente}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                >
                                    <option value="Regular">Regular</option>
                                    <option value="VIP">VIP</option>
                                    <option value="Corporativo">Corporativo</option>
                                </select>
                            </div>

                            {/* Nombre */}
                            <div>
                                <label className="block text-gray-700 text-sm font-medium mb-2">
                                    Nombre <span className="text-red-600">*</span>
                                </label>
                                <input
                                    name="nombre"
                                    type="text"
                                    value={formData.nombre}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className={getFieldClass('nombre', formData.nombre?.trim())}
                                    placeholder="Ingrese el nombre del cliente"
                                    required
                                />
                                {touched.nombre && !formData.nombre?.trim() && (
                                    <p className="text-xs text-red-600 mt-1">Este campo es obligatorio</p>
                                )}
                            </div>

                            {/* NIT */}
                            <div>
                                <label className="block text-gray-700 text-sm font-medium mb-2">
                                    NIT <span className="text-red-600">*</span>
                                </label>
                                <input
                                    name="nit"
                                    type="text"
                                    value={formData.nit}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${validaciones.nit.validando
                                            ? "border-yellow-400 focus:ring-yellow-500"
                                            : touched.nit && !formData.nit?.trim()
                                                ? "border-red-500 focus:ring-red-500 bg-red-50"
                                                : !validaciones.nit.valido && formData.nit?.trim()
                                                    ? "border-red-500 focus:ring-red-500 bg-red-50"
                                                    : validaciones.nit.valido && formData.nit?.trim() && validaciones.nit.mensaje
                                                        ? "border-green-500 focus:ring-green-500"
                                                        : "border-gray-300 focus:ring-blue-500"
                                        }`}
                                    placeholder="Ingrese el NIT"
                                    required
                                />
                                {validaciones.nit.mensaje && (
                                    <p className={`text-xs mt-1 ${validaciones.nit.validando ? "text-yellow-600" :
                                            validaciones.nit.valido ? "text-green-600" : "text-red-600"
                                        }`}>
                                        {validaciones.nit.mensaje}
                                    </p>
                                )}
                                {touched.nit && !formData.nit?.trim() && !validaciones.nit.mensaje && (
                                    <p className="text-xs text-red-600 mt-1">Este campo es obligatorio</p>
                                )}
                            </div>

                            {/* Nombre Extranjero */}
                            <div>
                                <label className="block text-gray-700 text-sm font-medium mb-2">
                                    Nombre Extranjero
                                </label>
                                <input
                                    name="nombreExtranjero"
                                    type="text"
                                    value={formData.nombreExtranjero}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Opcional"
                                />
                            </div>

                            {/* Grupo */}
                            <div>
                                <label className="block text-gray-700 text-sm font-medium mb-2">
                                    Grupo
                                </label>
                                <input
                                    name="grupo"
                                    type="text"
                                    value={formData.grupo}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Opcional"
                                />
                            </div>

                            {/* Moneda */}
                            <div>
                                <label className="block text-gray-700 text-sm font-medium mb-2">
                                    Moneda <span className="text-red-600">*</span>
                                </label>
                                <select
                                    name="moneda"
                                    value={formData.moneda}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                >
                                    <option value="GTQ">GTQ - Quetzales</option>
                                    <option value="USD">USD - Dólares</option>
                                    <option value="EUR">EUR - Euros</option>
                                </select>
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
                                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    rows="2"
                                    placeholder="Dirección completa (opcional)"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Sección: Información de Contacto */}
                    <div className="mb-10">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-6 pb-3 border-b-2 border-green-500">
                            Información de Contacto
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                            <div>
                                <label className="block text-gray-700 text-sm font-medium mb-2">
                                    Teléfono 1 <span className="text-red-600">*</span>
                                </label>
                                <input
                                    name="telefono1"
                                    type="tel"
                                    value={formData.telefono1}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className={getFieldClass('telefono1', formData.telefono1?.trim())}
                                    placeholder="Ej: 2345-6789"
                                    required
                                />
                                {touched.telefono1 && !formData.telefono1?.trim() && (
                                    <p className="text-xs text-red-600 mt-1">Este campo es obligatorio</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-gray-700 text-sm font-medium mb-2">
                                    Teléfono 2
                                </label>
                                <input
                                    name="telefono2"
                                    type="tel"
                                    value={formData.telefono2}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Opcional"
                                />
                            </div>

                            <div>
                                <label className="block text-gray-700 text-sm font-medium mb-2">
                                    Teléfono Móvil
                                </label>
                                <input
                                    name="telefonoMovil"
                                    type="tel"
                                    value={formData.telefonoMovil}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Ej: 5678-1234"
                                />
                            </div>

                            <div>
                                <label className="block text-gray-700 text-sm font-medium mb-2">
                                    Correo Electrónico <span className="text-red-600">*</span>
                                </label>
                                <input
                                    name="correoElectronico"
                                    type="email"
                                    value={formData.correoElectronico}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className={getFieldClass('correoElectronico', formData.correoElectronico?.trim())}
                                    placeholder="ejemplo@correo.com"
                                    required
                                />
                                {touched.correoElectronico && !formData.correoElectronico?.trim() && (
                                    <p className="text-xs text-red-600 mt-1">Este campo es obligatorio</p>
                                )}
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-gray-700 text-sm font-medium mb-2">
                                    Sitio Web
                                </label>
                                <input
                                    name="sitioWeb"
                                    type="url"
                                    value={formData.sitioWeb}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="https://ejemplo.com"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Sección: Información Financiera */}
                    <div className="mb-10">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-6 pb-3 border-b-2 border-purple-500">
                            Información Financiera
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                            <div>
                                <label className="block text-gray-700 text-sm font-medium mb-2">
                                    Límite de Crédito (Q)
                                </label>
                                <input
                                    name="limiteCredito"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={formData.limiteCredito}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="0.00"
                                />
                            </div>

                            <div>
                                <label className="block text-gray-700 text-sm font-medium mb-2">
                                    Días de Crédito
                                </label>
                                <input
                                    name="diasCredito"
                                    type="number"
                                    min="0"
                                    value={formData.diasCredito}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="30"
                                />
                            </div>

                            <div>
                                <label className="block text-gray-700 text-sm font-medium mb-2">
                                    Descuento (%)
                                </label>
                                <input
                                    name="descuentoPorcentaje"
                                    type="number"
                                    min="0"
                                    max="100"
                                    step="0.01"
                                    value={formData.descuentoPorcentaje}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="0.00"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Sección: Información Adicional */}
                    <div className="mb-10">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-6 pb-3 border-b-2 border-orange-500">
                            Información Adicional
                        </h2>
                        <div className="grid grid-cols-1 gap-6">

                            <div>
                                <label className="block text-gray-700 text-sm font-medium mb-2">
                                    Observaciones
                                </label>
                                <textarea
                                    name="observaciones1"
                                    value={formData.observaciones1}
                                    onChange={handleChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    rows="4"
                                    placeholder="Notas adicionales sobre el cliente (opcional)"
                                />
                            </div>

                            <div>
                                <label className="flex items-center cursor-pointer">
                                    <input
                                        name="bloquearMarketing"
                                        type="checkbox"
                                        checked={formData.bloquearMarketing}
                                        onChange={handleChange}
                                        className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                    <span className="ml-3 text-gray-700 font-medium">Bloquear comunicaciones de marketing</span>
                                </label>
                            </div>
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
                                    <span>{clienteInicial ? "Actualizando..." : "Guardando..."}</span>
                                </div>
                            ) : (
                                <span>{clienteInicial ? "Actualizar Cliente" : "Guardar Cliente"}</span>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ClientEdit;