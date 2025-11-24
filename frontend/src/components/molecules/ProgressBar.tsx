import React from 'react';

interface ProgressBarProps {
  progress: number;
  showLabel?: boolean;
  color?: 'blue' | 'green' | 'yellow' | 'red';
  size?: 'sm' | 'md' | 'lg';
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  showLabel = true,
  color = 'blue',
  size = 'md'
}) => {
  const colors = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    red: 'bg-red-500'
  };

  const sizes = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3'
  };

  const getColor = () => {
    if (progress >= 75) return colors.green;
    if (progress >= 50) return colors.blue;
    if (progress >= 25) return colors.yellow;
    return colors.red;
  };

  return (
    <div className="flex items-center gap-2 w-full">
      <div className="flex-1 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className={`${getColor()} ${sizes[size]} rounded-full transition-all duration-300`}
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-sm font-medium text-gray-700 min-w-[3rem] text-right">
          {progress}%
        </span>
      )}
    </div>
  );
};