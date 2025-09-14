import React from "react";

const FormField = ({
  LabelName,
  placeholder,
  inputType,
  isTextArea,
  value,
  handleChange,
  options, // 👈 new prop for select options
}) => {
  return (
    <label className="flex flex-1 flex-col w-full">
      {LabelName && (
        <span className="font-epilogue font-medium text-[14px] leading-[22px] text-[#808191] mb-[10px]">
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
          className="py-[15px] sm:px-[25px] px-[15px] outline-none border-[2px] border-[#3a3a43] bg-transparent font-epilogue text-[#3a3a43] text-[14px] leading-[30px] placeholder:text-[#4b5264] rounded-[10px] sm:min-w-[300px]"
        />
      ) : inputType === "select" ? (
        <select
          required
          value={value}
          onChange={handleChange}
          className="py-[15px] sm:px-[25px] px-[15px] outline-none border-[2px] border-[#3a3a43] bg-transparent font-epilogue text-[#3a3a43] text-[14px] leading-[30px] rounded-[10px] sm:min-w-[300px]"
        >
          <option value="" disabled>
            {placeholder || "Select an option"}
          </option>
          {options?.map((option, idx) => (
            <option key={idx} value={option} className="text-black">
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
          className="py-[15px] sm:px-[25px] px-[15px] outline-none border-[2px] border-[#3a3a43] bg-transparent font-epilogue text-[#3a3a43] text-[14px] leading-[30px] placeholder:text-[#4b5264] rounded-[10px] sm:min-w-[300px]"
        />
      )}
    </label>
  );
};

export default FormField;
