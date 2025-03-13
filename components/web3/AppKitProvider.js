'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Appkit } from '@reown/appkit';
import { CONTRACT_CONFIG } from '@/constants/config';
import { contractAbi } from '@/constants/abi';

// Create context
const AppkitContext = createContext(null);

export function AppkitProvider({ children }) {
  const [appkit, setAppkit] = useState(null);
  const [account, setAccount] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize Appkit on mount
  useEffect(() => {
    const init = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Initialize read-only provider for non-connected state
        const readOnlyProvider = new ethers.providers.JsonRpcProvider(CONTRACT_CONFIG.RPC_URL);
        setProvider(readOnlyProvider);

        // Initialize contract with read-only provider
        const readContract = new ethers.Contract(
          CONTRACT_CONFIG.CONTRACT_ADDRESS,
          contractAbi,
          readOnlyProvider
        );
        setContract(readContract);

        // Initialize Appkit
        const appkitInstance = new Appkit({
          projectId: 'the-cult', // Use your project ID
          networkRpcUrl: CONTRACT_CONFIG.RPC_URL,
          defaultChainId: 10143 // Monad chain ID
        });
        
        setAppkit(appkitInstance);

        // Check if user was previously connected
        const savedAccount = localStorage.getItem('connectedAccount');
        if (savedAccount) {
          try {
            // Attempt to reconnect
            await appkitInstance.connect();
            const connected = appkitInstance.getConnectedAccount();
            
            if (connected) {
              setAccount(connected);
              setIsConnected(true);
              
              // Get provider and signer
              const web3Provider = new ethers.providers.Web3Provider(appkitInstance.getProvider());
              setProvider(web3Provider);
              setSigner(web3Provider.getSigner());
              
              // Update contract with signer
              const connectedContract = new ethers.Contract(
                CONTRACT_CONFIG.CONTRACT_ADDRESS,
                contractAbi,
                web3Provider.getSigner()
              );
              setContract(connectedContract);
              
              // Get chain ID
              const network = await web3Provider.getNetwork();
              setChainId(network.chainId);
            }
          } catch (error) {
            console.warn('Failed to reconnect wallet:', error);
            localStorage.removeItem('connectedAccount');
          }
        }
      } catch (err) {
        console.error('Failed to initialize Appkit:', err);
        setError('Failed to initialize wallet connection');
      } finally {
        setIsLoading(false);
      }
    };

    init();

    // Cleanup
    return () => {
      if (appkit) {
        // Perform any necessary cleanup
      }
    };
  }, []);

  // Set up event listeners when appkit is initialized
  useEffect(() => {
    if (!appkit) return;

    const handleAccountsChanged = (accounts) => {
      if (accounts.length === 0) {
        // Disconnected
        disconnect();
      } else {
        // Account changed
        setAccount(accounts[0]);
        localStorage.setItem('connectedAccount', accounts[0]);
      }
    };

    const handleChainChanged = (chainId) => {
      // Handle chain changes
      setChainId(parseInt(chainId, 16));
      window.location.reload(); // Reload page on chain change
    };

    const handleConnect = (info) => {
      console.log('Wallet connected:', info);
    };

    const handleDisconnect = () => {
      console.log('Wallet disconnected');
      disconnect();
    };

    // Subscribe to events
    appkit.on('accountsChanged', handleAccountsChanged);
    appkit.on('chainChanged', handleChainChanged);
    appkit.on('connect', handleConnect);
    appkit.on('disconnect', handleDisconnect);

    // Cleanup
    return () => {
      appkit.off('accountsChanged', handleAccountsChanged);
      appkit.off('chainChanged', handleChainChanged);
      appkit.off('connect', handleConnect);
      appkit.off('disconnect', handleDisconnect);
    };
  }, [appkit]);

  // Connect wallet
  const connect = async () => {
    if (!appkit) {
      throw new Error('Appkit not initialized');
    }

    try {
      const accounts = await appkit.connect();
      
      if (accounts && accounts.length > 0) {
        const connectedAccount = accounts[0];
        setAccount(connectedAccount);
        setIsConnected(true);
        localStorage.setItem('connectedAccount', connectedAccount);
        
        // Update provider and signer
        const web3Provider = new ethers.providers.Web3Provider(appkit.getProvider());
        setProvider(web3Provider);
        setSigner(web3Provider.getSigner());
        
        // Update contract with signer
        const connectedContract = new ethers.Contract(
          CONTRACT_CONFIG.CONTRACT_ADDRESS,
          contractAbi,
          web3Provider.getSigner()
        );
        setContract(connectedContract);
        
        // Get chain ID
        const network = await web3Provider.getNetwork();
        setChainId(network.chainId);
        
        return connectedAccount;
      }
      
      throw new Error('No accounts returned from wallet');
    } catch (error) {
      console.error('Error connecting wallet with Appkit:', error);
      throw error;
    }
  };

  // Disconnect wallet
  const disconnect = async () => {
    if (!appkit) return;
    
    try {
      await appkit.disconnect();
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
    }
    
    // Reset state
    setAccount(null);
    setIsConnected(false);
    setSigner(null);
    localStorage.removeItem('connectedAccount');
    
    // Reset to read-only provider and contract
    const readOnlyProvider = new ethers.providers.JsonRpcProvider(CONTRACT_CONFIG.RPC_URL);
    setProvider(readOnlyProvider);
    
    const readContract = new ethers.Contract(
      CONTRACT_CONFIG.CONTRACT_ADDRESS,
      contractAbi,
      readOnlyProvider
    );
    setContract(readContract);
  };

  // Switch chain
  const switchChain = async (chainId) => {
    if (!appkit) {
      throw new Error('Appkit not initialized');
    }

    try {
      await appkit.switchChain(chainId);
    } catch (error) {
      console.error('Error switching chain:', error);
      throw error;
    }
  };

  // Sign message
  const signMessage = async (message) => {
    if (!appkit || !isConnected) {
      throw new Error('Wallet not connected');
    }

    try {
      return await appkit.signMessage(message);
    } catch (error) {
      console.error('Error signing message:', error);
      throw error;
    }
  };

  // Send transaction
  const sendTransaction = async (transaction) => {
    if (!appkit || !isConnected) {
      throw new Error('Wallet not connected');
    }

    try {
      return await appkit.sendTransaction(transaction);
    } catch (error) {
      console.error('Error sending transaction:', error);
      throw error;
    }
  };

  // Context value
  const value = {
    appkit,
    account,
    isConnected,
    provider,
    signer,
    contract,
    chainId,
    isLoading,
    error,
    connect,
    disconnect,
    switchChain,
    signMessage,
    sendTransaction
  };

  return (
    <AppkitContext.Provider value={value}>
      {children}
    </AppkitContext.Provider>
  );
}

// Custom hook to use the Appkit context
export function useAppkit() {
  const context = useContext(AppkitContext);
  if (!context) {
    throw new Error('useAppkit must be used within an AppkitProvider');
  }
  return context;
}