import React, { useState, useEffect } from "react";
import { validarCodigo, validarNit } from "../api/userService";
import Loader from "./Loader";
import Alert from "./Alert";

const ClientEdit = ({ onSubmit, cliente: clienteInicial = null, onCancel }) => {
    const [formData, setFormData] = useState({
        codigo: "",
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
        posicion: "",
        titulo: "",
        segundoNombre: "",
        apellido: "",
        saldoCuenta: 0,
        limiteCredito: 0,
        diasCredito: 30,
        descuentoPorcentaje: 0,
        activo: true,
        bloquearMarketing: false,
        observaciones1: "",
        observaciones2: "",
        claveAcceso: "",
        ciudadNacimiento: "",
    });

    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState({ show: false, type: "", message: "" });
    const [activeTab, setActiveTab] = useState("general");
    const [validaciones, setValidaciones] = useState({
        codigo: { validando: false, valido: true, mensaje: "" },
        nit: { validando: false, valido: true, mensaje: "" },
    });

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

        if (name === "codigo" && value.trim().length > 2) {
            validarCodigoCliente(value);
        } else if (name === "nit" && value.trim().length > 5) {
            validarNitCliente(value);
        }
    };

    const validarCodigoCliente = async (codigo) => {
        if (!codigo || clienteInicial?.codigo === codigo) return;

        setValidaciones(prev => ({
            ...prev,
            codigo: { ...prev.codigo, validando: true }
        }));

        try {
            const response = await validarCodigo({ codigo });
            setValidaciones(prev => ({
                ...prev,
                codigo: {
                    validando: false,
                    valido: response.detail.disponible,
                    mensaje: response.detail.mensaje
                }
            }));
        } catch (error) {
            setValidaciones(prev => ({
                ...prev,
                codigo: { validando: false, valido: true, mensaje: "Error al validar el código" }
            }));
        }
    };

    const validarNitCliente = async (nit) => {
        if (!nit || clienteInicial?.nit === nit) return;

        setValidaciones(prev => ({
            ...prev,
            nit: { ...prev.nit, validando: true }
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
                nit: { validando: false, valido: true, mensaje: "Error al validar el NIT" }
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await onSubmit(formData);
            setAlert({
                show: true,
                type: "success",
                message: clienteInicial ? "Cliente actualizado exitosamente" : "Cliente creado exitosamente"
            });

            if (!clienteInicial) {
                setFormData({
                    codigo: "",
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
                    posicion: "",
                    titulo: "",
                    segundoNombre: "",
                    apellido: "",
                    saldoCuenta: 0,
                    limiteCredito: 0,
                    diasCredito: 30,
                    descuentoPorcentaje: 0,
                    activo: true,
                    bloquearMarketing: false,
                    observaciones1: "",
                    observaciones2: "",
                    claveAcceso: "",
                    ciudadNacimiento: "",
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
        return (
            formData.codigo &&
            formData.nombre &&
            formData.nit &&
            validaciones.codigo.valido &&
            validaciones.nit.valido
        );
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-5">
            {alert.show && (
                <Alert
                    type={alert.type}
                    message={alert.message}
                    onClose={() => setAlert({ ...alert, show: false })}
                />
            )}

            <h2 className="text-xl font-semibold text-gray-800 mb-4">
                {clienteInicial ? "Editar Cliente" : "Nuevo Cliente"}
            </h2>

       
            <div className="mb-5 border-b border-gray-200">
                <nav className="flex -mb-px">
                    {[
                        { id: "general", label: "General", icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
                        { id: "contacto", label: "Contacto", icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" },
                        { id: "financiero", label: "Financiero", icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
                        { id: "adicional", label: "Adicional", icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" }
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            type="button"
                            onClick={() => setActiveTab(tab.id)}
                            className={`${activeTab === tab.id
                                    ? "border-blue-500 text-blue-600"
                                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                } py-2 px-4 font-medium border-b-2 flex items-center`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
                            </svg>
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>

            <form onSubmit={handleSubmit}>
              
                <div className={activeTab === "general" ? "block" : "hidden"}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-medium mb-2">Código *</label>
                            <input
                                name="codigo"
                                type="text"
                                value={formData.codigo}
                                onChange={handleChange}
                                className={`w-full p-2 border ${!validaciones.codigo.valido ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                required
                            />
                            {validaciones.codigo.validando && (
                                <span className="text-blue-500 text-xs italic">Validando código...</span>
                            )}
                            {!validaciones.codigo.valido && !validaciones.codigo.validando && (
                                <span className="text-red-500 text-xs italic">{validaciones.codigo.mensaje}</span>
                            )}
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-medium mb-2">Tipo de Cliente</label>
                            <select
                                name="tipoCliente"
                                value={formData.tipoCliente}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="Regular">Regular</option>
                                <option value="Frecuente">Frecuente</option>
                                <option value="VIP">VIP</option>
                                <option value="Mayorista">Mayorista</option>
                                <option value="Distribuidor">Distribuidor</option>
                            </select>
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-medium mb-2">Nombre *</label>
                            <input
                                name="nombre"
                                type="text"
                                value={formData.nombre}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-medium mb-2">Nombre Extranjero</label>
                            <input
                                name="nombreExtranjero"
                                type="text"
                                value={formData.nombreExtranjero}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-medium mb-2">Grupo</label>
                            <input
                                name="grupo"
                                type="text"
                                value={formData.grupo}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-medium mb-2">Moneda</label>
                            <select
                                name="moneda"
                                value={formData.moneda}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="GTQ">Quetzal (GTQ)</option>
                                <option value="USD">Dólar Estadounidense (USD)</option>
                                <option value="EUR">Euro (EUR)</option>
                                <option value="MXN">Peso Mexicano (MXN)</option>
                            </select>
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-medium mb-2">NIT *</label>
                            <input
                                name="nit"
                                type="text"
                                value={formData.nit}
                                onChange={handleChange}
                                className={`w-full p-2 border ${!validaciones.nit.valido ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                required
                            />
                            {validaciones.nit.validando && (
                                <span className="text-blue-500 text-xs italic">Validando NIT...</span>
                            )}
                            {!validaciones.nit.valido && !validaciones.nit.validando && (
                                <span className="text-red-500 text-xs italic">{validaciones.nit.mensaje}</span>
                            )}
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-medium mb-2">Estado</label>
                            <div className="flex items-center">
                                <input
                                    name="activo"
                                    type="checkbox"
                                    checked={formData.activo}
                                    onChange={handleChange}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <span className="ml-2 text-gray-700">Cliente Activo</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={activeTab === "contacto" ? "block" : "hidden"}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-medium mb-2">Dirección</label>
                            <textarea
                                name="direccion"
                                value={formData.direccion}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                rows="3"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-medium mb-2">Ciudad</label>
                            <input
                                name="ciudadNacimiento"
                                type="text"
                                value={formData.ciudadNacimiento}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-medium mb-2">Teléfono Principal</label>
                            <input
                                name="telefono1"
                                type="tel"
                                value={formData.telefono1}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-medium mb-2">Teléfono Secundario</label>
                            <input
                                name="telefono2"
                                type="tel"
                                value={formData.telefono2}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-medium mb-2">Teléfono Móvil</label>
                            <input
                                name="telefonoMovil"
                                type="tel"
                                value={formData.telefonoMovil}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-medium mb-2">Fax</label>
                            <input
                                name="fax"
                                type="tel"
                                value={formData.fax}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-medium mb-2">Correo Electrónico</label>
                            <input
                                name="correoElectronico"
                                type="email"
                                value={formData.correoElectronico}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-medium mb-2">Sitio Web</label>
                            <input
                                name="sitioWeb"
                                type="url"
                                value={formData.sitioWeb}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                </div>

           
                <div className={activeTab === "financiero" ? "block" : "hidden"}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-medium mb-2">Saldo de Cuenta</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <span className="text-gray-500 sm:text-sm">Q</span>
                                </div>
                                <input
                                    name="saldoCuenta"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={formData.saldoCuenta}
                                    onChange={handleChange}
                                    className="w-full pl-10 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-medium mb-2">Límite de Crédito</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <span className="text-gray-500 sm:text-sm">Q</span>
                                </div>
                                <input
                                    name="limiteCredito"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={formData.limiteCredito}
                                    onChange={handleChange}
                                    className="w-full pl-10 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-medium mb-2">Días de Crédito</label>
                            <input
                                name="diasCredito"
                                type="number"
                                min="0"
                                value={formData.diasCredito}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-medium mb-2">Porcentaje de Descuento</label>
                            <div className="relative">
                                <input
                                    name="descuentoPorcentaje"
                                    type="number"
                                    min="0"
                                    max="100"
                                    step="0.01"
                                    value={formData.descuentoPorcentaje}
                                    onChange={handleChange}
                                    className="w-full pr-10 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                    <span className="text-gray-500 sm:text-sm">%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

             
                <div className={activeTab === "adicional" ? "block" : "hidden"}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-medium mb-2">Observaciones 1</label>
                            <textarea
                                name="observaciones1"
                                value={formData.observaciones1}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                rows="3"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-medium mb-2">Observaciones 2</label>
                            <textarea
                                name="observaciones2"
                                value={formData.observaciones2}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                rows="3"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-medium mb-2">Bloquear Marketing</label>
                            <div className="flex items-center">
                                <input
                                    name="bloquearMarketing"
                                    type="checkbox"
                                    checked={formData.bloquearMarketing}
                                    onChange={handleChange}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <span className="ml-2 text-gray-700">Bloquear comunicaciones de marketing</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end mt-6 space-x-3">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={!isFormValid() || loading}
                        className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${!isFormValid() || loading ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                    >
                        {loading ? (
                            <div className="flex items-center">
                                <Loader size="small" color="white" />
                                <span className="ml-2">
                                    {clienteInicial ? "Actualizando..." : "Guardando..."}
                                </span>
                            </div>
                        ) : (
                            <span>{clienteInicial ? "Actualizar Cliente" : "Guardar Cliente"}</span>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ClientEdit;