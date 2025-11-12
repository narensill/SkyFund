import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useStateContext } from "../context/useStateContext.js";
import { CustomButton, CountBox } from "../components";
import { calculateBarPercentage, daysLeft } from "../utils";
import { thirdweb } from "../assets";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDarkMode } from "../context/DarkModeContext.jsx";

const CampaignDetails = () => {
  const { state } = useLocation();
  const { donate, getDonations, contract, address } = useStateContext();
  const { darkMode } = useDarkMode();
  const [isLoading, setIsLoading] = useState(false);
  const [amount, setAmount] = useState("");
  const [donators, setDonators] = useState([]);

  const remainingDays = daysLeft(state.deadline);

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

  const parsed = parseDescription(state.description);

  const fetchDonators = async () => {
    const data = await getDonations(state.pId);
    setDonators(data);
  };

  useEffect(() => {
    if (contract) fetchDonators();
  }, [contract, address]);

  const handleDonate = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast.error("Please enter a valid donation amount");
      return;
    }
    setIsLoading(true);
    try {
      await donate(state.pId, amount);
      toast.success("Donation successful! Thank you for your support.");
      setAmount("");
      fetchDonators();
    } catch (err) {
      console.error(err);
      toast.error("Donation failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const cardBg = darkMode ? "bg-[#1A1A2E]" : "bg-[#FFFFE2]";
  const sectionBg = darkMode ? "bg-[#2A2A3D]" : "bg-[#EBEBCE]";
  const textPrimary = darkMode ? "text-white" : "text-black";
  const textSecondary = darkMode ? "text-gray-300" : "text-[#3a3a43]";
  const inputText = darkMode
    ? "text-white placeholder:text-gray-400 border-gray-500"
    : "text-[#3a3a43] placeholder:text-[#3a3a43] border-[#3a3a43]";
  const progressBarBg = darkMode ? "bg-[#4acd8d]" : "bg-[#4acd8d]";
  const progressBarContainer = darkMode ? "bg-gray-700" : "bg-[#3a3a43]";

  return (
    <div className="px-4 sm:px-6 lg:px-12">
      <ToastContainer position="top-right" autoClose={3000} />
      {isLoading && "Loading..."}

      <div className="w-full flex flex-col mt-10 gap-[30px]">
        <div className="flex flex-col lg:flex-row gap-[30px]">
          <div className="flex-1 flex-col">
            <img
              src={`https://gateway.pinata.cloud/ipfs/${state.image}`}
              alt="campaign"
              crossOrigin="anonymous"
              referrerPolicy="no-referrer"
              className="w-full h-[250px] sm:h-[350px] lg:h-[410px] object-cover rounded-[10px]"
            />
            <div
              className={`relative w-full h-[5px] ${progressBarContainer} mt-2`}
            >
              <div
                className={`h-full ${progressBarBg}`}
                style={{
                  width: `${calculateBarPercentage(
                    state.target,
                    state.amountCollected
                  )}%`,
                  maxWidth: "100%",
                }}
              ></div>
            </div>
          </div>

          <div className="flex flex-row lg:flex-col md:w-[250px] w-full flex-wrap justify-between gap-[20px]">
            <CountBox title="Days Left" value={remainingDays} />
            <CountBox
              title={`Raised of ${state.target}`}
              value={state.amountCollected}
            />
            <CountBox title="Total Contributors" value={donators.length} />
          </div>
        </div>

        <div className="mt-[20px] w-full flex flex-col sm:flex-row gap-4 items-stretch">
          <div className="w-full sm:w-1/2 flex flex-col">
            <h4
              className={`font-epilogue font-bold text-[22px] p-1 rounded-t-[10px] h-[48px] text-left px-[20px] truncate shadow-secondary ${cardBg} ${textPrimary}`}
            >
              Creator of Campaign
            </h4>
            <div
              className={`flex items-center gap-3 p-2 rounded-b-[10px] shadow-secondary flex-1 ${sectionBg}`}
            >
              <div
                className={`w-[30px] h-[30px] rounded-full flex justify-center items-center ${cardBg}`}
              >
                <img
                  src={thirdweb}
                  alt="user"
                  className="w-1/2 h-1/2 object-contain"
                />
              </div>
              <p
                className={`font-epilogue font-medium text-[14px] break-words ${textSecondary}`}
              >
                {state.owner}
              </p>
            </div>
          </div>

          <div className="w-full sm:w-1/2 flex flex-col">
            <h4
              className={`font-epilogue font-bold text-[22px] p-1 rounded-t-[10px] h-[48px] text-left px-[20px] truncate shadow-secondary ${cardBg} ${textPrimary}`}
            >
              Creator Name
            </h4>
            <div
              className={`flex items-center gap-3 p-2 rounded-b-[10px] shadow-secondary flex-1 ${sectionBg}`}
            >
              <p
                className={`font-epilogue font-medium text-[14px] truncate ${textSecondary}`}
              >
                {parsed.name || "Unknown"}
              </p>
            </div>
          </div>
        </div>

        <div className="w-full flex flex-col lg:flex-row gap-4">
          <div className="w-full lg:w-3/4 flex flex-col gap-4">
            <div>
              <h4
                className={`font-epilogue font-bold text-[22px] p-1 rounded-t-[10px] h-[48px] text-left px-[20px] truncate shadow-secondary ${cardBg} ${textPrimary}`}
              >
                Campaign Overview
              </h4>
              <div
                className={`p-3 rounded-b-[10px] shadow-secondary ${sectionBg}`}
              >
                <p
                  className={`font-epilogue font-medium text-[15px] break-words ${textSecondary}`}
                >
                  {parsed.desc || state.description}
                </p>
              </div>
            </div>

            <div>
              <h4
                className={`font-epilogue font-bold text-[22px] p-1 rounded-t-[10px] h-[48px] text-left px-[20px] truncate shadow-secondary ${cardBg} ${textPrimary}`}
              >
                Donators
              </h4>
              <div
                className={`flex flex-col gap-2 p-3 rounded-b-[10px] shadow-secondary ${sectionBg}`}
              >
                {donators.length > 0 ? (
                  donators.map((item, index) => (
                    <p
                      key={`${item.donator}-${index}`}
                      className={`font-epilogue font-normal text-[14px] leading-[22px] break-words ${textSecondary}`}
                    >
                      {index + 1}. {item.donator}
                    </p>
                  ))
                ) : (
                  <p
                    className={`font-epilogue font-medium text-[14px] ${textSecondary}`}
                  >
                    No donators yet. Be the first!
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="w-full lg:w-1/4 flex flex-col self-start">
            <h4
              className={`font-epilogue font-bold text-[22px] p-1 rounded-t-[10px] h-[48px] text-left px-[20px] truncate shadow-secondary ${cardBg} ${textPrimary}`}
            >
              Fund the Campaign now!!
            </h4>
            <div
              className={`flex flex-col gap-3 py-2 px-4 rounded-b-[10px] shadow-secondary ${sectionBg}`}
            >
              <input
                type="number"
                placeholder="ETH 0.1"
                step="0.01"
                className={`w-full py-[10px] px-[15px] outline-none border-[1px] rounded-[10px] font-epilogue text-[14px] ${inputText}`}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
              <CustomButton
                btnType="button"
                title="Fund Campaign"
                styles="w-full bg-[#20B024] hover:bg-[#1a8f1d] transition-colors"
                handleClick={handleDonate}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignDetails;
