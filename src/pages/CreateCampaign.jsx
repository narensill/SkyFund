import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CustomButton, FormField } from "../components";
import { uploadToIPFS } from "../utils/ipfsupload";
import { useStateContext } from "../context/useStateContext.js";
import { useDarkMode } from "../context/DarkModeContext.jsx";

const CreateCampaign = () => {
  const navigate = useNavigate();
  const { darkMode } = useDarkMode();
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    title: "",
    description: "",
    target: "",
    deadline: "",
    image: "",
    category: "",
  });
  const { createCampaign } = useStateContext();

  const handleFormFieldChange = (fieldName, e) => {
    setForm({ ...form, [fieldName]: e.target.value });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsLoading(true);
    try {
      const cid = await uploadToIPFS(file);
      setForm({ ...form, image: cid });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.image || form.image.trim() === "") {
      alert("Please upload an image before submitting");
      return;
    }

    try {
      setIsLoading(true);

      await createCampaign({
        ...form,
        description: `name::${form.name}||category::${
          form.category || "uncategorized"
        }||desc::${form.description}`,
      });

      navigate("/home");
    } catch (error) {
      console.error("Error creating campaign:", error);
      alert("Something went wrong while creating the campaign");
    } finally {
      setIsLoading(false);
    }
  };

  const bgPrimary = darkMode ? "bg-[#1A1A2E]" : "bg-[#FFFFE2]";
  const bgSecondary = darkMode ? "bg-[#2A2A3D]" : "bg-[#EBEBCE]";
  const textPrimary = darkMode ? "text-white" : "text-black";
  const textSecondary = darkMode ? "text-gray-300" : "text-[#3a3a43]";
  const inputText = darkMode
    ? "text-white placeholder:text-gray-400 border-gray-500"
    : "text-[#3a3a43] placeholder:text-[#3a3a43] border-[#3a3a43]";

  return (
    <div className={`${bgPrimary} flex justify-center items-center flex-col rounded-[10px] sm:p-10 p-4`}>
      {isLoading && <p className={textPrimary}>Loading...</p>}

      <div className={`flex justify-center items-center p-[16px] sm:min-w-[380px] ${bgSecondary} rounded-[15px] border ${darkMode ? "border-gray-500" : "border-[#3a3a43]"}`}>
        <h1 className={`font-epilogue font-bold sn:text-[25px] text-[18px] leading-[38px] ${textPrimary}`}>
          Start a campaign
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="w-full mt-[65px] flex flex-col gap-[30px]">
        <div className="flex flex-wrap gap-[40px]">
          <FormField
            LabelName="Your Name *"
            placeholder="Enter your name"
            inputType="text"
            value={form.name}
            handleChange={(e) => handleFormFieldChange("name", e)}
            styles={inputText}
          />
          <div className="flex flex-col w-full">
            <label className={`font-epilogue font-medium text-[14px] leading-[22px] mb-[10px] ${textSecondary}`}>
              Image *
            </label>

            <div className={`flex justify-between items-center border-[2px] rounded-[10px] p-2 w-full ${inputText} bg-transparent`}>
              {!form.image && (
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  required
                  className="flex-1 file:mr-4 file:py-2 file:px-4 file:rounded-[8px] file:border-0 file:text-sm file:font-semibold file:bg-[#1c1c24] file:text-white hover:file:bg-[#2a2a35]"
                />
              )}

              {form.image && (
                <div className="relative w-[150px] h-[150px] flex-shrink-0 ml-4">
                  <img
                    src={`https://gateway.pinata.cloud/ipfs/${form.image}`}
                    alt="Preview"
                    className="w-full h-full rounded object-contain"
                  />
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, image: "" })}
                    className="absolute top-1 right-1 w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center hover:bg-red-700"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <FormField
          LabelName="Campaign Title *"
          placeholder="Write a title"
          inputType="text"
          value={form.title}
          handleChange={(e) => handleFormFieldChange("title", e)}
          styles={inputText}
        />

        <FormField
          LabelName="Description *"
          placeholder="Write a description"
          isTextArea
          value={form.description}
          handleChange={(e) => handleFormFieldChange("description", e)}
          styles={inputText}
        />

        <FormField
          LabelName="Category *"
          inputType="select"
          placeholder="Select a category"
          value={form.category}
          handleChange={(e) => handleFormFieldChange("category", e)}
          options={["Education", "Luxury", "Work", "Research"]}
          styles={inputText}
        />

        <div className="flex flex-wrap gap-[40px]">
          <FormField
            LabelName="Goal*"
            placeholder="ETH 0.1"
            inputType="text"
            value={form.target}
            handleChange={(e) => handleFormFieldChange("target", e)}
            styles={inputText}
          />
          <FormField
            LabelName="End Date *"
            placeholder="Set a Date"
            inputType="date"
            value={form.deadline}
            handleChange={(e) => handleFormFieldChange("deadline", e)}
            styles={inputText}
          />
        </div>

        <div className="justify-center items-center flex mt-[40px]">
          <CustomButton
            btnType="submit"
            title="Submit new campaign"
            styles={`border ${darkMode ? "border-gray-500 bg-[#1A1A2E] text-white" : "border-[#3a3a43] bg-[#FFFFE2] text-black"}`}
          />
        </div>
      </form>
    </div>
  );
};

export default CreateCampaign;
