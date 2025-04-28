import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";

const Layout: React.FC = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const handleToggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className="layout">
      <div className={`layout__sidebar ${isSidebarCollapsed ? 'collapsed' : ''}`}>
        <Sidebar />
      </div>

      <div className={`layout__main ${isSidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="layout__header">
          <Header onToggleSidebar={handleToggleSidebar} />
        </div>

        <main className="layout__content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
