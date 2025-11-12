import React, { useState, useEffect } from "react";
import { useStateContext } from "../context/useStateContext.js";
import { useAuth } from "../auth/AuthContext";
import DisplayCampaigns from "../components/DisplayCampaigns.jsx";
import newbie from "../assets/emptymeme.png";
import { uploadToIPFS } from "../utils/ipfsupload.js";
import { db } from "../auth/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useDarkMode } from "../context/DarkModeContext.jsx";

const avatarOptions = [
  "https://gateway.pinata.cloud/ipfs/bafybeicsxtsz44ei67muiaf2a2lly4bzdm6v4dsbqba4t2kbbcewaatrfu",
  "https://gateway.pinata.cloud/ipfs/bafybeifcswnzflt7itvufjerat3hqnuliidxvgqbhfzb7nxnjoxx5heos4",
  "https://gateway.pinata.cloud/ipfs/bafybeien63zi3spvl6cgazixjboqvv4nymrspif4mugzaw5crysepphafu",
  "https://gateway.pinata.cloud/ipfs/bafybeiftynbadamr2klvbr773p5qpbj3h6p4uzruph3ihybboxligzfagm",
  "https://gateway.pinata.cloud/ipfs/bafybeiehlhfsdnov6ul5ezh6iatnxbqofdia6manxruiaifpjduneghp2y",
  "https://gateway.pinata.cloud/ipfs/bafybeie42xca2zmlr236ofd2hkjg4pgmkvanqpyqglctjq3fdoipi6aeri",
];

const Profile = () => {
  const { darkMode } = useDarkMode();
  const { user } = useAuth();
  const { address, contract, getUserCampaigns, getDonatedCampaigns } = useStateContext();

  const [profile, setProfile] = useState({
    name: "",
    profilePic: "",
    email: "",
    walletAddress: "",
  });
  const [campaigns, setCampaigns] = useState([]);
  const [donatedCampaigns, setDonatedCampaigns] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showAvatarSelector, setShowAvatarSelector] = useState(false);
  const [showNameEditor, setShowNameEditor] = useState(false);
  const [newName, setNewName] = useState("");

  const bgPrimary = darkMode ? "bg-[#1A1A2E]" : "bg-[#FFFFE2]";
  const cardBg = darkMode ? "bg-[#2A2A3D]" : "bg-white";
  const textPrimary = darkMode ? "text-white" : "text-[#3a3a43]";
  const cardText = darkMode ? "text-white" : "text-[#3a3a43]";

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      const ref = doc(db, "users", user.uid);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        setProfile(snap.data());
      } else {
        const newProfile = {
          name: user.displayName || "User",
          profilePic: "",
          email: user.email,
          walletAddress: address || "",
        };
        await setDoc(ref, newProfile);
        setProfile(newProfile);
      }
    };
    fetchProfile();
  }, [user, address]);

  const fetchCampaigns = async () => {
    if (!contract) return;
    setIsLoading(true);
    try {
      const userCampaigns = await getUserCampaigns();
      const donated = (await getDonatedCampaigns?.()) || [];
      setCampaigns(userCampaigns);
      setDonatedCampaigns(donated);
    } catch (err) {
      console.error("Error fetching campaigns:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (contract && address) fetchCampaigns();
  }, [contract, address]);

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !user) return;
    setUploading(true);
    try {
      const hash = await uploadToIPFS(file);
      const url = `https://gateway.pinata.cloud/ipfs/${hash}`;
      await updateProfileField("profilePic", url);
    } catch (err) {
      console.error("Avatar upload failed:", err);
    } finally {
      setUploading(false);
    }
  };

  const updateProfileField = async (key, value) => {
    if (!user) return;
    const ref = doc(db, "users", user.uid);
    await setDoc(ref, { ...profile, [key]: value }, { merge: true });
    setProfile((prev) => ({ ...prev, [key]: value }));
  };

  const handleNameSave = async () => {
    if (!newName.trim()) return;
    await updateProfileField("name", newName.trim());
    setShowNameEditor(false);
  };

  const EmptyState = ({ message }) => (
    <div className="flex flex-col items-center justify-center p-6 text-center">
      <img src={newbie} alt="New user" className="w-40 h-40 object-contain mb-4 opacity-80" />
      <p className={`font-epilogue text-lg ${textPrimary}`}>{message}</p>
    </div>
  );

  return (
    <div className={`w-full flex flex-col lg:flex-row gap-6 p-4 ${bgPrimary}`}>
      <div className="w-full lg:w-1/3 flex flex-col gap-4 relative">
        <div className="p-3 flex flex-col items-center justify-center relative">
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
          <div className="flex gap-2 mt-3">
            <label
              htmlFor="avatarUpload"
              className="bg-[#1dc071] text-white px-3 py-1 rounded-md text-sm cursor-pointer hover:bg-[#149d56]"
            >
              {uploading ? "Uploading..." : "Upload"}
            </label>
            <input
              id="avatarUpload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarUpload}
              disabled={uploading}
            />
            <button
              onClick={() => setShowAvatarSelector(true)}
              className="bg-[#f3c623] text-black px-3 py-1 rounded-md text-sm hover:bg-[#eab308]"
            >
              Choose Avatar
            </button>
          </div>
        </div>

        <InfoBlock title="Name" value={profile.name || "User Name"} cardBg={cardBg} cardText={cardText} />
        <button
          onClick={() => {
            setNewName(profile.name || "");
            setShowNameEditor(true);
          }}
          className="bg-[#1dc071] text-white px-3 py-1 rounded-md text-sm hover:bg-[#149d56] mx-auto"
        >
          Change Name
        </button>

        <InfoBlock title="Email" value={profile.email} cardBg={cardBg} cardText={cardText} />
        <InfoBlock title="Wallet Address" value={address || "Not Connected"} truncate cardBg={cardBg} cardText={cardText} />

        {showAvatarSelector && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
            <div className={`${cardBg} p-6 rounded-xl shadow-lg w-[90%] max-w-[500px]`}>
              <h2 className={`font-epilogue font-bold text-lg mb-4 text-center ${cardText}`}>Choose an Avatar</h2>
              <div className="grid grid-cols-3 gap-3">
                {avatarOptions.map((url, idx) => (
                  <img
                    key={idx}
                    src={url}
                    alt={`Avatar ${idx}`}
                    onClick={() => {
                      updateProfileField("profilePic", url);
                      setShowAvatarSelector(false);
                    }}
                    className="w-24 h-24 object-cover rounded-full cursor-pointer hover:scale-105 transition-transform border-2 border-transparent hover:border-[#1dc071]"
                  />
                ))}
              </div>
              <button
                onClick={() => setShowAvatarSelector(false)}
                className="mt-5 bg-gray-700 text-white px-4 py-2 rounded-md w-full hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {showNameEditor && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
            <div className={`${cardBg} p-6 rounded-xl shadow-lg w-[90%] max-w-[400px]`}>
              <h2 className={`font-epilogue font-bold text-lg mb-4 text-center ${cardText}`}>Change Your Name</h2>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Enter new name"
                className={`w-full border rounded-md p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-[#1dc071] ${darkMode ? "border-gray-600 bg-[#2A2A3D] text-white placeholder:text-gray-400" : "border-gray-300 bg-white text-black placeholder:text-gray-500"}`}
              />
              <div className="flex gap-3">
                <button
                  onClick={handleNameSave}
                  className="bg-[#1dc071] text-white px-4 py-2 rounded-md flex-1 hover:bg-[#149d56]"
                >
                  Save
                </button>
                <button
                  onClick={() => setShowNameEditor(false)}
                  className="bg-gray-700 text-white px-4 py-2 rounded-md flex-1 hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="w-full lg:w-2/3 flex flex-col gap-6">
        <div className={`${cardBg} rounded-xl shadow-md p-4`}>
          <h2 className={`font-epilogue font-bold text-xl mb-2 ${cardText}`}>My Campaigns</h2>
          {campaigns.length > 0 ? (
            <DisplayCampaigns campaigns={campaigns} isLoading={isLoading} title="" />
          ) : (
            <EmptyState message="Looks empty... Are you new here? Create your first campaign!" />
          )}
        </div>

        <div className={`${cardBg} rounded-xl shadow-md p-4`}>
          <h2 className={`font-epilogue font-bold text-xl mb-2 ${cardText}`}>Campaigns I Donated To</h2>
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

const InfoBlock = ({ title, value, truncate = false, cardBg = "bg-white", cardText = "text-[#3a3a43]" }) => (
  <div>
    <h4 className={`font-epilogue font-bold text-[20px] ${cardText} p-1 rounded-t-[10px] h-[48px] text-left px-[20px] truncate shadow-secondary`}>
      {title}
    </h4>
    <div className={`p-3 rounded-b-[10px] ${cardBg} shadow-secondary`}>
      <p className={`ml-[10px] font-epilogue text-[16px] ${cardText} break-words ${truncate ? "truncate" : ""}`}>
        {value}
      </p>
    </div>
  </div>
);

export default Profile;
