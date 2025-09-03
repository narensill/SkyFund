import axios from "axios";

export const uploadToIPFS = async (file) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const res = await axios.post(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      formData,
      {
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_PINATA_JWT}`,
        },
      }
    );

    return res.data.IpfsHash; // CID
  } catch (error) {
    console.error("IPFS upload error:", error);
    throw error;
  }
};
