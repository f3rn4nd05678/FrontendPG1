import React, { useState, useEffect } from "react";
import { BiEdit, BiTrash, BiSearch } from "react-icons/bi";
import { listarCategorias } from "../api/userService";
import Loader from "./Loader";
import Alert from "./Alert";

const CategoryList = ({ onEdit, onDelete, refreshTrigger }) => {
    const [categorias, setCategorias] = useState([]);
    const [filteredCategorias, setFilteredCategorias] = useState([]);
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState({ show: false, type: "", message: "" });
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        cargarCategorias();
    }, [refreshTrigger]);

    useEffect(() => {
        filtrarCategorias();
    }, [searchTerm, categorias]);

    const cargarCategorias = async () => {
        setLoading(true);
        try {
            const response = await listarCategorias();

            if (response.isSuccess) {
                const lista = response.detail || [];
                setCategorias(lista);
            } else {
                setAlert({
                    show: true,
                    type: "error",
                    message: response.message || "Error al cargar categorías"
                });
            }
        } catch (error) {
            console.error("Error al cargar categorías:", error);
            setAlert({
                show: true,
                type: "error",
                message: "Error al cargar las categorías"
            });
        } finally {
            setLoading(false);
        }
    };

    const filtrarCategorias = () => {
        if (!searchTerm.trim()) {
            setFilteredCategorias(categorias);
            return;
        }

        const term = searchTerm.toLowerCase();
        const filtered = categorias.filter(cat =>
            cat.nombre.toLowerCase().includes(term) ||
            cat.codigoPrefijo.toLowerCase().includes(term) ||
            cat.descripcion?.toLowerCase().includes(term)
        );
        setFilteredCategorias(filtered);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("¿Está seguro de eliminar esta categoría?")) return;

        setLoading(true);
        try {
            await onDelete(id);
            setAlert({
                show: true,
                type: "success",
                message: "Categoría eliminada exitosamente"
            });
            cargarCategorias();
        } catch (error) {
            setAlert({
                show: true,
                type: "error",
                message: error.message || "Error al eliminar la categoría"
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-lg p-6">
            {loading && <Loader fullScreen />}
            {alert.show && (
                <Alert
                    type={alert.type}
                    message={alert.message}
                    onClose={() => setAlert({ show: false, type: "", message: "" })}
                />
            )}

            {/* Buscador */}
            <div className="mb-6">
                <div className="relative">
                    <BiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
                    <input
                        type="text"
                        placeholder="Buscar por nombre, código o descripción..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>

            {/* Tabla */}
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Código
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Nombre
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Descripción
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Estado
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Acciones
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredCategorias.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                                    {searchTerm ? "No se encontraron categorías" : "No hay categorías registradas"}
                                </td>
                            </tr>
                        ) : (
                            filteredCategorias.map((categoria) => (
                                <tr key={categoria.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                            {categoria.codigoPrefijo}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">
                                            {categoria.nombre}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-gray-500">
                                            {categoria.descripcion || "-"}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {categoria.activo ? (
                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                Activo
                                            </span>
                                        ) : (
                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                                                Inactivo
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button
                                            onClick={() => onEdit(categoria)}
                                            className="text-blue-600 hover:text-blue-900 mr-4 inline-flex items-center"
                                            title="Editar"
                                        >
                                            <BiEdit className="text-xl" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(categoria.id)}
                                            className="text-red-600 hover:text-red-900 inline-flex items-center"
                                            title="Eliminar"
                                        >
                                            <BiTrash className="text-xl" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Información de resultados */}
            {filteredCategorias.length > 0 && (
                <div className="mt-4 text-sm text-gray-600">
                    Mostrando {filteredCategorias.length} de {categorias.length} categorías
                </div>
            )}
        </div>
    );
};

export default CategoryList;