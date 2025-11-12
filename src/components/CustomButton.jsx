import React from 'react';
import { useDarkMode } from '../context/DarkModeContext.jsx';

const CustomButton = ({ btnType, title, handleClick, styles }) => {
  const { darkMode } = useDarkMode();

  return (
    <button
      type={btnType}
      className={`font-epilogue font-semibold text-[16px] leading-[16px] min-h-[52px] px-4 rounded-[10px] ${
        darkMode
          ? 'bg-[#2A2A3D] text-white hover:bg-[#3A3A5A]'
          : 'bg-[#FFFFE2] text-black hover:bg-[#EBEBCE]'
      } ${styles}`}
      onClick={handleClick}
    >
      {title}
    </button>
  );
};

export default CustomButton;
