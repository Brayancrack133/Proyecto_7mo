import React from "react";
import InfoCardGroup from "../components/molecules/InfoCardGroup";
import ProjectTable, { ProjectData } from "../components/organisms/ProjectTable"; // Asegúrate de importar ProjectData o ProjectTableProps
import DashboardLayout from "../components/templates/DashboardLayout";

// --- Datos de Ejemplo que cumplen con el tipo ProjectData ---
const DUMMY_PROJECTS: ProjectData[] = [
  { nombre: "App Web Principal", rol: "Líder Técnico", jefe: "Ana Pérez", estado: "Activo", progreso: 85, miembros: 4 },
  { nombre: "Integración de API", rol: "Desarrollador", jefe: "Juan Soto", estado: "Pendiente", progreso: 30, miembros: 2 },
  { nombre: "Migración de Base de Datos", rol: "Arquitecto", jefe: "Laura Díaz", estado: "Finalizado", progreso: 100, miembros: 3 },
];
// -----------------------------------------------------------

const Dashboard: React.FC = () => (
  <DashboardLayout>
    <h1 className="text-2xl font-bold text-[#1E293B] mb-2">Gestión de Proyectos</h1>
    <p className="text-gray-500 text-sm mb-4">Administra tus proyectos y colaboraciones</p>
    <InfoCardGroup />
    {/* ✨ SOLUCIÓN: Pasarle la prop 'data' con el array de proyectos */}
    <ProjectTable data={DUMMY_PROJECTS} /> 
  </DashboardLayout>
);

export default Dashboard;