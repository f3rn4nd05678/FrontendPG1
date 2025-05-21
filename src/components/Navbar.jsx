import React from "react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <header className="bg-white shadow-sm h-16 flex items-center">
            <div className="flex items-center justify-between w-full px-4">
                <div className="flex items-center">
                    <img src="/logo.png" alt="Plastihogar" className="h-8 mr-2" />
                    <h1 className="text-lg font-semibold text-gray-800">Panel Principal</h1>
                </div>

                <div className="flex items-center space-x-3">
                    <button className="text-gray-500 hover:text-gray-700">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                    </button>

                    <div className="flex items-center space-x-2">
                        <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium text-sm">
                            PH
                        </div>
                        <span className="text-sm font-medium text-gray-700 hidden md:inline">
                            Admin
                        </span>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm font-medium transition duration-150 ease-in-out"
                    >
                        Salir
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Navbar;