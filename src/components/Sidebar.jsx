import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { dashboard, logo, logoDark, sun, moon } from '../assets';
import { navlinks } from '../constants';
import { useDarkMode } from '../context/DarkModeContext.jsx';

const Icon = ({ styles, name, imgUrl, isActive, disabled, handleClick }) => (
  <div
    className={`w-[48px] h-[48px] rounded-[10px] ${
      isActive && isActive === name && 'bg-[#2c2f32]'
    } flex justify-center items-center ${!disabled && 'cursor-pointer'} ${styles}`}
    onClick={handleClick}
  >
    <img
      src={imgUrl}
      alt="icon"
      className={`w-1/2 h-1/2 ${isActive !== name && isActive ? 'grayscale' : ''}`}
    />
  </div>
);

const Sidebar = () => {
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState(dashboard);
  const { darkMode, toggleDarkMode } = useDarkMode();

  // ✅ dynamically set logo & toggle icon
  const logoImg = darkMode ? logoDark : logo;
  const toggleIcon = darkMode ? sun : moon;

  return (
    <div className="flex justify-between items-center flex-col sticky top-5 h-[93vh]">
      {/* Logo */}
      <Link to="/home">
        <Icon
          styles={`w-[52px] h-[52px] shadow-secondary ${
            darkMode ? 'bg-[#1A1A2E]' : 'bg-[#FFFFF2]'
          }`}
          imgUrl={logoImg}
        />
      </Link>

      {/* Nav + Toggle */}
      <div
        className={`flex-1 flex flex-col justify-between items-center rounded-[20px] w-[76px] py-4 mt-12 ${
          darkMode ? 'bg-[#1A1A2E]' : 'bg-[#FFFFE2]'
        }`}
      >
        {/* Navigation Links */}
        <div className="flex flex-col justify-center items-center gap-3">
          {navlinks.map((link) => (
            <Icon
              key={link.name}
              {...link}
              isActive={isActive}
              handleClick={() => {
                if (!link.disabled) {
                  setIsActive(link.name);
                  navigate(link.link);
                }
              }}
              styles={`shadow-secondary hover:bg-[#EBEBCE] ${
                darkMode ? 'bg-[#2A2A3D] hover:bg-[#3A3A55]' : 'bg-[#FFFFE2]'
              }`}
            />
          ))}
        </div>

        {/* ✅ Dark/Light Toggle */}
        <Icon
          styles={`shadow-secondary border ${
            darkMode
              ? 'bg-[#2A2A3D] border-[#555577]'
              : 'bg-[#FFFFE2] border-[#3a3a43]'
          }`}
          imgUrl={toggleIcon}
          handleClick={toggleDarkMode}
        />
      </div>
    </div>
  );
};

export default Sidebar;
