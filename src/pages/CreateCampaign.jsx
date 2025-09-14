import React, { useState } from "react";
import { Form, useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import { CustomButton, FormField } from "../components";
import { uploadToIPFS } from "../utils/ipfsupload";
import { useStateContext } from "../context/useStateContext.js";

const CreateCampaign = () => {
  const navigate = useNavigate();
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

      navigate("/");
    } catch (error) {
      console.error("Error creating campaign:", error);
      alert("Something went wrong while creating the campaign");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#FFFFE2] flex justify-center items-center flex-col rounded-[10px] sm:p-10 p-4">
      {isLoading && <p>Loading...</p>}

      <div className="flex justify-center items-center p-[16px] sm:min-w-[380px] bg-[#EBEBCE] rounded-[15px] border border-[#3a3a43]">
        <h1 className="font-epilogue font-bold sn:text-[25px] text-[18px] leading-[38px] text-black">
          Start a campaign
        </h1>
      </div>
      <form
        onSubmit={handleSubmit}
        className="w-full mt-[65px] flex flex-col gap-[30px]"
      >
        <div className="flex flex-wrap gap-[40px]">
          <FormField
            LabelName="Your Name *"
            placeholder="Enter your name"
            inputType="text"
            value={form.name}
            handleChange={(e) => handleFormFieldChange("name", e)}
          />
          <div className="flex flex-col w-full">
            <label className="font-epilogue font-medium text-[14px] leading-[22px] text-[#808191] mb-[10px]">
              Image *
            </label>

            <div className="flex justify-between items-center border-[2px] border-[#3a3a43] rounded-[10px] bg-transparent p-2 w-full">
              {/* Left side - form content */}
              {!form.image && (
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  required
                  className="flex-1 text-white file:mr-4 file:py-2 file:px-4 file:rounded-[8px] file:border-0 file:text-sm file:font-semibold file:bg-[#1c1c24] file:text-white hover:file:bg-[#2a2a35]"
                />
              )}

              {/* Right side - image preview */}
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
        <div>
          <FormField
            LabelName="Campaign Title *"
            placeholder="Write a title"
            inputType="text"
            value={form.title}
            handleChange={(e) => handleFormFieldChange("title", e)}
          />
        </div>

        <FormField
          LabelName="Description *"
          placeholder="Write a description"
          isTextArea
          value={form.description}
          handleChange={(e) => handleFormFieldChange("description", e)}
          styles="text=[#3a3a43]"
        />
        <FormField
          LabelName="Category *"
          inputType="select"
          placeholder="Select a category"
          value={form.category}
          handleChange={(e) => handleFormFieldChange("category", e)}
          options={["Education", "Luxury", "Work", "Research"]}
        />

        <div className="flex flex-wrap gap-[40px]">
          <FormField
            LabelName="Goal*"
            placeholder="ETH 0.1"
            inputType="text"
            value={form.target}
            handleChange={(e) => handleFormFieldChange("target", e)}
          />
          <FormField
            LabelName="End Date *"
            placeholder="Set a Date"
            inputType="date"
            value={form.deadline}
            styles="text-[#3a3a43]"
            handleChange={(e) => handleFormFieldChange("deadline", e)}
          />
        </div>

        <div className="justify-center items-center flex mt-[40px]">
          <CustomButton
            btnType="submit"
            title="Submit new campaign"
            styles="bg-[#1d1c071] border border-[#3a3a43] text-black"
          />
        </div>
      </form>
    </div>
  );
};

export default CreateCampaign;
