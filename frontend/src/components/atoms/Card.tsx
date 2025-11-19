import React from "react";

interface CardProps {
  title: string;
  value: string | number;
  color?: string;
}

const Card: React.FC<CardProps> = ({ title, value, color = "text-blue-600" }) => (
  <div className="bg-white p-4 rounded-xl shadow">
    <p className="text-gray-500 text-sm">{title}</p>
    <h2 className={`text-2xl font-semibold ${color}`}>{value}</h2>
  </div>
);

export default Card;
