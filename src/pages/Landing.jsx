import React from "react";
import { useNavigate } from "react-router-dom";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-[#FFFFF7] text-center">
      <h1 className="text-4xl sm:text-5xl font-bold mb-6 text-[#3a3a43]">
        Welcome to CrowdFundIt 🚀
      </h1>
      <p className="text-lg sm:text-xl text-[#3a3a43] max-w-xl mb-10">
        A decentralized crowdfunding platform where your ideas meet supporters.
      </p>
      <button
        onClick={() => navigate("/login")}
        className="px-6 py-3 bg-[#20B024] hover:bg-[#1a8f1d] text-white font-semibold rounded-lg shadow-md transition"
      >
        Get Started
      </button>
    </div>
  );
};

export default Landing;
