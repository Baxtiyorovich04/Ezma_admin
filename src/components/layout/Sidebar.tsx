import React from "react";
import { Link, useLocation } from "react-router-dom";

const Sidebar: React.FC = () => {
  const location = useLocation();

  const menuItems = [
    { path: "/", label: "Dashboard", icon: "📊" },
    { path: "/profile", label: "Profile", icon: "👥" },
    { path: "/books", label: "Books", icon: "📦" },
    { path: "/libraries", label: "Orders", icon: "📝" },
  ];

  return (
    <div className="sidebar">
      <div className="sidebar__logo">
        <h2>Ezma Admin</h2>
      </div>
      <ul className="sidebar__menu">
        {menuItems.map((item) => (
          <li
            key={item.path}
            className={`sidebar__menu-item ${
              location.pathname === item.path ? "active" : ""
            }`}
          >
            <Link to={item.path}>
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
