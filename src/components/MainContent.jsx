import React from "react";



const MainContent = ({ view }) => {
    const renderView = () => {
        switch (view) {
            case "/dashboard":
                return <h1>dashboard</h1>;
            case "/productos":
                return <h1>productos</h1>;

            default:
                return <div className="text-gray-700">Selecciona una opción del menú</div>;
        }
    };

    return <main className="flex-1 overflow-auto bg-gray-100 p-6">{renderView()}</main>;
};

export default MainContent;
