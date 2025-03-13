"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { ethers } from "ethers";
import { CONTRACT_CONFIG } from "@/constants/config";
import { contractAbi } from "@/constants/abi";

// Create context
const Web3Context = createContext(null);

// Custom hook for web3 context
export function useWeb3() {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error("useWeb3 must be used within a Web3Provider");
  }
  return context;
}

// Main Web3Provider component to be used in layout
export function ThirdwebProvider({ children }) {
  const [address, setAddress] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [contract, setContract] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [isWrongNetwork, setIsWrongNetwork] = useState(false);

  // Initialize read-only provider on mount
  useEffect(() => {
    try {
      const readOnlyProvider = new ethers.providers.JsonRpcProvider(
        CONTRACT_CONFIG.RPC_URL,
      );
      setProvider(readOnlyProvider);

      const readContract = new ethers.Contract(
        CONTRACT_CONFIG.CONTRACT_ADDRESS,
        contractAbi,
        readOnlyProvider,
      );
      setContract(readContract);
    } catch (err) {
      console.error("Failed to initialize read-only provider:", err);
      setError("Failed to initialize provider");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Handle wallet events
  useEffect(() => {
    if (typeof window === "undefined" || !window.ethereum) return;

    const handleAccountsChanged = (accounts) => {
      if (accounts.length === 0) {
        // User disconnected
        setAddress(null);
        setIsConnected(false);
        setSigner(null);

        // Reset to read-only provider
        const readOnlyProvider = new ethers.providers.JsonRpcProvider(
          CONTRACT_CONFIG.RPC_URL,
        );
        setProvider(readOnlyProvider);

        const readContract = new ethers.Contract(
          CONTRACT_CONFIG.CONTRACT_ADDRESS,
          contractAbi,
          readOnlyProvider,
        );
        setContract(readContract);
      } else {
        // User connected or changed account
        setAddress(accounts[0]);
        setIsConnected(true);
      }
    };

    const handleChainChanged = (chainIdHex) => {
      // Force refresh on chain change as recommended by MetaMask
      const newChainId = parseInt(chainIdHex, 16);
      setChainId(newChainId);

      // Check if user is on the correct network (Monad = 10143)
      setIsWrongNetwork(newChainId !== 10143);

      // Reload the page to avoid any state inconsistencies
      window.location.reload();
    };

    const handleConnect = () => {
      // Connection event
      console.log("Wallet connected");
    };

    const handleDisconnect = (error) => {
      // Disconnection event (usually due to some error)
      console.log("Wallet disconnected", error);
      setAddress(null);
      setIsConnected(false);
      setSigner(null);
    };

    // Subscribe to events
    window.ethereum.on("accountsChanged", handleAccountsChanged);
    window.ethereum.on("chainChanged", handleChainChanged);
    window.ethereum.on("connect", handleConnect);
    window.ethereum.on("disconnect", handleDisconnect);

    // Check initial connection state
    const checkConnection = async () => {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        });
        if (accounts.length > 0) {
          setAddress(accounts[0]);
          setIsConnected(true);

          const chainIdHex = await window.ethereum.request({
            method: "eth_chainId",
          });
          const connectedChainId = parseInt(chainIdHex, 16);
          setChainId(connectedChainId);
          setIsWrongNetwork(connectedChainId !== 10143);

          const ethersProvider = new ethers.providers.Web3Provider(
            window.ethereum,
          );
          setProvider(ethersProvider);

          const ethersSigner = ethersProvider.getSigner();
          setSigner(ethersSigner);

          const signedContract = new ethers.Contract(
            CONTRACT_CONFIG.CONTRACT_ADDRESS,
            contractAbi,
            ethersSigner,
          );
          setContract(signedContract);
        }
      } catch (err) {
        console.error("Error checking connection:", err);
      }
    };

    checkConnection();

    // Cleanup
    return () => {
      window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
      window.ethereum.removeListener("chainChanged", handleChainChanged);
      window.ethereum.removeListener("connect", handleConnect);
      window.ethereum.removeListener("disconnect", handleDisconnect);
    };
  }, []);

  // Connect wallet function
  const connect = async () => {
    if (typeof window === "undefined" || !window.ethereum) {
      setError("MetaMask is not installed");
      return;
    }

    setIsConnecting(true);

    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setAddress(accounts[0]);
      setIsConnected(true);

      const chainIdHex = await window.ethereum.request({
        method: "eth_chainId",
      });
      const connectedChainId = parseInt(chainIdHex, 16);
      setChainId(connectedChainId);
      setIsWrongNetwork(connectedChainId !== 10143);

      const ethersProvider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(ethersProvider);

      const ethersSigner = ethersProvider.getSigner();
      setSigner(ethersSigner);

      const signedContract = new ethers.Contract(
        CONTRACT_CONFIG.CONTRACT_ADDRESS,
        contractAbi,
        ethersSigner,
      );
      setContract(signedContract);
    } catch (err) {
      console.error("Failed to connect wallet:", err);
      setError("Failed to connect wallet");
    } finally {
      setIsConnecting(false);
    }
  };

  // Disconnect wallet function
  const disconnect = async () => {
    setAddress(null);
    setIsConnected(false);
    setSigner(null);

    // Reset to read-only provider
    try {
      const readOnlyProvider = new ethers.providers.JsonRpcProvider(
        CONTRACT_CONFIG.RPC_URL,
      );
      setProvider(readOnlyProvider);

      const readContract = new ethers.Contract(
        CONTRACT_CONFIG.CONTRACT_ADDRESS,
        contractAbi,
        readOnlyProvider,
      );
      setContract(readContract);
    } catch (err) {
      console.error("Failed to reset provider:", err);
    }
  };

  // Switch network function
  const switchToMonad = async () => {
    if (typeof window === "undefined" || !window.ethereum) {
      setError("MetaMask is not installed");
      return false;
    }

    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x279F" }], // 10143 in hex
      });
      return true;
    } catch (switchError) {
      // This error code indicates that the chain has not been added to MetaMask.
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: "0x279F", // 10143 in hex
                chainName: "Monad Testnet",
                nativeCurrency: {
                  name: "Monad",
                  symbol: "MON",
                  decimals: 18,
                },
                rpcUrls: ["https://testnet-rpc.monad.xyz"],
                blockExplorerUrls: ["https://sepolia.etherscan.io"],
              },
            ],
          });
          return true;
        } catch (addError) {
          console.error("Failed to add Monad network:", addError);
          return false;
        }
      }
      console.error("Failed to switch to Monad network:", switchError);
      return false;
    }
  };

  // Create a simple wallet connection button component
  const ConnectWalletButton = ({
    btnTitle = "Connect Wallet",
    className = "",
    theme = "dark",
  }) => {
    const buttonClass = `connect-wallet-btn ${className} ${theme === "dark" ? "dark-theme" : "light-theme"}`;

    // If already connected but wrong network
    if (isConnected && isWrongNetwork) {
      return (
        <button
          className={`${buttonClass} wrong-network`}
          onClick={switchToMonad}
        >
          <i className="fas fa-exclamation-triangle"></i> Switch to Monad
        </button>
      );
    }

    // If connecting
    if (isConnecting) {
      return (
        <button className={`${buttonClass} connecting`} disabled>
          <i className="fas fa-spinner fa-spin"></i> Connecting...
        </button>
      );
    }

    // If not connected
    if (!isConnected) {
      return (
        <button className={buttonClass} onClick={connect}>
          <i className="fas fa-wallet"></i> {btnTitle}
        </button>
      );
    }

    // If connected to correct network, show address
    return (
      <button className={`${buttonClass} connected`} onClick={() => {}}>
        <i className="fas fa-check-circle"></i> Connected
      </button>
    );
  };

  // Format address for display (e.g., 0x1234...5678)
  const formatAddress = (addr) => {
    if (!addr) return "";
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };

  // Context value
  const contextValue = {
    address,
    isConnected,
    isConnecting,
    isDisconnected: !isConnected,
    isWrongNetwork,
    chainId,
    disconnect,
    connect,
    provider,
    signer,
    contract,
    isLoading,
    error,
    ConnectWalletButton,
    switchToMonad,
    formatAddress,
  };

  return (
    <Web3Context.Provider value={contextValue}>{children}</Web3Context.Provider>
  );
}
