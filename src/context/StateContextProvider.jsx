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
  const { contract, isLoading: contractLoading } = useContract(
    "0x1a191a6d62a11f8fc4be3ff6000806b7e9f543da"
  );

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

      const parsedCampaigns = campaigns.map((campaign, i) => {
        let category = "uncategorized";
        let actualDescription = campaign.description;

        if (campaign.description.includes("::")) {
          const [cat, desc] = campaign.description.split("::");
          category = cat;
          actualDescription = desc;
        }

        return {
          owner: campaign.owner,
          title: campaign.title,
          category,
          description: actualDescription,
          target: ethers.utils.formatEther(campaign.target.toString()),
          deadline: Number(campaign.deadline) * 1000,
          amountCollected: ethers.utils.formatEther(
            campaign.amountCollected.toString()
          ),
          image: campaign.image,
          pId: i,
        };
      });

      const blockedTitles = ["test", "narennare", "give money"];
      const filteredCampaigns = parsedCampaigns.filter(
        (c) => !blockedTitles.includes(c.title.trim().toLowerCase())
      );

      return filteredCampaigns;
    } catch (error) {
      console.error("Error fetching campaigns:", error);
      return [];
    }
  };

  // Fetch campaigns of logged-in user
  const getUserCampaigns = async () => {
    const allCampaigns = await getCampaigns();
    return allCampaigns.filter((campaign) => campaign.owner === address);
  };

  const donate = async (pId, amount) => {
    const data = await contract.call("donateToCampaign", [pId], {
      value: ethers.utils.parseEther(amount),
    });
    return data;
  };
  const getDonations = async (pId) => {
    const donations = await contract.call("getDonators", [pId]);
    const numberOfDonations = donations[0].length;
    const parsedDonations = [];
    for (let i = 0; i < numberOfDonations; i++) {
      parsedDonations.push({
        donator: donations[0][i],
        donation: ethers.utils.formatEther(donations[1][i].toString()),
      });
    }
    return parsedDonations;
  };

  return (
    <StateContext.Provider
      value={{
        address,
        contract,
        connect,
        createCampaign: publishCampaign,
        getCampaigns,
        getUserCampaigns,
        donate,
        getDonations,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};
