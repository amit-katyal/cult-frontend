'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { fetchAllTokens, calculateCost, buyTokens } from '@/lib/utils/web3Utils';
import { formatCurrency } from '@/lib/utils/formatUtils';

export default function TokenTable() {
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('verified');
  const router = useRouter();

  useEffect(() => {
    console.log('Component mounted, fetching token data');
    fetchTokenData();
  }, []);

  const fetchTokenData = async () => {
    try {
      console.log('fetchTokenData called');
      setLoading(true);
      const tokenData = await fetchAllTokens();
      console.log('Token data received:', tokenData);
      setTokens(tokenData);
      setError(null);
    } catch (err) {
      console.error('Error fetching tokens:', err);
      setError('Failed to load tokens. Please try again later.');
    } finally {
      setLoading(false);
      console.log('fetchTokenData complete');
    }
  };

  const handleRowClick = (tokenAddress) => {
    console.log('Row clicked for token:', tokenAddress);
    router.push(`/token/${tokenAddress}`);
  };

  const handleQuickBuy = async (e, tokenAddress) => {
    e.stopPropagation();
    try {
      console.log('Quick buy initiated for token:', tokenAddress);
      const amount = 0.1;
      const cost = await calculateCost(tokenAddress, amount);
      console.log('Cost calculated:', cost);
      if (confirm(`You are about to purchase ${amount} tokens for approximately ${parseFloat(cost).toFixed(6)} MON. Continue?`)) {
        console.log('User confirmed purchase');
        const receipt = await buyTokens(tokenAddress, amount.toString());
        console.log('Transaction receipt:', receipt);
        alert(`Transaction successful! Hash: ${receipt.transactionHash}`);
        fetchTokenData();
      } else {
        console.log('User canceled purchase');
      }
    } catch (error) {
      console.error('Error with quick buy:', error);
      alert(`Error: ${error.message ? error.message.substring(0, 100) : 'Unknown error'}`);
    }
  };

  const handleTabClick = (tab) => {
    console.log('Tab clicked:', tab);
    setActiveTab(tab);
  };

  return (
    <div>
      <div className="tabs-container">
        <div className="tabs-left">
          <button 
            className={`tab-btn category-tab ${activeTab === 'verified' ? 'active' : ''}`}
            onClick={() => handleTabClick('verified')}
          >
            Verifed<i className="fas fa-info-circle"></i>
          </button>
          <button 
            className={`tab-btn category-tab ${activeTab === 'topTraded' ? 'active' : ''}`}
            onClick={() => handleTabClick('topTraded')}
          >
            Top Traded
          </button>
          <button 
            className={`tab-btn category-tab ${activeTab === 'trending' ? 'active' : ''}`}
            onClick={() => handleTabClick('trending')}
          >
            Trending
          </button>
          <button 
            className={`tab-btn category-tab ${activeTab === 'newTokens' ? 'active' : ''}`}
            onClick={() => handleTabClick('newTokens')}
          >
            New Tokens <i className="fas fa-info-circle"></i>
          </button>
          <button 
            className={`tab-btn category-tab ${activeTab === 'watchlist' ? 'active' : ''}`}
            onClick={() => handleTabClick('watchlist')}
          >
            Watchlist
          </button>
        </div>
        <div className="filters-container">
          <button className="filter-btn">
            <i className="fas fa-filter"></i> Filters
          </button>
        </div>
      </div>

      <table className="tokens-table">
        <thead>
          <tr>
            <th className="sortable" style={{ textAlign: 'left' }}>
              Token / Symbol <i className="fas fa-chevron-down"></i>
            </th>
            <th>Age</th>
            <th>Mkt Cap</th>
            <th>24h Volume</th>
            <th>24h Txns</th>
            <th>Liquidity</th>
            <th>Holders</th>
            <th>Checklist</th>
            <th className="action-cell">Quick Buy</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="9" style={{ textAlign: 'center' }}>Loading tokens...</td>
            </tr>
          ) : error ? (
            <tr>
              <td colSpan="9" style={{ textAlign: 'center', color: 'var(--danger-color)' }}>{error}</td>
            </tr>
          ) : tokens.length === 0 ? (
            <tr>
              <td colSpan="9" style={{ textAlign: 'center' }}>No tokens found</td>
            </tr>
          ) : (
            tokens.map((token, index) => (
              <tr 
                key={index} 
                onClick={() => handleRowClick(token.tokenAddress)}
                style={{ cursor: 'pointer' }}
              >
                <td style={{ textAlign: 'left' }}>
                  <div className="token-info">
                    <div className="token-icon">
                      <img 
                        src={token.tokenImageUrl} 
                        alt={token.symbol}
                        width={36}
                        height={36}
                      />
                    </div>
                    <div className="token-name-container">
                      <div className="token-name">
                        <span className="token-name-text">{token.name}</span> 
                        <i className="fas fa-check-circle verified-badge"></i>
                      </div>
                      <div className="token-symbol">
                        <span className="token-symbol-text">{token.symbol}</span>
                      </div>
                    </div>
                  </div>
                </td>
                <td style={{ textAlign: 'center' }}>12s</td>
                <td style={{ textAlign: 'center' }}>
                  {formatCurrency(token.fundingRaised)}
                </td>
                <td style={{ textAlign: 'center' }}>-</td>
                <td style={{ textAlign: 'center' }}>-</td>
                <td style={{ textAlign: 'center' }}>-</td>
                <td style={{ textAlign: 'center' }}>-</td>
                <td style={{ textAlign: 'center' }}>
                  <div className="checklist-cell" style={{ justifyContent: 'center' }}>
                    <span className="checklist-value">4/4</span>
                    <i className="fas fa-info-circle checklist-info"></i>
                  </div>
                </td>
                <td className="action-cell">
                  <button 
                    className="buy-btn"
                    onClick={(e) => handleQuickBuy(e, token.tokenAddress)}
                  >
                    <i className="fas fa-bolt"></i> 0.1
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
