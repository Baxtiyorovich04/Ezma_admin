import React from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { LuLayoutDashboard } from "react-icons/lu";
import { LuLibraryBig } from "react-icons/lu";
import { LuBook } from "react-icons/lu";
import { MdOutlineYoutubeSearchedFor } from "react-icons/md";
import { TbSettingsStar } from "react-icons/tb";
import { MdAddToPhotos } from "react-icons/md";
import { HiOutlineLogout } from "react-icons/hi";
import { FaRegUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Sidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const menuItems = [
    { path: "/", label: t("sidebar.dashboard"), icon: <LuLayoutDashboard /> },
    { path: "/libraries", label: t("sidebar.libraries"), icon: <LuLibraryBig /> },
    { path: "/books", label: t("sidebar.books"), icon: <LuBook /> },
    {
      path: "/mostsearched",
      label: t("sidebar.mostSearched"),
      icon: <MdOutlineYoutubeSearchedFor />,
    },
    { path: "/settings", label: t("sidebar.settings"), icon: <TbSettingsStar /> },
    { path: "/addlibrary", label: t("sidebar.addLibrary"), icon: <MdAddToPhotos /> },
  ];

  return (
    <div className="sidebar">
      <div className="sidebartop">
        <div className="sidebar__logo">
          <h2>Ezma Admin</h2>
        </div>
        <NavLink className="sidebar__profile" to="/profile">
          <FaRegUserCircle className="avatar" /> Sodiqov Abdulloh ({t("sidebar.admin")})
        </NavLink>
        <ul className="sidebar__menu">
          {menuItems.map((item) => (
            <Link to={item.path} key={item.path}>
              <li
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
      <div
        onClick={() => {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          navigate("/login");
        }}
        className="sidebar__menu-item"
      >
        <span className="icon">
          <HiOutlineLogout />
        </span>
        <span className="text">{t("sidebar.logout")}</span>
      </div>
    </div>
  );
};

export default Sidebar;
