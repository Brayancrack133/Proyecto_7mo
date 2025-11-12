import React from "react";
import Sidebar from "../organisms/Sidebar";
import Navbar from "../organisms/Navbar";

const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex h-screen">
    <Sidebar />
    <div className="flex flex-col flex-grow">
      <Navbar />
      <div className="p-6 bg-[#F5F6FA] h-full overflow-y-auto">{children}</div>
    </div>
  </div>
);

export default DashboardLayout;
