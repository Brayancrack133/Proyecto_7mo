import React from "react";
import Card from "../atoms/Card";

const InfoCardGroup: React.FC = () => (
  <div className="grid grid-cols-4 gap-4 mb-6">
    <Card title="Mis Proyectos" value={2} color="text-blue-600" />
    <Card title="Como Colaborador" value={3} color="text-purple-600" />
    <Card title="Activos" value={2} color="text-green-600" />
    <Card title="Finalizados" value={0} color="text-gray-600" />
  </div>
);

export default InfoCardGroup;
