import React from 'react';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color: 'blue' | 'purple' | 'green' | 'gray';
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  color,
  className = ''
}) => {
  const colors = {
    blue: 'bg-blue-100 text-blue-600',
    purple: 'bg-purple-100 text-purple-600',
    green: 'bg-green-100 text-green-600',
    gray: 'bg-gray-100 text-gray-600'
  };

  const textColors = {
    blue: 'text-blue-600',
    purple: 'text-purple-600',
    green: 'text-green-600',
    gray: 'text-gray-600'
  };

  return (
    <div className={`bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-gray-600 text-sm">{title}</span>
        <div className={`w-10 h-10 ${colors[color]} rounded-lg flex items-center justify-center`}>
          {icon}
        </div>
      </div>
      <div className={`text-3xl font-bold ${textColors[color]}`}>{value}</div>
    </div>
  );
};