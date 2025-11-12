import React from "react";
import { tagType, thirdweb } from "../assets";
import { daysLeft } from "../utils";
import { useDarkMode } from "../context/DarkModeContext.jsx"; // import dark mode

const CampaignCard = ({
  owner,
  title,
  description,
  target,
  deadline,
  amountCollected,
  image,
  handleClick,
}) => {
  const remainingDays = daysLeft(deadline);
  const { darkMode } = useDarkMode(); // access dark mode

  const parseDescription = (description) => {
    if (!description || typeof description !== "string") return {};
    const clean = description
      .replace(/\s*\|\|\s*/g, "||")
      .replace(/\s*::\s*/g, "::")
      .trim();

    const data = {};
    const segments = clean
      .split("||")
      .map((seg) => seg.trim())
      .filter(Boolean);

    segments.forEach((seg) => {
      const match = seg.match(/^([^:]+)::(.*)$/);
      if (match) {
        const key = match[1].trim().toLowerCase();
        const value = match[2].trim();
        data[key] = value;
      }
    });

    if (!data.desc) {
      const match = clean.match(/desc::(.*)/i);
      if (match && match[1]) data.desc = match[1].trim();
    }

    return data;
  };

  const parsed = parseDescription(description);

  return (
    <div
      className={`sm:w-[288px] w-full rounded-[15px] cursor-pointer shadow-secondary 
        ${darkMode ? "bg-[#1A1A2E]" : "bg-[#FFFFE2]"}`}
      onClick={handleClick}
    >
      <img
        src={`https://gateway.pinata.cloud/ipfs/${image}`}
        alt="fund"
        crossOrigin="anonymous"
        referrerPolicy="no-referrer"
        className="w-full h-[158px] object-cover rounded-[15px]"
      />
      <div className="flex flex-col p-4">
        <div className="flex flex-row items-center mb-[18px]">
          <img
            src={tagType}
            alt="type"
            className={`w-[17px] h-[17px] object-contain ${
              darkMode ? "filter brightness-125" : ""
            }`}
          />
          <p
            className={`ml-[12px] mt-[2px] font-epilogue font-medium text-[12px] ${
              darkMode ? "text-[#D9D9FF]" : "text-[#3a3a43]"
            }`}
          >
            {parsed.category || "Unknown"}
          </p>
        </div>

        <div className="block">
          <h3
            className={`font-epilogue font-semibold text-[16px] text-left leading-[26px] truncate ${
              darkMode ? "text-white" : "text-black"
            }`}
          >
            {title}
          </h3>
          <p
            className={`mt-[5px] font-epilogue font-normal text-[12px] text-left leading-[18px] truncate ${
              darkMode ? "text-gray-300" : "text-[#3a3a43]"
            }`}
          >
            {parsed.desc || description}
          </p>
        </div>

        <div>
          <div className="flex justify-between flex-wrap mt-[15px] gap-2">
            <div className="flex flex-col">
              <h4
                className={`font-epilogue font-semibold text-[14px] leading-[22px] ${
                  darkMode ? "text-white" : "text-black"
                }`}
              >
                {amountCollected}
              </h4>
              <p
                className={`mt-[3px] font-epilogue font-normal text-[12px] leading-[18px] sm:max-w-[120px] truncate ${
                  darkMode ? "text-gray-300" : "text-black"
                }`}
              >
                Raised of {target}
              </p>
            </div>
            <div className="flex flex-col">
              <h4
                className={`font-epilogue font-semibold text-[14px] leading-[22px] ${
                  darkMode ? "text-white" : "text-black"
                }`}
              >
                {remainingDays}
              </h4>
              <p
                className={`mt-[3px] font-epilogue font-normal text-[12px] leading-[18px] sm:max-w-[120px] truncate ${
                  darkMode ? "text-gray-300" : "text-black"
                }`}
              >
                Days Left
              </p>
            </div>
          </div>

          <div className="flex items-center mt-[20px] gap-[12px]">
            <div
              className={`w-[30px] h-[30px] rounded-full flex justify-center items-center ${
                darkMode ? "bg-[#2A2A3D]" : "bg-[#FFFFE2]"
              }`}
            >
              <img
                src={thirdweb}
                alt="user"
                className="w-1/2 h-1/2 object-contain"
              />
            </div>
            <p
              className={`flex-1 font-epilogue font-normal text-[12px] truncate ${
                darkMode ? "text-gray-300" : "text-[#3a3a43]"
              }`}
            >
              by{" "}
              <span className={darkMode ? "text-white" : "text-black"}>
                {owner}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignCard;
