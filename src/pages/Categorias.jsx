import React, { useState } from "react";
import { BiPlus, BiArrowBack } from "react-icons/bi";
import CategoryList from "../components/CategoryList";
import CategoryEdit from "../components/CategoryEdit";
import Alert from "../components/Alert";

const Categorias = () => {
    const [vista, setVista] = useState("lista"); // lista, crear, editar
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [alert, setAlert] = useState({ show: false, type: "", message: "" });

    const handleNuevo = () => {
        setCategoriaSeleccionada(null);
        setVista("crear");
    };

    const handleEditar = (categoria) => {
        setCategoriaSeleccionada(categoria);
        setVista("editar");
    };

    const handleCancelar = () => {
        setCategoriaSeleccionada(null);
        setVista("lista");
    };

    const handleGuardar = async (formData) => {
        try {
            const token = localStorage.getItem("token");
            const url = categoriaSeleccionada
                ? "http://localhost:5029/api/Categoria/actualizar"
                : "http://localhost:5029/api/Categoria/crear";

            const body = categoriaSeleccionada
                ? { id: categoriaSeleccionada.id, datos: formData }
                : formData;

            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(body)
            });

            const data = await response.json();

            if (data.isSuccess) {
                setAlert({
                    show: true,
                    type: "success",
                    message: categoriaSeleccionada
                        ? "Categoría actualizada exitosamente"
                        : "Categoría creada exitosamente"
                });
                setVista("lista");
                setCategoriaSeleccionada(null);
                setRefreshTrigger(prev => prev + 1);
            } else {
                throw new Error(data.message || "Error al guardar la categoría");
            }
        } catch (error) {
            setAlert({
                show: true,
                type: "error",
                message: error.message || "Error al guardar la categoría"
            });
            throw error;
        }
    };

    const handleEliminar = async (id) => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch("http://localhost:5029/api/Categoria/eliminar", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ id })
            });

            const data = await response.json();

            if (!data.isSuccess) {
                throw new Error(data.message || "Error al eliminar la categoría");
            }

            setAlert({
                show: true,
                type: "success",
                message: "Categoría eliminada exitosamente"
            });
            setRefreshTrigger(prev => prev + 1);
        } catch (error) {
            setAlert({
                show: true,
                type: "error",
                message: error.message || "Error al eliminar la categoría"
            });
            throw error;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
            {alert.show && (
                <Alert
                    type={alert.type}
                    message={alert.message}
                    onClose={() => setAlert({ show: false, type: "", message: "" })}
                />
            )}

            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-4xl font-bold text-gray-900">
                                {vista === "lista" && "Categorías de Productos"}
                                {vista === "crear" && "Nueva Categoría"}
                                {vista === "editar" && "Editar Categoría"}
                            </h1>
                            <p className="text-gray-600 mt-3 text-lg">
                                {vista === "lista" && "Administre las categorías de productos"}
                                {vista === "crear" && "Complete la información de la nueva categoría"}
                                {vista === "editar" && "Modifique los datos de la categoría"}
                            </p>
                        </div>

                        {vista === "lista" ? (
                            <button
                                onClick={handleNuevo}
                                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl font-medium"
                            >
                                <BiPlus className="text-2xl" />
                                Nueva Categoría
                            </button>
                        ) : (
                            <button
                                onClick={handleCancelar}
                                className="flex items-center gap-2 px-6 py-3 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition-colors font-medium"
                            >
                                <BiArrowBack className="text-xl" />
                                Volver al Listado
                            </button>
                        )}
                    </div>
                </div>

                {/* Contenido */}
                {vista === "lista" && (
                    <CategoryList
                        onEdit={handleEditar}
                        onDelete={handleEliminar}
                        refreshTrigger={refreshTrigger}
                    />
                )}

                {(vista === "crear" || vista === "editar") && (
                    <CategoryEdit
                        categoria={categoriaSeleccionada}
                        onSubmit={handleGuardar}
                        onCancel={handleCancelar}
                    />
                )}
            </div>
        </div>
    );
};

export default Categorias;