import React from "react";

interface Props {
  value: number;
  color?: string;
}

const ProgressBar: React.FC<Props> = ({ value, color = "bg-purple-500" }) => (
  <div className="w-28 bg-gray-200 rounded-full h-2">
    <div className={`${color} h-2 rounded-full`} style={{ width: `${value}%` }}></div>
  </div>
);

export default ProgressBar;
