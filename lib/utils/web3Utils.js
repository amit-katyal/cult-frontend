'use client';

import { ethers } from 'ethers';
import { CONTRACT_CONFIG } from '@/constants/config';
import { contractAbi, tokenAbi } from '@/constants/abi';

/**
 * Initialize ethers provider and contract
 */
export const initializeProvider = () => {
  let provider = new ethers.providers.JsonRpcProvider(CONTRACT_CONFIG.RPC_URL);
  let contract = new ethers.Contract(
    CONTRACT_CONFIG.CONTRACT_ADDRESS,
    contractAbi,
    provider
  );
  return { provider, contract };
};

/**
 * Format token data for display
 */
export const formatTokenData = (token) => {
  return {
    name: token.name,
    symbol: token.symbol,
    description: token.description,
    tokenImageUrl: token.tokenImageUrl || "/api/placeholder/36/36",
    fundingRaised: ethers.utils.formatEther(token.fundingRaised),
    tokenAddress: token.tokenAddress,
    creatorAddress: token.creatorAddress,
  };
};

/**
 * Fetch all tokens from the contract
 */
export const fetchAllTokens = async () => {
  try {
    console.log("Fetching tokens from contract...");
    const { contract } = initializeProvider();
    const memeTokens = await contract.getAllMemeTokens();
    console.log("Tokens fetched:", memeTokens.length);

    // Convert token data and sort if needed
    return memeTokens.map((token) => formatTokenData(token));
  } catch (error) {
    console.error("Error fetching meme tokens:", error);
    return [];
  }
};

/**
 * Format address for display (0x1234...5678)
 */
export const formatAddress = (address) => {
  if (!address) return '';
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
};

/**
 * Check if MetaMask is installed
 */
export const isMetaMaskInstalled = () => {
  return typeof window !== 'undefined' && typeof window.ethereum !== 'undefined' && window.ethereum.isMetaMask;
};

/**
 * Connect to MetaMask
 */
export const connectWallet = async () => {
  if (!isMetaMaskInstalled()) {
    throw new Error("Please install MetaMask to use this feature");
  }

  try {
    // Request account access
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    return accounts[0];
  } catch (error) {
    console.error("Error connecting to MetaMask:", error);
    throw new Error("Failed to connect to MetaMask");
  }
};

/**
 * Calculate cost using bonding curve
 */
export const calculateCost = async (tokenAddress, amount) => {
  try {
    const { contract } = initializeProvider();
    const tokenContract = new ethers.Contract(tokenAddress, tokenAbi, contract.provider);
    const totalSupply = await tokenContract.totalSupply();
    const totalSupplyFormatted = parseInt(ethers.utils.formatEther(totalSupply));
    const currentSupply = totalSupplyFormatted - 200000;
    
    // Calculate cost
    const cost = await contract.calculateCost(currentSupply, ethers.utils.parseEther(amount.toString()));
    return ethers.utils.formatEther(cost);
  } catch (error) {
    console.error('Error calculating cost:', error);
    throw error;
  }
};

/**
 * Fetch token details
 */
export const fetchTokenDetails = async (tokenAddress) => {
  try {
    const { provider, contract } = initializeProvider();
    
    // Get token data from contract
    const tokenData = await contract.addressToMemeTokenMapping(tokenAddress);
    
    // Create token contract instance
    const tokenContract = new ethers.Contract(tokenAddress, tokenAbi, provider);
    
    // Get additional token data
    const name = await tokenContract.name();
    const symbol = await tokenContract.symbol();
    const totalSupply = await tokenContract.totalSupply();
    
    return {
      address: tokenAddress,
      name,
      symbol,
      description: tokenData.description,
      tokenImageUrl: tokenData.tokenImageUrl || "/api/placeholder/120/120",
      fundingRaised: ethers.utils.formatEther(tokenData.fundingRaised),
      totalSupply: ethers.utils.formatEther(totalSupply),
      creatorAddress: tokenData.creatorAddress
    };
  } catch (error) {
    console.error('Error fetching token details:', error);
    throw error;
  }
};

/**
 * Buy tokens
 */
export const buyTokens = async (tokenAddress, amount) => {
  try {
    // Check if MetaMask is available
    if (!isMetaMaskInstalled()) {
      throw new Error('Please install MetaMask to buy tokens.');
    }
    
    // Connect to MetaMask
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_CONFIG.CONTRACT_ADDRESS, contractAbi, signer);
    
    // Calculate cost
    const tokenContract = new ethers.Contract(tokenAddress, tokenAbi, provider);
    const totalSupply = await tokenContract.totalSupply();
    const totalSupplyFormatted = parseInt(ethers.utils.formatEther(totalSupply));
    const currentSupply = totalSupplyFormatted - 200000;
    
    // Calculate cost
    const cost = await contract.calculateCost(currentSupply, ethers.utils.parseEther(amount.toString()));
    
    // Execute transaction
    const transaction = await contract.buyMemeToken(
      tokenAddress, 
      ethers.utils.parseEther(amount.toString()), 
      { value: cost }
    );
    
    // Wait for confirmation
    const receipt = await transaction.wait();
    return receipt;
  } catch (error) {
    console.error('Error buying tokens:', error);
    throw error;
  }
};