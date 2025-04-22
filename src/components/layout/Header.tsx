import React from "react";

const Header: React.FC = () => {
  return (
    <div className="header">
      <div className="header__left">
        <div className="header__search">
          <input type="text" placeholder="Search..." />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </div>
      </div>

      <div className="header__right">
        <div className="header__profile">
          <img src="https://via.placeholder.com/32" alt="Profile" />
          <span>Admin</span>
        </div>
      </div>
    </div>
  );
};

export default Header;
