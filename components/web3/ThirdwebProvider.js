'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { ThirdwebProvider as ThirdwebSDKProvider, useAddress, useDisconnect, useNetworkMismatch, useConnectionStatus, useSwitchChain, useChain, useConnect, ConnectWallet } from '@thirdweb-dev/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ethers } from 'ethers';
import { CONTRACT_CONFIG } from '@/constants/config';
import { contractAbi, tokenAbi } from '@/constants/abi';

// Create context
const ThirdwebContext = createContext(null);

// Custom hook for thirdweb context
export function useThirdweb() {
  const context = useContext(ThirdwebContext);
  if (!context) {
    throw new Error('useThirdweb must be used within a ThirdwebProvider');
  }
  return context;
}

// Inner provider with access to hooks
function ThirdwebProviderInner({ children }) {
  const address = useAddress();
  const disconnectFn = useDisconnect();
  const connectionStatus = useConnectionStatus();
  const isNetworkMismatch = useNetworkMismatch();
  const switchChain = useSwitchChain();
  const chain = useChain();
  const connect = useConnect();
  
  const [contract, setContract] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Initialize read-only provider on mount
  useEffect(() => {
    try {
      const readOnlyProvider = new ethers.providers.JsonRpcProvider(CONTRACT_CONFIG.RPC_URL);
      setProvider(readOnlyProvider);
      
      const readContract = new ethers.Contract(
        CONTRACT_CONFIG.CONTRACT_ADDRESS,
        contractAbi,
        readOnlyProvider
      );
      setContract(readContract);
    } catch (err) {
      console.error('Failed to initialize read-only provider:', err);
      setError('Failed to initialize provider');
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  // Update provider and contract when address changes
  useEffect(() => {
    const updateProviderAndContract = async () => {
      try {
        if (address && connectionStatus === "connected") {
          // User is connected, try to get web3 provider
          const ethersProvider = new ethers.providers.Web3Provider(window.ethereum);
          setProvider(ethersProvider);
          
          const ethersSigner = ethersProvider.getSigner();
          setSigner(ethersSigner);
          
          // Create contract with signer
          const signedContract = new ethers.Contract(
            CONTRACT_CONFIG.CONTRACT_ADDRESS,
            contractAbi,
            ethersSigner
          );
          setContract(signedContract);
        } else {
          // User is not connected, use read-only provider
          const readOnlyProvider = new ethers.providers.JsonRpcProvider(CONTRACT_CONFIG.RPC_URL);
          setProvider(readOnlyProvider);
          setSigner(null);
          
          const readContract = new ethers.Contract(
            CONTRACT_CONFIG.CONTRACT_ADDRESS,
            contractAbi,
            readOnlyProvider
          );
          setContract(readContract);
        }
      } catch (err) {
        console.error('Error updating provider:', err);
        setError('Failed to update provider');
      }
    };
    
    updateProviderAndContract();
  }, [address, connectionStatus]);
  
  // Get the actual connection status that takes into account network mismatch
  const getEffectiveConnectionStatus = () => {
    if (connectionStatus === "connected" && isNetworkMismatch) {
      return "wrong_network";
    }
    return connectionStatus;
  };
  
  // Create switch to Sepolia function
  const switchToMonad = async () => {
    try {
      await switchChain(10143);
      return true;
    } catch (err) {
      console.error('Failed to switch to Monad:', err);
      return false;
    }
  };
  
  // Context value directly within component
  const contextValue = {
    address,
    isConnected: connectionStatus === "connected" && !isNetworkMismatch,
    isConnecting: connectionStatus === "connecting",
    isDisconnected: connectionStatus === "disconnected",
    isWrongNetwork: isNetworkMismatch,
    connectionStatus: getEffectiveConnectionStatus(),
    disconnect: disconnectFn,
    switchNetwork: switchChain,
    connect,
    chain,
    provider,
    signer,
    contract,
    isLoading,
    error,
    ConnectWalletButton: ConnectWallet,
    switchToMonad
  };
  
  return (
    <ThirdwebContext.Provider value={contextValue}>
      {children}
    </ThirdwebContext.Provider>
  );
}

// Main ThirdwebProvider component to be used in layout
export function ThirdwebProvider({ children }) {
  // Create a client
  const [queryClient] = useState(() => new QueryClient());
  
  return (
    <QueryClientProvider client={queryClient}>
      <ThirdwebSDKProvider 
        activeChain={{
          "chain": "MON",
          "chainId": 10143,
          "explorers": [
            {
              "name": "etherscan-sepolia",
              "url": "https://sepolia.etherscan.io",
              "standard": "EIP3091"
            },
            {
              "name": "otterscan-sepolia",
              "url": "https://sepolia.otterscan.io",
              "standard": "EIP3091"
            }
          ],
          "faucets": [
            "http://fauceth.komputing.org?chain=11155111&address=${ADDRESS}"
          ],
          "features": [],
          "icon": {
            "url": "ipfs://QmcxZHpyJa8T4i63xqjPYrZ6tKrt55tZJpbXcjSDKuKaf9/ethereum/512.png",
            "width": 512,
            "height": 512,
            "format": "png"
          },
          "infoURL": "https://sepolia.otterscan.io",
          "name": "Monad",
          "nativeCurrency": {
            "name": "Monad",
            "symbol": "MON",
            "decimals": 18
          },
          "networkId": 10143,
          "redFlags": [],
          "rpc": [
            "https://testnet-rpc.monad.xyz	",
          ],
          "shortName": "mon",
          "slip44": 1,
          "slug": "monad",
          "testnet": true,
          "title": "Monad Testnet"
        }}
        clientId="2c655d96e6b5219b7626ee6234181332" // Replace with your thirdweb client ID
      >
        <ThirdwebProviderInner>
          {children}
        </ThirdwebProviderInner>
      </ThirdwebSDKProvider>
    </QueryClientProvider>
  );
}