import React from "react";
import { HiMiniMoon, HiMiniSun } from "react-icons/hi2";
import uzFlag from "../../assets/icons/flag-uz.avif";
import { IoIosArrowDown } from "react-icons/io";
import useThemeStore from "../../store/theme";
import {  FaRegUserCircle } from "react-icons/fa";
import { CgMenu } from "react-icons/cg";  
const Header: React.FC = () => {
  const { theme, toggleTheme } = useThemeStore();

  return (
    <div className="header">
      <div className="header__left">
        <button className="sidebar-btn">
          <CgMenu />
        </button>
      </div>

      <div className="header__right">
        <button className="dropdown-btn">
          <img src={uzFlag} alt="" />
          Uzb
          <IoIosArrowDown />
        </button>
        <button className="theme" onClick={toggleTheme}>
          {theme === "dark" ? <HiMiniSun /> : <HiMiniMoon />}
        </button>
        <div className="header__profile">
          <FaRegUserCircle className="avatar" /> <span>Abdulloh Sodiqov</span>
        </div>
      </div>
    </div>
  );
};

export default Header;
