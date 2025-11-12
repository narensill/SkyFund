import React from "react";
import { useDarkMode } from "../context/DarkModeContext.jsx";

const FormField = ({
  LabelName,
  placeholder,
  inputType,
  isTextArea,
  value,
  handleChange,
  options,
}) => {
  const { darkMode } = useDarkMode();

  const baseClass =
    "py-[15px] sm:px-[25px] px-[15px] outline-none border-[2px] font-epilogue text-[14px] leading-[30px] rounded-[10px] sm:min-w-[300px]";

  const darkClasses =
    "bg-[#2A2A3D] border-[#3a3a43] text-white placeholder:text-gray-400";
  const lightClasses =
    "bg-transparent border-[#3a3a43] text-[#3a3a43] placeholder:text-[#4b5264]";

  return (
    <label className="flex flex-1 flex-col w-full">
      {LabelName && (
        <span
          className={`font-epilogue font-medium text-[14px] leading-[22px] mb-[10px] ${
            darkMode ? "text-gray-300" : "text-[#808191]"
          }`}
        >
          {LabelName}
        </span>
      )}

      {isTextArea ? (
        <textarea
          required
          value={value}
          onChange={handleChange}
          rows={8}
          placeholder={placeholder}
          className={`${baseClass} ${
            darkMode ? darkClasses : lightClasses
          }`}
        />
      ) : inputType === "select" ? (
        <select
          required
          value={value}
          onChange={handleChange}
          className={`${baseClass} ${
            darkMode ? darkClasses : lightClasses
          }`}
        >
          <option value="" disabled>
            {placeholder || "Select an option"}
          </option>
          {options?.map((option, idx) => (
            <option
              key={idx}
              value={option}
              className={darkMode ? "text-white" : "text-black"}
            >
              {option}
            </option>
          ))}
        </select>
      ) : (
        <input
          required
          value={value}
          onChange={handleChange}
          type={inputType}
          step="0.1"
          placeholder={placeholder}
          className={`${baseClass} ${
            darkMode ? darkClasses : lightClasses
          }`}
        />
      )}
    </label>
  );
};

export default FormField;
