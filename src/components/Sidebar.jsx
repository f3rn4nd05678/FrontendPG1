import { useEffect, useState } from "react";
import { getMenu } from "../api/userService";

const Sidebar = ({ onSelect }) => {
  const [menu, setMenu] = useState([]);

  useEffect(() => {
    const fetchMenu = async () => {
      const response = await getMenu();
      setMenu(response.detail);
    };
    fetchMenu();
  }, []);

  return (
    <aside className="w-64 bg-[#11273A] text-white flex flex-col p-4 overflow-y-auto">
      <div className="text-xl font-bold mb-6">Plastihogar</div>
      <nav className="space-y-2">
        {menu.map((padre) => (
          <div key={padre.id}>
            {padre.ruta !== "#" && (
              <button
                onClick={() => onSelect(padre.ruta)}
                className="w-full text-left px-4 py-2 hover:bg-blue-600 rounded"
              >
                {padre.titulo}
              </button>
            )}
            {padre.items.length > 0 && (
              <div className="ml-2">
                {padre.items.map((sub) => (
                  <button
                    key={sub.id}
                    onClick={() => onSelect(sub.ruta)}
                    className="w-full text-left px-4 py-1 hover:bg-blue-500 rounded text-sm"
                  >
                    {sub.titulo}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
