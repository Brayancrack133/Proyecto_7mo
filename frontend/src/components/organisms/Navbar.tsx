import React from "react";

const Navbar: React.FC = () => (
  <header className="bg-[#0D1730] text-white px-6 py-4 flex justify-between items-center">
    <nav className="flex gap-10 text-lg font-semibold">
      <span className="text-[#F9A825]">Inicio</span>
      <span>Nosotros</span>
      <span>Mis Proyectos</span>
      <span>Administración</span>
    </nav>
    <div className="flex items-center gap-3">
      <input
        type="text"
        placeholder="Buscar..."
        className="rounded-md px-3 py-1 text-black"
      />
      <div className="w-10 h-10 rounded-full bg-gray-400" />
    </div>
  </header>
);

export default Navbar;
