import React from 'react';
import { useDarkMode } from '../context/DarkModeContext.jsx';

const CountBox = ({ title, value }) => {
  const { darkMode } = useDarkMode();

  return (
    <div className="flex flex-col items-center w-[150px]">
      <h4
        className={`font-epilogue font-bold text-[30px] p-3 rounded-t-[10px] w-full text-center truncate shadow-secondary ${
          darkMode ? 'bg-[#2A2A3D] text-white' : 'bg-[#FFFFE2] text-black'
        }`}
      >
        {value}
      </h4>
      <p
        className={`font-epilogue font-normal text-[16px] px-3 py-2 w-full rounded-b-[10px] text-center shadow-secondary ${
          darkMode ? 'bg-[#1A1A2E] text-gray-300' : 'bg-[#EBEBCE] text-[#3a3a43]'
        }`}
      >
        {title}
      </p>
    </div>
  );
};

export default CountBox;
