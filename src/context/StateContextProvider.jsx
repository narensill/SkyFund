import React, { createContext } from "react";
import {
  useAddress,
  useContract,
  useMetamask,
  useContractWrite,
} from "@thirdweb-dev/react";
import { ethers } from "ethers";

export const StateContext = createContext();

export const StateContextProvider = ({ children }) => {
  // Load your deployed contract
  const { contract ,isLoading: contractLoading } = useContract(
    "0x1a191a6d62a11f8fc4be3ff6000806b7e9f543da"
  );

  // Hook for writing to the contract
  const { mutateAsync: createCampaign } = useContractWrite(
    contract,
    "createCampaign"
  );

  const address = useAddress();
  const connect = useMetamask();

  // Publish new campaign
  const publishCampaign = async (form) => {
    try {
      const data = await contract.call("createCampaign", [
        address,
        form.title,
        form.description,
        ethers.utils.parseUnits(form.target, 18),
        Math.floor(new Date(form.deadline).getTime() / 1000),
        form.image,
      ]);
      console.log("Contract call success", data);
    } catch (error) {
      console.error("Contract call failure", error);
    }
  };

  // Fetch all campaigns
  const getCampaigns = async () => {
    try {
      const campaigns = await contract.call("getCampaigns");

      const parsedCampaigns = campaigns.map((campaign, i) => ({
        owner: campaign.owner,
        title: campaign.title,
        description: campaign.description,
        target: ethers.utils.formatEther(campaign.target.toString()),
        deadline: Number(campaign.deadline),
        amountCollected: ethers.utils.formatEther(
          campaign.amountCollected.toString()
        ),
        image: campaign.image,
        pId: i,
      }));

      console.log("final plz",parsedCampaigns)
      return parsedCampaigns;
    } catch (error) {
      console.error("Error fetching campaigns:", error);
      return [];
    }
  };

  return (
    <StateContext.Provider
      value={{
        address,
        contract,
        connect,
        createCampaign: publishCampaign,
        getCampaigns,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};
