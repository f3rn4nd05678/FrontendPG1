import React from "react";
import Clientes from "./ClientForm";

const MainContent = ({ view }) => {


    const renderView = () => {
        switch (view) {
            case "/dashboard":
                return (
                    <div className="bg-white rounded-md shadow-md p-4">
                        <h1 className="text-2xl font-bold text-gray-800 mb-4">Dashboard</h1>
                        <p className="text-gray-600">Panel principal con estadísticas y resumen.</p>
                    </div>
                );
            case "/productos":
                return (
                    <div className="bg-white rounded-md shadow-md p-4">
                        <h1 className="text-2xl font-bold text-gray-800 mb-4">Gestión de Productos</h1>
                        <p className="text-gray-600">La interfaz de productos se cargará aquí.</p>
                    </div>
                );
            case "/proveedores":
                return (
                    <div className="bg-white rounded-md shadow-md p-4">
                        <h1 className="text-2xl font-bold text-gray-800 mb-4">Proveedores</h1>
                        <p className="text-gray-600">Gestión de proveedores.</p>
                    </div>
                );
            case "/clientes":
                return (
                    <div className="bg-white rounded-md shadow-md p-4">
                        <h1 className="text-2xl font-bold text-gray-800 mb-4">Clientes</h1>
                        <p className="text-gray-600">Lista y edición de clientes.</p>
                         <Clientes/>
                    </div>
                );
            case "/cotizaciones":
                return (
                    <div className="bg-white rounded-md shadow-md p-4">
                        <h1 className="text-2xl font-bold text-gray-800 mb-4">Cotizaciones</h1>
                        <p className="text-gray-600">Panel para gestionar cotizaciones.</p>
                    </div>
                );
            case "/pedidos":
                return (
                    <div className="bg-white rounded-md shadow-md p-4">
                        <h1 className="text-2xl font-bold text-gray-800 mb-4">Pedidos</h1>
                        <p className="text-gray-600">Sección de pedidos en curso.</p>
                    </div>
                );
            case "/facturas":
                return (
                    <div className="bg-white rounded-md shadow-md p-4">
                        <h1 className="text-2xl font-bold text-gray-800 mb-4">Facturas</h1>
                        <p className="text-gray-600">Facturación de ventas realizadas.</p>
                    </div>
                );
            case "/inventario/stock":
                return (
                    <div className="bg-white rounded-md shadow-md p-4">
                        <h1 className="text-2xl font-bold text-gray-800 mb-4">Stock Actual</h1>
                        <p className="text-gray-600">Control del stock actual disponible.</p>
                    </div>
                );
            case "/inventario/movimientos":
                return (
                    <div className="bg-white rounded-md shadow-md p-4">
                        <h1 className="text-2xl font-bold text-gray-800 mb-4">Movimientos</h1>
                        <p className="text-gray-600">Historial de movimientos de inventario.</p>
                    </div>
                );
            case "/inventario/alertas":
                return (
                    <div className="bg-white rounded-md shadow-md p-4">
                        <h1 className="text-2xl font-bold text-gray-800 mb-4">Alertas de Inventario</h1>
                        <p className="text-gray-600">Alertas por niveles críticos de stock.</p>
                    </div>
                );
            case "/reportes/ventas":
                return (
                    <div className="bg-white rounded-md shadow-md p-4">
                        <h1 className="text-2xl font-bold text-gray-800 mb-4">Reporte de Ventas</h1>
                        <p className="text-gray-600">Gráficos e informes de ventas.</p>
                    </div>
                );
            case "/reportes/inventario":
                return (
                    <div className="bg-white rounded-md shadow-md p-4">
                        <h1 className="text-2xl font-bold text-gray-800 mb-4">Reporte de Inventario</h1>
                        <p className="text-gray-600">Gráficos e informes del inventario.</p>
                    </div>
                );
            case "/admin/usuarios":
                return (
                    <div className="bg-white rounded-md shadow-md p-4">
                        <h1 className="text-2xl font-bold text-gray-800 mb-4">Usuarios</h1>
                        <p className="text-gray-600">Administración de usuarios del sistema.</p>
                    </div>
                );
            case "/admin/roles":
                return (
                    <div className="bg-white rounded-md shadow-md p-4">
                        <h1 className="text-2xl font-bold text-gray-800 mb-4">Roles y Permisos</h1>
                        <p className="text-gray-600">Gestión de roles y permisos de acceso.</p>
                    </div>
                );
            case "/admin/configuracion":
                return (
                    <div className="bg-white rounded-md shadow-md p-4">
                        <h1 className="text-2xl font-bold text-gray-800 mb-4">Configuración</h1>
                        <p className="text-gray-600">Opciones generales de configuración.</p>
                    </div>
                );
            default:
                return (
                    <div className="bg-white rounded-md shadow-md p-4 text-center">
                        <h2 className="text-lg font-semibold text-gray-700">Selecciona una opción del menú</h2>
                        <p className="text-gray-500 mt-2">El contenido correspondiente se mostrará aquí</p>
                    </div>
                );
        }
    };


    return (
        <main className="flex-1 overflow-auto bg-gray-50 p-4 w-full">

            {renderView()}
        </main>
    );
};

export default MainContent;