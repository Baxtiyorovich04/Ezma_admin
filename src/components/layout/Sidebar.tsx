import React from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import avatar from "../../assets/icons/circle-user-solid.svg";
import { LuLayoutDashboard } from "react-icons/lu";
import { LuLibraryBig } from "react-icons/lu";
import { LuBook } from "react-icons/lu";
import { MdOutlineYoutubeSearchedFor } from "react-icons/md";
import { TbSettingsStar } from "react-icons/tb";
const Sidebar: React.FC = () => {
  const location = useLocation();

  const menuItems = [
    { path: "/", label: "Bosh Sahifa", icon: <LuLayoutDashboard /> },
    { path: "/libraries", label: "Kitubxonalar", icon: <LuLibraryBig /> },
    { path: "/books", label: "Kitoblar", icon: <LuBook /> },
    {
      path: "/mostsearched",
      label: "Eng Ko'p Qidirilgan",
      icon: <MdOutlineYoutubeSearchedFor />,
    },
    { path: "/settings", label: "Sozlamalar", icon: <TbSettingsStar /> },
  ];

  return (
    <div className="sidebar">
      <div className="sidebar__logo">
        <h2>Ezma Admin</h2>
      </div>
      <NavLink className="sidebar__profile" to="/profile">
        <img src={avatar} alt="" /> Amir sourl (admin)
      </NavLink>
      <ul className="sidebar__menu">
        {menuItems.map((item) => (
          <Link to={item.path}>
          <li
            key={item.path}
            className={`sidebar__menu-item ${
              location.pathname === item.path ? "active" : ""
            }`}
          >
              <span className="icon">{item.icon}</span>
              <span className="text">{item.label}</span>
          </li>
            </Link>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
