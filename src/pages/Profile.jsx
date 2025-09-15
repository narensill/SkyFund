import React, { useState, useEffect } from "react";
import { useStateContext } from "../context/useStateContext.js";
import { useAuth } from "../auth/AuthContext";
import DisplayCampaigns from "../components/DisplayCampaigns.jsx";
import newbie from "../assets/emptymeme.png";

const Profile = () => {
  const { user } = useAuth();
  const { address, contract, getUserCampaigns, getDonatedCampaigns } = useStateContext();
  const [profile, setProfile] = useState({
    name: "",
    profilePic: "",
    email: "",
    walletAddress: ""
  });
  const [campaigns, setCampaigns] = useState([]);
  const [donatedCampaigns, setDonatedCampaigns] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setProfile({
        name: user.displayName || "User",
        profilePic: user.photoURL || "",
        email: user.email,
        walletAddress: address || ""
      });
    }
  }, [user, address]);

  const fetchCampaigns = async () => {
    setIsLoading(true);
    const userCampaigns = await getUserCampaigns();
    const donated = await getDonatedCampaigns?.();
    setCampaigns(userCampaigns);
    setDonatedCampaigns(donated || []);
    setIsLoading(false);
  };

  useEffect(() => {
    if (contract) fetchCampaigns();
  }, [address, contract]);

  const EmptyState = ({ message }) => (
    <div className="flex flex-col items-center justify-center p-6 text-center">
      <img src={newbie} alt="New user" className="w-40 h-40 object-contain mb-4 opacity-80" />
      <p className="font-epilogue text-lg text-gray-600">{message}</p>
    </div>
  );

  return (
    <div className="w-full flex flex-col lg:flex-row gap-6 p-4">
      {/* Left Column */}
      <div className="w-full lg:w-1/3 flex flex-col gap-4">
        {/* Profile Pic */}
        <div>
          
          <div className="p-3 flex justify-center">
            {profile.profilePic ? (
              <img
                src={profile.profilePic}
                alt="Profile"
                className="w-[180px] h-[180px] rounded-full object-cover shadow-md"
              />
            ) : (
              <div className="w-[180px] h-[180px] rounded-full bg-gray-300 flex items-center justify-center text-xl font-bold text-gray-700 shadow-md">
                IMG
              </div>
            )}
          </div>
        </div>

        {/* Name */}
        <div>
          <h4 className="font-epilogue font-bold text-[20px] sm:text-[24px] md:text-[28px] text-black p-1 bg-[#FFFFE2] rounded-t-[10px] h-[48px] text-left px-[20px] truncate shadow-secondary">
            Name
          </h4>
          <div className="p-3 bg-[#EBEBCE] rounded-b-[10px] shadow-secondary">
            <p className="ml-[10px] font-epilogue text-[16px] text-[#3a3a43] break-words">
              {profile.name || "User Name"}
            </p>
          </div>
        </div>

        {/* Email */}
        <div>
          <h4 className="font-epilogue font-bold text-[20px] sm:text-[24px] md:text-[28px] text-black p-1 bg-[#FFFFE2] rounded-t-[10px] h-[48px] text-left px-[20px] truncate shadow-secondary">
            Email
          </h4>
          <div className="p-3 bg-[#EBEBCE] rounded-b-[10px] shadow-secondary">
            <p className="ml-[10px] font-epilogue text-[16px] text-[#3a3a43]">{profile.email}</p>
          </div>
        </div>

        {/* Wallet Address */}
        <div>
          <h4 className="font-epilogue font-bold text-[20px] sm:text-[24px] md:text-[28px] text-black p-1 bg-[#FFFFE2] rounded-t-[10px] h-[48px] text-left px-[20px] truncate shadow-secondary">
            Wallet Address
          </h4>
          <div className="p-3 bg-[#EBEBCE] rounded-b-[10px] shadow-secondary">
            <p className="ml-[10px] font-epilogue text-[16px] text-[#3a3a43] break-words truncate">
              {address || "Not Connected"}
            </p>
          </div>
        </div>
      </div>

      {/* Right Column */}
      <div className="w-full lg:w-2/3 flex flex-col gap-6">
        <div className="bg-white rounded-xl shadow-md p-4">
          <h2>My Campaigns</h2>
          {campaigns.length > 0 ? (
            <DisplayCampaigns campaigns={campaigns} isLoading={isLoading} title="" />
          ) : (
            <EmptyState message="Looks empty... Are you new here? Create your first campaign!" />
          )}
        </div>

        <div className="bg-white rounded-xl shadow-md p-4">
          <h2>Campaigns I Donated To</h2>
          {donatedCampaigns.length > 0 ? (
            <DisplayCampaigns campaigns={donatedCampaigns} isLoading={isLoading} title="" />
          ) : (
            <EmptyState message="Nothing donated yet... Maybe explore and support someone?" />
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
