'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { CONTRACT_CONFIG } from '@/constants/config';
import { contractAbi } from '@/constants/abi';

// Create context
const Web3Context = createContext(null);

export function Web3Provider({ children }) {
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);
  const [signer, setSigner] = useState(null);
  const [account, setAccount] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize provider on mount
  useEffect(() => {
    const init = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Initialize read-only provider
        const readProvider = new ethers.providers.JsonRpcProvider(CONTRACT_CONFIG.RPC_URL);
        setProvider(readProvider);

        // Initialize contract
        const readContract = new ethers.Contract(
          CONTRACT_CONFIG.CONTRACT_ADDRESS,
          contractAbi,
          readProvider
        );
        setContract(readContract);

        // Check for connected account
        const savedAccount = localStorage.getItem('connectedAccount');
        if (savedAccount && window.ethereum) {
          // User was previously connected, try to recover
          try {
            const injectedProvider = new ethers.providers.Web3Provider(window.ethereum);
            const accounts = await injectedProvider.listAccounts();
            
            if (accounts.length > 0 && accounts[0].toLowerCase() === savedAccount.toLowerCase()) {
              // Account still connected
              setProvider(injectedProvider);
              setSigner(injectedProvider.getSigner());
              setAccount(accounts[0]);
              setIsConnected(true);
              
              // Update contract with signer
              const signedContract = new ethers.Contract(
                CONTRACT_CONFIG.CONTRACT_ADDRESS,
                contractAbi,
                injectedProvider.getSigner()
              );
              setContract(signedContract);
            }
          } catch (injectedError) {
            console.warn('Could not connect to wallet:', injectedError);
            // Continue with read-only provider
          }
        }
      } catch (err) {
        console.error('Failed to initialize web3:', err);
        setError('Failed to initialize web3 provider');
      } finally {
        setIsLoading(false);
      }
    };

    init();

    // Listen for account changes
    const handleAccountsChanged = (accounts) => {
      if (accounts.length === 0) {
        // User disconnected
        disconnect();
      } else if (accounts[0] !== account) {
        // Account changed
        setAccount(accounts[0]);
        localStorage.setItem('connectedAccount', accounts[0]);
      }
    };

    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      }
    };
  }, [account]);

  // Connect wallet
  const connect = async () => {
    if (!window.ethereum) {
      throw new Error('No wallet found. Please install MetaMask or another provider.');
    }

    try {
      const injectedProvider = new ethers.providers.Web3Provider(window.ethereum);
      
      // Request accounts
      const accounts = await injectedProvider.send('eth_requestAccounts', []);
      const connectedAccount = accounts[0];
      
      // Update state
      setProvider(injectedProvider);
      setSigner(injectedProvider.getSigner());
      setAccount(connectedAccount);
      setIsConnected(true);
      
      // Update contract with signer
      const signedContract = new ethers.Contract(
        CONTRACT_CONFIG.CONTRACT_ADDRESS,
        contractAbi,
        injectedProvider.getSigner()
      );
      setContract(signedContract);
      
      // Save connected account
      localStorage.setItem('connectedAccount', connectedAccount);
      
      return connectedAccount;
    } catch (err) {
      console.error('Failed to connect wallet:', err);
      throw err;
    }
  };

  // Disconnect wallet
  const disconnect = () => {
    // Reset to read-only provider
    const readProvider = new ethers.providers.JsonRpcProvider(CONTRACT_CONFIG.RPC_URL);
    setProvider(readProvider);
    
    // Reset contract
    const readContract = new ethers.Contract(
      CONTRACT_CONFIG.CONTRACT_ADDRESS,
      contractAbi,
      readProvider
    );
    setContract(readContract);
    
    // Clear signer and account
    setSigner(null);
    setAccount(null);
    setIsConnected(false);
    
    // Remove from storage
    localStorage.removeItem('connectedAccount');
  };

  // Context value
  const value = {
    provider,
    contract,
    signer,
    account,
    isConnected,
    isLoading,
    error,
    connect,
    disconnect
  };

  return (
    <Web3Context.Provider value={value}>
      {children}
    </Web3Context.Provider>
  );
}

// Custom hook to use the Web3 context
export function useWeb3() {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
}