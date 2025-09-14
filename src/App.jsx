import React from "react";
import { Route, Routes } from "react-router-dom";
import { CampaignDetails, CreateCampaign, Profile, Home } from "./pages";
import { Sidebar, Navbar } from "./components";

const App = () => {
  return (
    <div className="relative min-h-screen">
      {/* Background Layer */}
      <div className="fixed top-0 z-[-2] h-screen w-screen bg-[#FFFFF7] bg-[radial-gradient(#00000022_2px,#FFFFF7_1px)] bg-[size:20px_20px] animate-fall" />

      {/* Content */}
      <div className="relative sm:-8 p-4 min-h-screen flex flex-row">
        <div className="sm:flex hidden mr-10 relative">
          <Sidebar />
        </div>
        <div className="flex-1 max-sm:w-full max-w-[1280px] mx-auto sm:pr-5">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/create-campaign" element={<CreateCampaign />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/campaign-details/:id" element={<CampaignDetails />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default App;
