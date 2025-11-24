import React from "react";
import ProgressBar from "../atoms/ProgressBar";
import StatusBadge from "../atoms/StatusBadge";

interface Props {
  nombre: string;
  rol: string;
  jefe: string;
  estado: "Activo" | "Finalizado" | "Pendiente";
  progreso: number;
  miembros: number;
}

const ProjectRow: React.FC<Props> = ({ nombre, rol, jefe, estado, progreso, miembros }) => (
  <tr className="border-b hover:bg-gray-50">
    <td className="py-2 font-medium">{nombre}</td>
    <td>{rol}</td>
    <td>{jefe}</td>
    <td><StatusBadge status={estado} /></td>
    <td><ProgressBar value={progreso} /></td>
    <td>{miembros} miembros</td>
  </tr>
);

export default ProjectRow;
