import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";

const Layout: React.FC = () => {
  return (
    <div className="layout">
      <div className="layout__sidebar">
        <Sidebar />
      </div>

      <div className="layout__main">
        <div className="layout__header">
          <Header />
        </div>

        <main className="layout__content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
