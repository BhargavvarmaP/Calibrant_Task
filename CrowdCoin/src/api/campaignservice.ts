// campaignservice.ts
import { ethers } from "ethers";
import ABI from "@/lib/abi.json";

interface Campaign {
  id: number;
  title: string;
  description: string;
  goal: string;
  deadline: number;
  raised: string;
  contributors: number;
  image: string;
  owner: string;
}

let contract: ethers.Contract;
let signer: ethers.Signer;

// Initialize the contract with signer
const initContract = async () => {
  if (!window.ethereum) {
    throw new Error("Please install MetaMask or another web3 wallet");
  }

  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    signer = await provider.getSigner();
    
    const contractAddress = "0x160738de2F9B4b9eC6918194218eB1045f861711";
    contract = new ethers.Contract(contractAddress, ABI, signer);
  } catch (error) {
    console.error("Error initializing contract:", error);
    throw new Error("Failed to initialize web3 connection");
  }
};

export const createCampaign = async (
  title: string,
  description: string,
  goalAmount: number,
  deadline: string,
  imageUrl: string
) => {
  await initContract();

  try {
    const duration = dateToSeconds(deadline);
    if (duration <= 0) {
      throw new Error("Deadline must be in the future");
    }

    // Convert goal amount to BigNumber in wei
    const goalAmountWei = ethers.parseUnits(goalAmount.toString(), "ether");
    
    // Log parameters for debugging
    console.log("Creating campaign with params:", {
      title,
      description,
      goalAmountWei: goalAmountWei.toString(),
      duration,
      imageUrl
    });

    // Create transaction with proper parameters
    const tx = await contract.createCampaign(
      title,
      description,
      goalAmountWei,
      duration,
      imageUrl,
      { gasLimit: 3000000 } // Add explicit gas limit
    );

    const receipt = await tx.wait();
    console.log("Campaign created successfully", receipt);
    return receipt;
  } catch (error: any) {
    console.error("Error creating campaign:", error);
    if (error.message.includes("user rejected transaction")) {
      throw new Error("Transaction was rejected by user");
    } else {
      throw new Error(error.message || "Failed to create campaign");
    }
  }
};

// Function to contribute to a campaign
export const contributeToCampaign = async (campaignId: number, amount: string) => {
  await initContract(); // Ensure contract is initialized
  try {
    const transaction = await contract.contribute(campaignId, {
      value: ethers.parseEther(amount),
    });
    await transaction.wait();
    console.log("Contribution successful");
  } catch (error) {
    console.error("Error contributing to campaign:", error);
    throw new Error("Failed to contribute to campaign");
  }
};

// Function to withdraw funds from a campaign
export const withdrawFunds = async (campaignId: number) => {
  await initContract(); // Ensure contract is initialized
  try {
    const transaction = await contract.withdrawFunds(campaignId);
    await transaction.wait();
    console.log("Funds withdrawn successfully");
  } catch (error) {
    console.error("Error withdrawing funds:", error);
    throw new Error("Failed to withdraw funds");
  }
};

// Function to issue a refund for a campaign
export const refundContribution = async (campaignId: number) => {
  await initContract(); // Ensure contract is initialized
  try {
    const transaction = await contract.refund(campaignId);
    await transaction.wait();
    console.log("Refund issued successfully");
  } catch (error) {
    console.error("Error issuing refund:", error);
    throw new Error("Failed to issue refund");
  }
};

export const getCampaignDetails = async (campaignId: number) => {
  await initContract(); // Ensure contract is initialized
  try {
    const details = await contract.getCampaignDetails(campaignId);
    console.log("Campaign details fetched:", details);

    // Map the details to the Campaign interface
    const campaign: Campaign = {
      id: campaignId,
      title: details.title,
      description: details.description,
      goal: ethers.formatEther(details.goalAmount),
      deadline: details.deadline.toNumber() * 1000, // Convert to milliseconds
      raised: ethers.formatEther(details.totalContributions),
      contributors: details.contributors.length,
      image: details.imageUrl,
      owner: details.owner
    };

    return campaign;
  } catch (error) {
    console.error("Error fetching campaign details:", error);
    throw new Error("Failed to fetch campaign details");
  }
};

// Function to check user's contribution for a specific campaign
export const getUserContribution = async (campaignId: number, contributor: string) => {
  await initContract(); // Ensure contract is initialized
  try {
    const contribution = await contract.getUserContribution(campaignId, contributor);
    console.log(`User's contribution:`, ethers.formatEther(contribution));
    return ethers.formatEther(contribution);
  } catch (error) {
    console.error("Error fetching user's contribution:", error);
    throw new Error("Failed to fetch user's contribution");
  }
};

export const getAllCampaignIds = async () => {
  await initContract(); // Ensure contract is initialized
  try {
    const campaignCount = await contract.campaignCount();
    const campaignIds = [];
    for (let i = 1; i <= campaignCount; i++) {
      campaignIds.push(i);
    }
    return campaignIds;
  } catch (error) {
    console.error("Error fetching campaign IDs:", error);
    throw new Error("Failed to fetch campaign IDs");
  }
};

function dateToSeconds(dateString: string): number {
  // Split the date string into components
  const [year, month, day] = dateString.split('-');
  
  // Create a Date object (Note: month is 0-indexed in JavaScript)
  const date = new Date(`${year}-${month}-${day}T00:00:00Z`);
  
  // Get the time in milliseconds and convert to seconds
  return Math.floor(date.getTime() / 1000);
}