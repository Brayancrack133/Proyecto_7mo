import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:4000/api/projects";

export default function ProjectManagementPage() {
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    axios.get(API_URL).then((res) => {
      setProjects(res.data.data);
    });
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">

      {/* SIDEBAR */}
      <aside className="w-64 bg-[#071739] text-white p-6 space-y-4">

        <div className="text-3xl font-bold">F</div>

        <nav className="mt-10 space-y-2">
          <p className="cursor-pointer px-4 py-2 rounded-lg">Inicio</p>
          <p className="cursor-pointer px-4 py-2 rounded-lg bg-orange-300 text-black">
            Proyectos
          </p>
          <p className="cursor-pointer px-4 py-2 rounded-lg">Planificación</p>
          <p className="cursor-pointer px-4 py-2 rounded-lg">Colaboración</p>
          <p className="cursor-pointer px-4 py-2 rounded-lg">Repositorio</p>
          <p className="cursor-pointer px-4 py-2 rounded-lg">IA Predictiva</p>
          <p className="cursor-pointer px-4 py-2 rounded-lg">Panel Analítico</p>
          <p className="cursor-pointer px-4 py-2 rounded-lg">Configuración</p>
        </nav>

      </aside>

      {/* MAIN */}
      <main className="flex-1 p-8">

        {/* Header */}
        <header className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-xl font-bold text-[#1A4A83]">Gestión de Proyectos</h1>
            <p className="text-sm text-gray-500">
              Administra tus proyectos y colaboradores
            </p>
          </div>

          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow">
            + Nuevo Proyecto
          </button>
        </header>

        {/* CONTENT */}
        <section className="bg-white p-10 rounded-xl shadow-md min-h-[350px] flex flex-col items-center justify-center">

          {projects.length === 0 ? (
            <>
              <div className="text-6xl mb-4">📄</div>
              <p className="text-lg font-medium">No hay proyectos aún</p>
              <p className="text-gray-500 text-sm mb-4">
                Comienza creando tu primer proyecto para organizar y planificar tu trabajo
              </p>
              <button className="bg-[#0C1427] hover:bg-[#1A2438] text-white px-4 py-2 rounded">
                Crear Primer Proyecto
              </button>
            </>
          ) : (
            <ul className="w-full">
              {projects.map(p => (
                <li key={p.id_proyecto} className="p-4 border rounded mb-2">
                  {p.nombre}
                </li>
              ))}
            </ul>
          )}

        </section>

      </main>

    </div>
  );
}
