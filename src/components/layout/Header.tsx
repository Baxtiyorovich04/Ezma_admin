import React, { useState, useRef, useEffect } from "react";
import { HiMiniMoon, HiMiniSun } from "react-icons/hi2";
import { IoIosArrowDown } from "react-icons/io";
import useThemeStore from "../../store/theme";
import { FaRegUserCircle } from "react-icons/fa";
import { CgMenu } from "react-icons/cg";
import { useTranslation } from "react-i18next";
import { useProfile } from "../../hooks/useProfile";
import { NavLink } from "react-router-dom";


interface HeaderProps {
  onToggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const { data: profile } = useProfile();
  const { i18n } = useTranslation();
  const { theme, toggleTheme } = useThemeStore();
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const languages = [
    { code: "uz", name: "Uzb", icon: "UZ" },
    { code: "ru", name: "Рус", icon: "RU" },
  ];

  const currentLanguage =
    languages.find((lang) => lang.code === i18n.language) || languages[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsLanguageOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLanguageChange = async (langCode: string) => {
    if (langCode === i18n.language) {
      setIsLanguageOpen(false);
      return;
    }

    setIsLoading(true);
    try {
      await i18n.changeLanguage(langCode);
    } finally {
      setIsLoading(false);
      setIsLanguageOpen(false);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent, langCode: string) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleLanguageChange(langCode);
    }
  };

  return (
    <div className="header">
      <div className="header__left">
        <div className="header__logo">
          <h2>Ezma Admin</h2>
        </div>
        <button className="sidebar-btn" onClick={onToggleSidebar}>
          <CgMenu />
        </button>
      </div>

      <div className="header__right">
        <div className="language-switcher" ref={dropdownRef}>
          <button
            className="language-switcher__button"
            onClick={() => setIsLanguageOpen(!isLanguageOpen)}
            aria-expanded={isLanguageOpen}
            aria-haspopup="true"
            aria-label="Select language"
            disabled={isLoading}
          >
            <span className="language-icon">{currentLanguage.icon}</span>
            {currentLanguage.name}
            <IoIosArrowDown
              className={`arrow ${isLanguageOpen ? "open" : ""}`}
            />
          </button>
          {isLanguageOpen && (
            <div
              className="language-switcher__dropdown"
              role="menu"
              aria-label="Language options"
            >
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  className={`language-switcher__option ${
                    lang.code === i18n.language ? "active" : ""
                  }`}
                  onClick={() => handleLanguageChange(lang.code)}
                  onKeyDown={(e) => handleKeyDown(e, lang.code)}
                  role="menuitem"
                  tabIndex={0}
                  aria-selected={lang.code === i18n.language}
                >
                  <span className="language-icon">{lang.icon}</span>
                  {lang.name}
                </button>
              ))}
            </div>
          )}
        </div>
        <button className="theme" onClick={toggleTheme}>
          {theme === "dark" ? <HiMiniSun /> : <HiMiniMoon />}
        </button>
        <NavLink to="/profile">
          <div className="header__profile">
            <FaRegUserCircle className="avatar" />{" "}
            <span>{profile?.name || "Loading..."}</span>
          </div>
        </NavLink>
      </div>
    </div>
  );
};

export default Header;
