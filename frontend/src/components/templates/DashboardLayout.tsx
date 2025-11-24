import React from 'react';
import { Search } from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 text-white shadow-lg">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                <span className="text-blue-900 font-bold text-xl">F</span>
              </div>
              <nav className="flex gap-6">
                <a href="/" className="text-orange-400 font-medium">Inicio</a>
                <a href="#" className="hover:text-orange-400 transition">Nosotros</a>
                <a href="/projects" className="hover:text-orange-400 transition">Mis Proyectos</a>
                <a href="#" className="hover:text-orange-400 transition">Administración</a>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <Search className="w-5 h-5 cursor-pointer hover:text-orange-400 transition" />
              <div className="text-right">
                <div className="text-sm font-medium">ADMIN</div>
                <div className="text-xs text-gray-300">Mi Perfil</div>
              </div>
              <div className="w-10 h-10 bg-gray-600 rounded-full"></div>
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar + Content */}
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-gradient-to-b from-gray-900 to-blue-900 min-h-screen text-white">
          <nav className="py-4">
            <a href="/" className="block px-6 py-3 text-gray-300 hover:bg-blue-800 transition">
              Inicio
            </a>
            <a href="/projects" className="block px-6 py-3 bg-orange-500 font-medium">
              Proyectos
            </a>
            <a href="#" className="block px-6 py-3 text-gray-300 hover:bg-blue-800 transition">
              Planificación
            </a>
            <a href="#" className="block px-6 py-3 text-gray-300 hover:bg-blue-800 transition">
              Colaboración
            </a>
            <a href="#" className="block px-6 py-3 text-gray-300 hover:bg-blue-800 transition">
              Repositorio
            </a>
            <a href="#" className="block px-6 py-3 text-gray-300 hover:bg-blue-800 transition">
              IA Predictiva
            </a>
            <a href="#" className="block px-6 py-3 text-gray-300 hover:bg-blue-800 transition">
              Panel Analítico
            </a>
            <a href="#" className="block px-6 py-3 text-gray-300 hover:bg-blue-800 transition">
              Configuración
            </a>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
};