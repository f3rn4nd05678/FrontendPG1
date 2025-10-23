import React, { useState, useEffect } from "react";
import {
    listarCategorias,
    crearCategoria,
    actualizarCategoria,
    eliminarCategoria,
    obtenerCategoria
} from "../api/userService";
import CategoryEdit from "./CategoryEdit";
import CategoryList from "./CategoryList";
import Loader from "./Loader";
import Alert from "./Alert";

const CategoryMain = () => {
    const [categorias, setCategorias] = useState([]);
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
    const [modoEdicion, setModoEdicion] = useState(false);
    const [cargando, setCargando] = useState(false);
    const [alert, setAlert] = useState({ show: false, type: "", message: "" });
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    // Cargar categorías al montar el componente
    useEffect(() => {
        cargarCategorias();
    }, [refreshTrigger]);

    const cargarCategorias = async () => {
        setCargando(true);
        try {
            const response = await listarCategorias();
            setCategorias(response.detail || []);
        } catch (error) {
            console.error("Error al cargar categorías:", error);
            setAlert({
                show: true,
                type: "error",
                message: "Error al cargar las categorías"
            });
        } finally {
            setCargando(false);
        }
    };

    const handleCrear = () => {
        setCategoriaSeleccionada(null);
        setModoEdicion(true);
    };

    const handleEditar = async (categoria) => {
        setCategoriaSeleccionada(categoria);
        setModoEdicion(true);
    };

    const handleEliminar = async (id) => {
        if (!window.confirm("¿Está seguro de eliminar esta categoría? Los productos asociados no se eliminarán.")) {
            return;
        }

        setCargando(true);
        try {
            const response = await eliminarCategoria({ id });

            if (response.isSuccess) {
                setAlert({
                    show: true,
                    type: "success",
                    message: "Categoría eliminada exitosamente"
                });
                setRefreshTrigger(prev => prev + 1);
            } else {
                throw new Error(response.message || "Error al eliminar la categoría");
            }
        } catch (error) {
            console.error("Error al eliminar categoría:", error);
            setAlert({
                show: true,
                type: "error",
                message: error.message || "Error al eliminar la categoría"
            });
        } finally {
            setCargando(false);
        }
    };

    const handleSubmit = async (formData) => {
        setCargando(true);
        try {
            let response;

            if (categoriaSeleccionada) {
                // Actualizar
                response = await actualizarCategoria({
                    id: categoriaSeleccionada.id,
                    ...formData
                });
            } else {
                // Crear
                response = await crearCategoria(formData);
            }

            if (response.isSuccess) {
                setAlert({
                    show: true,
                    type: "success",
                    message: categoriaSeleccionada
                        ? "Categoría actualizada exitosamente"
                        : "Categoría creada exitosamente"
                });
                setModoEdicion(false);
                setCategoriaSeleccionada(null);
                setRefreshTrigger(prev => prev + 1);
            } else {
                throw new Error(response.message || "Error al guardar la categoría");
            }
        } catch (error) {
            console.error("Error al guardar categoría:", error);
            setAlert({
                show: true,
                type: "error",
                message: error.message || "Error al guardar la categoría"
            });
            throw error;
        } finally {
            setCargando(false);
        }
    };

    const handleCancelar = () => {
        setModoEdicion(false);
        setCategoriaSeleccionada(null);
    };

    // Si está en modo edición, mostrar el formulario
    if (modoEdicion) {
        return (
            <CategoryEdit
                onSubmit={handleSubmit}
                categoria={categoriaSeleccionada}
                onCancel={handleCancelar}
            />
        );
    }

    // Vista de lista
    return (
        <div className="p-6">
            {cargando && <Loader fullScreen />}

            {alert.show && (
                <Alert
                    type={alert.type}
                    message={alert.message}
                    onClose={() => setAlert({ show: false, type: "", message: "" })}
                />
            )}

            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Gestión de Categorías</h1>
                <p className="text-gray-600 mt-2">
                    Administra las categorías de productos del sistema
                </p>
            </div>

            {/* Botón nuevo */}
            <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-800">
                            Categorías Registradas
                        </h2>
                        <p className="text-sm text-gray-600">
                            Total: {categorias.length} categorías
                        </p>
                    </div>
                    <button
                        onClick={handleCrear}
                        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
                    >
                        ➕ Nueva Categoría
                    </button>
                </div>
            </div>

            {/* Lista de categorías */}
            <CategoryList
                onEdit={handleEditar}
                onDelete={handleEliminar}
                refreshTrigger={refreshTrigger}
            />
        </div>
    );
};

export default CategoryMain;