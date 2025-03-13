'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ethers } from 'ethers';
import { useThirdweb } from '@/components/web3/ThirdwebProvider';
import { CONTRACT_CONFIG } from '@/constants/config';
import { contractAbi } from '@/constants/abi';
import styles from './TokenCreate.module.css';

export default function TokenCreatePage() {
  const [name, setName] = useState('');
  const [symbol, setSymbol] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [transaction, setTransaction] = useState(null);
  const [showErrorModal, setShowErrorModal] = useState(false);
  
  const router = useRouter();
  
  // Get thirdweb connection status and functions
  const { 
    isConnected, 
    signer,
    isWrongNetwork,
    switchToMonad,
    ConnectWalletButton
  } = useThirdweb();
  
  // Show error modal when an error is set
  useEffect(() => {
    if (error) {
      setShowErrorModal(true);
    } else {
      setShowErrorModal(false);
    }
  }, [error]);

  // Handle token creation
  const handleCreate = async () => {
    // Validate inputs
    if (!name || !symbol || !description) {
      setError('Please fill in all required fields.');
      return;
    }
    
    // Check if user is connected
    if (!isConnected) {
      setError('Please connect your wallet to create a token.');
      return;
    }
    
    // Check if user is on the right network
    if (isWrongNetwork) {
      setError('Please switch to the Monad network.');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // Create contract instance
      const contract = new ethers.Contract(
        CONTRACT_CONFIG.CONTRACT_ADDRESS,
        contractAbi,
        signer
      );
      
      // Call createMemeToken function
      const transaction = await contract.createMemeToken(
        name,
        symbol,
        description,
        imageUrl,
        {
          value: ethers.utils.parseEther('0.0001'), // Creation fee
        }
      );
      
      // Wait for transaction to complete
      const receipt = await transaction.wait();
      
      // Update UI state
      setSuccess(true);
      setTransaction(receipt);
      
      // After 3 seconds, redirect to home page
      setTimeout(() => {
        router.push('/');
      }, 3000);
      
    } catch (err) {
      console.error('Error creating token:', err);
      
      // Handle specific error types with user-friendly messages
      if (err.code === 'INSUFFICIENT_FUNDS') {
        setError('Insufficient funds in your wallet. Please make sure you have at least 0.0001 MON plus gas fees.');
      } else if (err.code === 'ACTION_REJECTED') {
        setError("Transaction was rejected. Please try again when you're ready to approve the transaction.");
      } else if (err.message && err.message.includes('user rejected')) {
        setError("Transaction was cancelled. Please try again when you're ready to approve the transaction.");
      } else if (err.message && err.message.includes('insufficient funds')) {
        setError('Insufficient funds in your wallet. Please make sure you have at least 0.0001 MON plus gas fees.');
      } else if (err.message && err.message.includes('gas')) {
        setError('Gas estimation failed. Your transaction might fail or the network could be congested. Try again later.');
      } else if (err.message && err.message.includes('nonce')) {
        setError('Transaction nonce error. Please refresh the page and try again.');
      } else {
        // Generic error message for other cases
        setError('Failed to create token. Please check your wallet connection and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Error modal component
  const ErrorModal = () => {
    if (!showErrorModal) return null;
    
    return (
      <div className={styles.modalOverlay}>
        <div className={styles.modal}>
          <div className={styles.modalHeader}>
            <h3 className={styles.modalTitle}>Error</h3>
            <button 
              className={styles.modalCloseBtn} 
              onClick={() => {
                setShowErrorModal(false);
                setError(null);
              }}
            >
              &times;
            </button>
          </div>
          <div className={styles.modalBody}>
            <div className={styles.modalIcon}>
              <i className="fas fa-exclamation-circle"></i>
            </div>
            <p className={styles.modalMessage}>{error}</p>
            <button 
              className={styles.modalBtn}
              onClick={() => {
                setShowErrorModal(false);
                setError(null);
              }}
            >
              OK
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container">
      <div className={styles.backLink}>
        <Link href="/" className={styles.goBack}>
          <i className="fas fa-arrow-left"></i> Back to Home
        </Link>
      </div>
      
      <div className={styles.tokenCreateContainer}>
        <div className={styles.tokenCreateCard}>
          <div className={styles.tokenCreateHeader}>
            <h2 className={styles.tokenCreateTitle}>Create New Token</h2>
          </div>
          
          <div className={styles.tokenCreateBody}>
            <div className={styles.infoBox}>
              <p className={styles.infoText}><i className="fas fa-info-circle"></i> Token creation fee: 0.0001 MON</p>
              <p className={styles.infoText}><i className="fas fa-info-circle"></i> Max supply: 1,000,000 tokens. Initial mint: 200,000 tokens.</p>
              <p className={styles.infoText}><i className="fas fa-info-circle"></i> If funding target of 24 MON is met, a liquidity pool will be created on Uniswap.</p>
            </div>
            
            {/* Network warning */}
            {isWrongNetwork && (
              <div className={styles.networkWarning}>
                <i className="fas fa-exclamation-triangle"></i>
                Wrong network detected. Please switch to Monad.
                <button 
                  className={styles.switchNetworkBtn}
                  onClick={() => switchToMonad()}
                >
                  Switch Network
                </button>
              </div>
            )}
            
            {/* Success message */}
            {success && (
              <div className={styles.successMessage}>
                <i className="fas fa-check-circle"></i> Token created successfully! Redirecting to home page...
                {transaction && (
                  <div className={styles.transactionHash}>
                    Transaction Hash: 
                    <a 
                      href={`https://monad.etherscan.io/tx/${transaction.transactionHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {transaction.transactionHash.substring(0, 10)}...
                    </a>
                  </div>
                )}
              </div>
            )}
            
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>Token Name*</label>
              <input
                type="text"
                className={styles.inputField}
                placeholder="E.g., Celebrity Token"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading || success}
              />
            </div>
            
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>Token Symbol*</label>
              <input
                type="text"
                className={styles.inputField}
                placeholder="E.g., CELEB"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value)}
                disabled={loading || success}
              />
            </div>
            
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>Description*</label>
              <textarea
                className={styles.textArea}
                placeholder="Describe your token and its purpose..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={loading || success}
              />
            </div>
            
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>Image URL (Optional)</label>
              <input
                type="text"
                className={styles.inputField}
                placeholder="https://example.com/image.jpg"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                disabled={loading || success}
              />
            </div>
            
            {!isConnected ? (
              <div className="login-btn-container">
                <ConnectWalletButton
                  theme="dark"
                  btnTitle="Connect Wallet"
                  className={styles.createButton}
                />
              </div>
            ) : (
              <button
                className={styles.createButton}
                onClick={handleCreate}
                disabled={loading || success}
              >
                {loading ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i> Creating Token...
                  </>
                ) : (
                  'Create Token'
                )}
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Error Modal */}
      <ErrorModal />
    </div>
  );
}