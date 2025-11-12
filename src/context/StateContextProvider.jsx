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

  // ========================
  //  Create / Publish Campaign
  // ========================
  const publishCampaign = async (form) => {
    try {
      const fullDescription = `name::${form.name || "Unknown"}||category::${
        form.category || "Uncategorized"
      }||desc::${form.description}`;

      const data = await contract.call("createCampaign", [
        address,
        form.title,
        fullDescription,
        ethers.utils.parseUnits(form.target, 18),
        Math.floor(new Date(form.deadline).getTime() / 1000),
        form.image,
      ]);

      console.log("Campaign created:", data);
    } catch (error) {
      console.error("Error creating campaign:", error);
    }
  };

  // ========================
  //  Fetch All Campaigns
  // ========================
  const getCampaigns = async () => {
    try {
      const campaigns = await contract.call("getCampaigns");

      const parsedCampaigns = campaigns.map((campaign, i) => {
        let creatorName = "Unknown";
        let category = "Uncategorized";
        let actualDescription = campaign.description;

        try {
          // Split by || for new format; if not present, handle old format
          const parts = campaign.description.includes("||")
            ? campaign.description.split("||")
            : [campaign.description];

          parts.forEach((part, index) => {
            if (!part.includes("::")) {
              // Old campaign format: first part as name, rest as description
              if (index === 0 && creatorName === "Unknown") {
                const splitIndex = part.indexOf("::");
                if (splitIndex > 0) {
                  creatorName = part.substring(0, splitIndex).trim();
                  actualDescription = part.substring(splitIndex + 2).trim();
                } else {
                  creatorName = part.trim();
                  actualDescription = part.trim();
                }
              }
              return;
            }

            const [key, ...rest] = part.split("::");
            const value = rest.join("::").trim();

            switch (key.trim().toLowerCase()) {
              case "name":
                creatorName = value;
                break;
              case "category":
                category = value;
                break;
              case "desc":
                actualDescription = value;
                break;
              default:
                // Old format fallback
                if (index === 0 && creatorName === "Unknown") {
                  creatorName = key.trim();
                  actualDescription = rest.join("::").trim();
                }
            }
          });
        } catch (e) {
          console.warn("Failed to parse description:", campaign.description);
        }

        return {
          owner: campaign.owner,
          title: campaign.title,
          name: creatorName,
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

      const blockedTitles = [
        "test",
        "narennare",
        "give money",
        "anniversary surprise for wife",
      ];

      return parsedCampaigns.filter(
        (c) => !blockedTitles.includes(c.title.trim().toLowerCase())
      );
    } catch (error) {
      console.error("Error fetching campaigns:", error);
      return [];
    }
  };

  // ========================
  //  Fetch Campaigns by User
  // ========================
  const getUserCampaigns = async () => {
    const allCampaigns = await getCampaigns();
    return allCampaigns.filter((campaign) => campaign.owner === address);
  };

  // ========================
  //  Fetch Donated Campaigns
  // ========================
  const getDonatedCampaigns = async () => {
    try {
      const allCampaigns = await getCampaigns();
      const donatedCampaigns = [];

      for (let i = 0; i < allCampaigns.length; i++) {
        const donators = await contract.call("getDonators", [i]);
        const addresses = donators[0];
        if (addresses.includes(address)) {
          donatedCampaigns.push(allCampaigns[i]);
        }
      }

      return donatedCampaigns;
    } catch (error) {
      console.error("Error fetching donated campaigns:", error);
      return [];
    }
  };

  // ========================
  //  Donate to a Campaign
  // ========================
  const donate = async (pId, amount) => {
    const data = await contract.call("donateToCampaign", [pId], {
      value: ethers.utils.parseEther(amount),
    });
    return data;
  };

  // ========================
  //  Get Donators for a Campaign
  // ========================
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
        getDonatedCampaigns,
        donate,
        getDonations,
        contractLoading,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};
