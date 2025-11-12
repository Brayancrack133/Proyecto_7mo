import React from "react";
import { Home, Folder, Calendar, Users, Database, BarChart2, Settings } from "lucide-react";

const Sidebar: React.FC = () => {
  const items = [
    { name: "Inicio", icon: <Home /> },
    { name: "Proyectos", icon: <Folder /> },
    { name: "Planificación", icon: <Calendar /> },
    { name: "Colaboración", icon: <Users /> },
    { name: "Repositorio", icon: <Database /> },
    { name: "IA Predictiva", icon: <BarChart2 /> },
    { name: "Configuración", icon: <Settings /> },
  ];

  return (
    <aside className="w-60 bg-[#0D1730] text-white h-screen flex flex-col">
      <div className="p-4 text-2xl font-bold">F</div>
      <nav className="flex flex-col gap-2 mt-4">
        {items.map((item, i) => (
          <button
            key={i}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#F9A825] transition"
          >
            {item.icon}
            <span>{item.name}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
