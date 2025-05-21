import React, { useEffect, useState } from "react";
import { getMenu } from "../api/userService";

const Sidebar = ({ onSelect, selectedView }) => {
    const [menu, setMenu] = useState([]);
    const [expandedItems, setExpandedItems] = useState({});

    useEffect(() => {
        const fetchMenu = async () => {
            try {
                const response = await getMenu();
                setMenu(response.detail);
            } catch (error) {
                console.error("Error al cargar el menú:", error);
            }
        };
        fetchMenu();
    }, []);

    const toggleExpand = (id) => {
        setExpandedItems(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const isMenuItemActive = (ruta) => {
        return selectedView === ruta;
    };

    return (
        <aside className="w-56 bg-[#11273A] text-white flex flex-col h-full">
            <div className="p-3 border-b border-gray-700">
                <div className="flex items-center justify-center">
                    <img src="/logo.png" alt="Plastihogar" className="h-8" />
                    <h1 className="text-base font-bold ml-2">Plastihogar</h1>
                </div>
            </div>

            <nav className="flex-1 overflow-y-auto py-2 px-2">
                <div className="space-y-0.5">
                    {menu.map((padre) => (
                        <div key={padre.id} className="mb-0.5">
                            {padre.ruta !== "#" ? (
                                <button
                                    onClick={() => onSelect(padre.ruta)}
                                    className={`w-full flex items-center text-left p-2 rounded-md text-sm
                    ${isMenuItemActive(padre.ruta)
                                            ? 'bg-blue-700 text-white'
                                            : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
                                >
                                    <span className="mr-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                                        </svg>
                                    </span>
                                    <span className="flex-1">{padre.titulo}</span>
                                </button>
                            ) : (
                                <button
                                    onClick={() => toggleExpand(padre.id)}
                                    className="w-full flex items-center justify-between text-left p-2 rounded-md text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                                >
                                    <div className="flex items-center">
                                        <span className="mr-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                                            </svg>
                                        </span>
                                        <span>{padre.titulo}</span>
                                    </div>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className={`h-3 w-3 transition-transform duration-200 ${expandedItems[padre.id] ? 'transform rotate-180' : ''}`}
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            )}

                            {(padre.items.length > 0 && (expandedItems[padre.id] || padre.items.some(item => isMenuItemActive(item.ruta)))) && (
                                <div className="ml-6 mt-0.5 space-y-0.5">
                                    {padre.items.map((sub) => (
                                        <button
                                            key={sub.id}
                                            onClick={() => onSelect(sub.ruta)}
                                            className={`w-full flex items-center text-left p-1.5 rounded-md text-xs
                        ${isMenuItemActive(sub.ruta)
                                                    ? 'bg-blue-700 text-white'
                                                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
                                        >
                                            <span className="mr-2 h-1 w-1 bg-gray-400 rounded-full"></span>
                                            {sub.titulo}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </nav>

            <div className="p-2 border-t border-gray-700">
                <p className="text-xs text-gray-400 text-center">© 2025 Plastihogar</p>
            </div>
        </aside>
    );
};

export default Sidebar;