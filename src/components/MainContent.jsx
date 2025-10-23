import React from "react";
import ClientMain from "./ClientMain";
import ProveedorMain from "./ProveedorMain";
import ProductMain from "./ProductMain";
import UserMain from "./UserMain";
import RolMain from "./RolMain";
import CategoryMain from "./CategoryMain";
import BodegaMain from "./BodegaMain";

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
                return <ProductMain />;

            case "/proveedores":
                return <ProveedorMain />;

            case "/clientes":
                return <ClientMain />;

            case "/categorias":
                return <CategoryMain />;

            case "/bodegas":
                return <BodegaMain />;

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
                        <p className="text-gray-600">Gestión de facturas electrónicas (FEL).</p>
                    </div>
                );
            case "/inventario":
                return (
                    <div className="bg-white rounded-md shadow-md p-4">
                        <h1 className="text-2xl font-bold text-gray-800 mb-4">Inventario</h1>
                        <p className="text-gray-600">Control de stock y movimientos de inventario.</p>
                    </div>
                );
            case "/reportes/ventas":
                return (
                    <div className="bg-white rounded-md shadow-md p-4">
                        <h1 className="text-2xl font-bold text-gray-800 mb-4">Reporte de Ventas</h1>
                        <p className="text-gray-600">Análisis y estadísticas de ventas.</p>
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
                return <UserMain />;

            case "/admin/roles":
                return <RolMain />;

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