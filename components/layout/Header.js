'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useWeb3 } from '@/components/web3/Web3Provider';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [walletDropdownOpen, setWalletDropdownOpen] = useState(false);
  
  const { 
    address, 
    isConnected, 
    disconnect, 
    isWrongNetwork, 
    switchToMonad,
    ConnectWalletButton,
    formatAddress
  } = useWeb3();

  // Handle disconnect wallet button click
  const handleDisconnect = () => {
    disconnect();
    setWalletDropdownOpen(false);
  };

  // Handle network switch
  const handleSwitchNetwork = async () => {
    await switchToMonad();
  };

  return (
    <>
      <header>
        <div className="header-content">
          <div className="logo-container">
            <Link href="/" className="logo">
              <i className="fas fa-crown"></i>
              The Cult
            </Link>
            <div 
              className={`menu-toggle ${mobileMenuOpen ? 'active' : ''}`} 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span></span>
              <span></span>
              <span></span>
            </div>
            <nav>
              <ul className={`nav-menu ${mobileMenuOpen ? 'active' : ''}`}>
                <li className="nav-item">
                  <a href="#" className="nav-link">Discover <i className="fas fa-chevron-down"></i></a>
                  <div className="dropdown">
                    <a href="#" className="dropdown-item">Trending Celebs</a>
                    <a href="#" className="dropdown-item">New Launches</a>
                    <a href="#" className="dropdown-item">Verification Process</a>
                  </div>
                </li>
                <li className="nav-item">
                  <a href="#" className="nav-link">Trade <i className="fas fa-chevron-down"></i></a>
                  <div className="dropdown">
                    <a href="#" className="dropdown-item">Buy/Sell Interface</a>
                    <a href="#" className="dropdown-item">Your Portfolio</a>
                    <a href="#" className="dropdown-item">Transaction History</a>
                  </div>
                </li>
                <li className="nav-item">
                  <a href="#" className="nav-link">Leaderboard <i className="fas fa-chevron-down"></i></a>
                  <div className="dropdown">
                    <a href="#" className="dropdown-item">Top Performing Tokens</a>
                    <a href="#" className="dropdown-item">Most Active Communities</a>
                    <a href="#" className="dropdown-item">Highest Trading Volume</a>
                  </div>
                </li>
                <li className="nav-item">
                  <a href="#" className="nav-link">Resources <i className="fas fa-chevron-down"></i></a>
                  <div className="dropdown">
                    <a href="#" className="dropdown-item">Documentation</a>
                    <a href="#" className="dropdown-item">FAQs</a>
                    <a href="#" className="dropdown-item">Blog</a>
                  </div>
                </li>
                <li className="nav-item">
                  <a href="#" className="nav-link">About <i className="fas fa-chevron-down"></i></a>
                  <div className="dropdown">
                    <a href="#" className="dropdown-item">Team</a>
                    <a href="#" className="dropdown-item">Mission</a>
                    <a href="#" className="dropdown-item">Partners</a>
                  </div>
                </li>
              </ul>
            </nav>
          </div>
          <div className="auth-buttons">
            {/* Not connected or wrong network */}
            {!isConnected && (
              <div className="login-btn-container">
                <ConnectWalletButton
                  theme="dark"
                  btnTitle="Connect Wallet"
                  className="login-btn"
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

            {/* Wallet info (shown when connected) */}
            {isConnected && !isWrongNetwork && (
              <div className="wallet-container" style={{ display: 'flex' }}>
                <div 
                  className="wallet-info" 
                  onClick={() => setWalletDropdownOpen(!walletDropdownOpen)}
                >
                  <div className="wallet-icon">
                    <i className="fas fa-wallet"></i>
                  </div>
                  <span className="wallet-address">{formatAddress(address)}</span>
                  <i className="fas fa-chevron-down" style={{ marginLeft: '8px', fontSize: '12px' }}></i>
                </div>

                {/* Wallet dropdown */}
                <div className={`wallet-dropdown ${walletDropdownOpen ? 'active' : ''}`}>
                  <div className="wallet-dropdown-item">
                    <i className="fas fa-user"></i> Profile
                  </div>
                  <div className="wallet-dropdown-item">
                    <i className="fas fa-wallet"></i> My Wallet
                  </div>
                  <div className="wallet-dropdown-item">
                    <i className="fas fa-chart-line"></i> My Tokens
                  </div>
                  <div className="wallet-dropdown-item">
                    <i className="fas fa-cog"></i> Settings
                  </div>
                  <div className="wallet-dropdown-divider"></div>
                  <div 
                    className="wallet-dropdown-item disconnect" 
                    onClick={handleDisconnect}
                  >
                    <i className="fas fa-sign-out-alt"></i> Disconnect
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  );
}