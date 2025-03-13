'use client';

import { useState, useEffect } from 'react';
import { useWeb3 } from '@/components/web3/Web3Provider';
import { formatAddress } from '@/lib/utils/formatUtils';

export default function WalletConnect({ onConnected, onDisconnected }) {
  const { 
    address, 
    isConnected, 
    disconnect, 
    isWrongNetwork, 
    switchToMonad,
    ConnectWalletButton
  } = useWeb3();

  // Call onConnected callback when address changes
  useEffect(() => {
    if (isConnected && address && onConnected) {
      onConnected(address);
    }
  }, [isConnected, address, onConnected]);

  // Handle disconnect
  const handleDisconnect = () => {
    disconnect();
    if (onDisconnected) {
      onDisconnected();
    }
  };

  // Handle network switch
  const handleSwitchNetwork = async () => {
    await switchToMonad();
  };

  return (
    <>
      {!isConnected && (
        <div className="login-btn-container">
          <ConnectWalletButton
            theme="dark"
            btnTitle="Connect Wallet"
            className="login-btn"
            dropdownPosition={{
              side: "bottom",
              align: "end"
            }}
          />
        </div>
      )}

      {/* Wrong Network Warning */}
      {isWrongNetwork && (
        <button 
          className="login-btn wrong-network"
          onClick={handleSwitchNetwork}
        >
          <i className="fas fa-exclamation-triangle"></i> Switch to Monad
        </button>
      )}

      {isConnected && !isWrongNetwork && (
        <div className="wallet-info">
          <div className="wallet-icon">
            <i className="fas fa-wallet"></i>
          </div>
          <span className="wallet-address">{formatAddress(address)}</span>
          <button className="login-btn disconnect-btn" onClick={handleDisconnect}>
            Disconnect
          </button>
        </div>
      )}
    </>
  );
}