import React from "react";

interface Props {
  status: "Activo" | "Finalizado" | "Pendiente";
}

const StatusBadge: React.FC<Props> = ({ status }) => {
  const color =
    status === "Activo"
      ? "bg-green-500"
      : status === "Finalizado"
      ? "bg-blue-500"
      : "bg-gray-400";

  return (
    <span className={`px-2 py-1 rounded-full text-white text-xs ${color}`}>
      {status}
    </span>
  );
};

export default StatusBadge;
