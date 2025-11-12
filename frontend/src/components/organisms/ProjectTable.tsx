import React from "react";

type Props = {
  nombre: string;
  rol: string;
  jefe: string;
  estado: "Activo" | "Finalizado" | "Pendiente"; // Tipado exacto
  progreso: number;
  miembros: number;
};

const ProjectRow: React.FC<Props> = ({ nombre, rol, jefe, estado, progreso, miembros }) => {
  // Color del estado según valor
  const estadoColor =
    estado === "Activo"
      ? "text-green-600 bg-green-100"
      : estado === "Pendiente"
      ? "text-yellow-600 bg-yellow-100"
      : "text-gray-600 bg-gray-100";

  return (
    <tr className="border-b hover:bg-gray-50 transition-all">
      <td className="py-3 font-medium text-gray-800">{nombre}</td>
      <td className="text-center">{rol}</td>
      <td className="text-center">{jefe}</td>
      <td className="text-center">
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${estadoColor}`}>
          {estado}
        </span>
      </td>
      <td className="text-center">
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className={`h-2.5 rounded-full ${
              progreso === 100
                ? "bg-green-600"
                : progreso > 50
                ? "bg-blue-500"
                : "bg-orange-400"
            }`}
            style={{ width: `${progreso}%` }}
          ></div>
        </div>
        <span className="text-xs text-gray-600">{progreso}%</span>
      </td>
      <td className="text-center">{miembros} miembros</td>
    </tr>
  );
};

export default ProjectRow;
