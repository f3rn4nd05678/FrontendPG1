import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login as loginService } from "../api/userService";

const Login = () => {
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState({
        correo: "",
        password: ""
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials({
            ...credentials,
            [name]: value
        });
    };

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {

            const response = await loginService(credentials);
            localStorage.setItem("token", response.detail.token);

            navigate("/");
        } catch (err) {
            console.error("Error de inicio de sesión:", err);
            setError(
                err.response?.data?.message ||
                "Error al iniciar sesión. Por favor, inténtelo de nuevo."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 rounded-lg shadow-lg bg-plastihogar-blue text-white">
                <div className="flex justify-center mb-8">
                    <h1 className="text-3xl font-bold text-white">PLASTIHOGAR</h1>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-500 text-white rounded">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                                <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"></path>
                                </svg>
                            </div>
                            <input
                                type="text"
                                name="correo"
                                value={credentials.correo}
                                onChange={handleChange}
                                placeholder="Usuario"
                                className="w-full py-2 pl-10 pr-3 text-gray-700 bg-white rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                    </div>

                    <div className="mb-6">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                                <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M10 2a5 5 0 00-5 5v2a2 2 0 00-2 2v5a2 2 0 002 2h10a2 2 0 002-2v-5a2 2 0 00-2-2H7V7a3 3 0 016 0v2h2V7a5 5 0 00-5-5z"></path>
                                </svg>
                            </div>
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={credentials.password}
                                onChange={handleChange}
                                placeholder="Contraseña"
                                className="w-full py-2 pl-10 pr-10 text-gray-700 bg-white rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 focus:outline-none"
                                onClick={toggleShowPassword}
                            >
                                {showPassword ? (
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                                    </svg>
                                ) : (
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                                        <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center justify-center">
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2 text-white bg-blue-400 rounded-full hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:opacity-50"
                        >
                            {loading ? "Iniciando sesión..." : "Iniciar sesión"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;