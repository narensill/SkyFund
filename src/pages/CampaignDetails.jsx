import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { ethers } from "ethers";
import { useStateContext } from "../context/useStateContext.js";
import { CustomButton, CountBox } from "../components";
import { calculateBarPercentage, daysLeft } from "../utils";
import { thirdweb } from "../assets";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CampaignDetails = () => {
  const { state } = useLocation();
  const { donate, getDonations, contract, address } = useStateContext();
  const [isLoading, setIsLoading] = useState(false);
  const [amount, setAmount] = useState("");
  const [donators, setDonators] = useState([]);

  const remainingDays = daysLeft(state.deadline);

  const parseDescription = (description) => {
    const parts = description.split("||");
    const data = {};
    parts.forEach((p) => {
      const [key, value] = p.split("::");
      data[key] = value;
    });
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

  return (
    <div>
      <ToastContainer position="top-right" autoClose={3000} />
      {isLoading && "Loading..."}

      {/* Container */}
      <div className="w-full flex flex-col mt-10 gap-[30px]">
        {/* Row 1: Image + Progress + CountBoxes */}
        <div className="flex md:flex-row flex-col gap-[30px]">
          {/* Campaign Image + Progress */}
          <div className="flex-1 flex-col">
            <img
              src={`https://gateway.pinata.cloud/ipfs/${state.image}`}
              alt="campaign"
              className="w-full h-[410px] object-cover rounded-[10px]"
            />
            <div className="relative w-full h-[5px] bg-[#3a3a43] mt-2">
              <div
                className="h-full bg-[#4acd8d]"
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

          {/* Count Boxes */}
          <div className="flex md:w-[150px] w-full flex-wrap justify-between gap-[25px]">
            <CountBox title="Days Left" value={remainingDays} />
            <CountBox
              title={`Raised of ${state.target}`}
              value={state.amountCollected}
            />
            <CountBox title="Total Contributors" value={donators.length} />
          </div>
        </div>

        {/* Row 2: Creator Section */}
        <div className="mt-[20px] w-full flex gap-4 items-stretch">
          <div className="w-1/2 flex flex-col">
            <h4 className="font-epilogue font-bold text-[28px] text-black p-1 bg-[#FFFFE2] rounded-t-[10px] h-[48px] text-left px-[20px] truncate shadow-secondary">
              Creator of Campaign
            </h4>
            <div className="flex items-center gap-3 p-1 bg-[#EBEBCE] rounded-b-[10px] shadow-secondary flex-1">
              <div className="w-[30px] h-[30px] rounded-full flex justify-center items-center bg-[#FFFFE2]">
                <img
                  src={thirdweb}
                  alt="user"
                  className="w-1/2 h-1/2 object-contain"
                />
              </div>
              <p className="font-epilogue font-medium text-[14px] text-[#3a3a43] truncate">
                {state.owner}
              </p>
            </div>
          </div>
          <div className="w-1/2 flex flex-col">
            <h4 className="font-epilogue font-bold text-[28px] text-black p-1 bg-[#FFFFE2] rounded-t-[10px] h-[48px] text-left px-[20px] truncate shadow-secondary">
              Creator Name
            </h4>
            <div className="flex items-center gap-3 p-1 bg-[#EBEBCE] rounded-b-[10px] shadow-secondary flex-1">
              <p className="font-epilogue font-medium text-[14px] text-[#3a3a43] truncate">
                {parsed.name || "Unknown"}
              </p>
            </div>
          </div>
        </div>

        {/* Row 3 + 4 + Fund Campaign aligned */}
        <div className="w-full flex gap-4">
          {/* Left Column (Overview + Donators) */}
          <div className="w-3/4 flex flex-col gap-4">
            <div>
              <h4 className="font-epilogue font-bold text-[28px] text-black p-1 bg-[#FFFFE2] rounded-t-[10px] h-[48px] text-left px-[20px] truncate shadow-secondary">
                Campaign Overview
              </h4>
              <div className="flex items-center gap-3 p-1 bg-[#EBEBCE] rounded-b-[10px] shadow-secondary">
                <p className="font-epilogue font-medium text-[14px] text-[#3a3a43] ml-[20px]">
                  {parsed.desc || state.description}
                </p>
              </div>
            </div>

            <div>
              <h4 className="font-epilogue font-bold text-[28px] text-black p-1 bg-[#FFFFE2] rounded-t-[10px] h-[48px] text-left px-[20px] truncate shadow-secondary">
                Donators
              </h4>
              <div className="flex items-center gap-3 p-1 bg-[#EBEBCE] rounded-b-[10px] shadow-secondary">
                {donators.length > 0 ? (
                  donators.map((item, index) => (
                    <div
                      key={`${item.donator}-${index}`}
                      className="flex justify-between items-center gap-4"
                    >
                      <p className="ml-[20px] font-epilogue font-normal text-[16px] text-[#3a3a43] leading-[26px] break-11">
                        {index + 1}.{item.donator}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="ml-[20px] font-epilogue font-medium text-[14px] text-[#3a3a43] leading-[26px] text-justify">
                    No donators are here yet. Be the first one to donate!
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Right Column (Fund Campaign) */}
          <div className="w-1/4 flex flex-col">
            <h4 className="font-epilogue font-bold text-[28px] text-black p-1 bg-[#FFFFE2] rounded-t-[10px] h-[48px] text-left px-[20px] truncate shadow-secondary">
              Fund the Campaign now!!
            </h4>
            <div className="flex flex-col gap-3 py-2 px-4 bg-[#EBEBCE] rounded-b-[10px] shadow-secondary flex-1">
              <input
                type="number"
                placeholder="ETH 0.1"
                step="0.01"
                className="w-full py-[10px] sm:px-[20px] px-[20px] outline-none border-[1px] border-[#3a3a43] bg-transparent font-epilogue text-[#3a3a43] text-[14px] leading-[30px] placeholder:text-[#4b5264] rounded-[10px] sm:min-w-[150px]"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
              <CustomButton
                btnType="button"
                title="Fund Campaign"
                styles="w-full bg-[#126B16]" // softer green
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
