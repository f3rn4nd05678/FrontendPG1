import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <aside className="w-64 bg-[#11273A] text-white flex flex-col p-4">
      <div className="text-xl font-bold mb-6">Plastihogar</div>
      <nav className="space-y-4">
        <Link to="/" className="hover:text-blue-400">Dashboard</Link>
        <Link to="/perfil" className="hover:text-blue-400">Perfil</Link>
        {/* Agrega más enlaces aquí */}
      </nav>
    </aside>
  );
};

export default Sidebar;
