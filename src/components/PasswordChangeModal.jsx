// src/components/PasswordChangeModal.jsx
import React, { useState } from 'react';
import { Eye, EyeOff, Lock, AlertCircle, CheckCircle } from 'lucide-react';
import { cambiarPasswordPrimerLogin } from '../api/userService';

const PasswordChangeModal = ({ isOpen, onSuccess }) => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const requisitos = [
        { texto: 'Mínimo 8 caracteres', cumple: newPassword.length >= 8 },
        { texto: 'Al menos una mayúscula', cumple: /[A-Z]/.test(newPassword) },
        { texto: 'Al menos una minúscula', cumple: /[a-z]/.test(newPassword) },
        { texto: 'Al menos un número', cumple: /[0-9]/.test(newPassword) },
        { texto: 'Al menos un carácter especial', cumple: /[!@#$%^&*(),.?":{}|<>]/.test(newPassword) }
    ];

    const passwordValida = requisitos.every(req => req.cumple);
    const passwordsCoinciden = newPassword === confirmPassword && confirmPassword !== '';

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!passwordValida) {
            setError('La contraseña no cumple con todos los requisitos');
            return;
        }

        if (!passwordsCoinciden) {
            setError('Las contraseñas no coinciden');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const tempUser = JSON.parse(sessionStorage.getItem('tempUser'));

            await cambiarPasswordPrimerLogin({
                correo: tempUser.correo,
                passwordActual: tempUser.password,
                nuevaPassword: newPassword
            });

            sessionStorage.removeItem('tempUser');
            onSuccess();
        } catch (err) {
            setError(err.response?.data?.message || 'Error al cambiar contraseña');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
                {/* Header */}
                <div className="text-center mb-6">
                    <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                        <Lock className="w-8 h-8 text-blue-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">Cambio de Contraseña Requerido</h2>
                    <p className="text-gray-600 mt-2">
                        Por seguridad, debes establecer una nueva contraseña antes de continuar.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Nueva Contraseña */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nueva Contraseña
                        </label>
                        <div className="relative">
                            <input
                                type={showNewPassword ? "text" : "password"}
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            >
                                {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    {/* Confirmar Contraseña */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Confirmar Contraseña
                        </label>
                        <div className="relative">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            >
                                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    {/* Requisitos */}
                    <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-sm font-medium text-gray-700 mb-2">Requisitos de la contraseña:</p>
                        <ul className="space-y-1">
                            {requisitos.map((req, index) => (
                                <li key={index} className="flex items-center text-sm">
                                    {req.cumple ? (
                                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                                    ) : (
                                        <div className="w-4 h-4 border-2 border-gray-300 rounded-full mr-2" />
                                    )}
                                    <span className={req.cumple ? 'text-green-700' : 'text-gray-600'}>
                                        {req.texto}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Validación de coincidencia */}
                    {confirmPassword && (
                        <div className={`flex items-center text-sm ${passwordsCoinciden ? 'text-green-600' : 'text-red-600'}`}>
                            {passwordsCoinciden ? (
                                <>
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                    Las contraseñas coinciden
                                </>
                            ) : (
                                <>
                                    <AlertCircle className="w-4 h-4 mr-2" />
                                    Las contraseñas no coinciden
                                </>
                            )}
                        </div>
                    )}

                    {/* Error */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start">
                            <AlertCircle className="w-5 h-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    )}

                    {/* Botón */}
                    <button
                        type="submit"
                        disabled={loading || !passwordValida || !passwordsCoinciden}
                        className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Cambiando contraseña...' : 'Cambiar Contraseña'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default PasswordChangeModal;