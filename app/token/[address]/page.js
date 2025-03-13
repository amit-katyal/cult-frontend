"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Chart } from "chart.js/auto";
import { ethers } from "ethers";
import styles from "@/styles/TokenDetail.module.css";
import { useWeb3 } from "@/components/web3/Web3Provider";
import { CONTRACT_CONFIG } from "@/constants/config";
import { contractAbi, tokenAbi } from "@/constants/abi";
import VerifyToken from "./verify"; // Adjust the path as needed

const MAX_SUPPLY = 800000;
const FUNDING_GOAL = 24;
const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

function formatAddress(address) {
  if (!address) return "";
  return `${address.substring(0, 6)}...${address.substring(
    address.length - 4,
  )}`;
}

function formatCurrency(amount, symbol = "MON", decimals = 6) {
  if (!amount && amount !== 0) return `0 ${symbol}`;
  const value = typeof amount === "string" ? parseFloat(amount) : amount;
  const formatted = value.toFixed(decimals);
  const trimmed = formatted.replace(/\.?0+$/, "");
  return `${trimmed} ${symbol}`;
}

async function copyToClipboard(text) {
  if (navigator.clipboard) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (e) {
      console.log("Failed to copy using navigator.clipboard:", e);
    }
  }
  try {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    textArea.style.top = "-999999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);
    return true;
  } catch (e) {
    console.log("Failed to copy using fallback:", e);
    return false;
  }
}

export default function TokenDetailPage({ params }) {
  const { address: tokenAddress } = params;
  const router = useRouter();

  const {
    isConnected,
    address,
    signer,
    provider,
    isWrongNetwork,
    switchToMonad,
    ConnectWalletButton,
  } = useWeb3();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [tokenData, setTokenData] = useState({
    name: "Loading...",
    symbol: "...",
    description: "Loading token details...",
    fundingRaised: "0",
    creatorAddress: ZERO_ADDRESS,
    address: tokenAddress,
    totalSupply: "200000",
    remainingTokens: MAX_SUPPLY,
    tokenDecimals: 18,
    tokenImageUrl: "",
  });

  const [owners, setOwners] = useState([]);
  const [transfers, setTransfers] = useState([]);
  const [activeTimeframe, setActiveTimeframe] = useState("1d");

  // Controls the "Buy" vs "Sell" tab
  const [activeTradeTab, setActiveTradeTab] = useState("buy");

  // Buy inputs
  const [buyAmount, setBuyAmount] = useState("");
  const [buyCost, setBuyCost] = useState("0");

  // Sell inputs
  const [sellAmount, setSellAmount] = useState("");
  const [sellReceive, setSellReceive] = useState("0");

  // The trade modal we open for either buy or sell
  const [tradeModal, setTradeModal] = useState({
    isOpen: false,
    isSell: false,
    amount: "0",
    cost: "0",
    status: null,
  });

  // Chart references
  const priceChartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    loadTokenData();
  }, [tokenAddress]);

  useEffect(() => {
    if (!loading && priceChartRef.current) {
      setupPriceChart();
    }
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [loading, priceChartRef.current]);

  const loadTokenData = async () => {
    console.log("Loading token data...");
    try {
      setLoading(true);
      setError(null);

      if (!ethers.utils.isAddress(tokenAddress)) {
        throw new Error("Invalid token address format");
      }

      const fetchPromises = [
        fetchBasicTokenData(),
        fetchOwnersData(),
        fetchTransfersData(),
      ];

      const [tokenBasicData, ownersData, transfersData] =
        await Promise.allSettled(fetchPromises);

      let totalSupplyValue = 0;
      if (
        tokenBasicData.status === "fulfilled" &&
        tokenBasicData.value.totalSupply
      ) {
        totalSupplyValue =
          parseFloat(tokenBasicData.value.totalSupply) - 200000;
      }

      const updatedTokenData = {
        ...tokenData,
        ...(tokenBasicData.status === "fulfilled" ? tokenBasicData.value : {}),
        totalSupply: totalSupplyValue.toString(),
        remainingTokens: MAX_SUPPLY - totalSupplyValue,
        priceHistory: generatePriceHistoryData(),
      };

      setTokenData(updatedTokenData);

      if (ownersData.status === "fulfilled") {
        setOwners(ownersData.value);
      }
      if (transfersData.status === "fulfilled") {
        setTransfers(transfersData.value);
      }
    } catch (err) {
      console.log("Error loading token data:", err);
      setError("Failed to load complete token data. Some info may be missing.");
    } finally {
      setLoading(false);
    }
  };

  const fetchBasicTokenData = async () => {
    console.log("Fetching basic token data...");
    try {
      const rpcProvider = new ethers.providers.JsonRpcProvider(
        CONTRACT_CONFIG.RPC_URL,
      );
      const tokenContract = new ethers.Contract(
        tokenAddress,
        tokenAbi,
        rpcProvider,
      );

      const [name, symbol, totalSupply, decimals] = await Promise.all([
        tokenContract.name().catch(() => "Unknown Token"),
        tokenContract.symbol().catch(() => "TOKEN"),
        tokenContract
          .totalSupply()
          .catch(() => ethers.utils.parseUnits("200000", "ether")),
        tokenContract.decimals().catch(() => 18),
      ]);

      let fundingRaised = "0";
      let tokenImageUrl = "";
      try {
        const mainContract = new ethers.Contract(
          CONTRACT_CONFIG.CONTRACT_ADDRESS,
          contractAbi,
          rpcProvider,
        );
        const info = await mainContract.getAllMemeTokens();
        const found = info.find(
          (t) => t.tokenAddress.toLowerCase() === tokenAddress.toLowerCase(),
        );
        if (found) {
          fundingRaised = ethers.utils.formatEther(found.fundingRaised || "0");
          tokenImageUrl = found.tokenImageUrl;
        }
      } catch (e) {
        console.log("Could not fetch fundingRaised:", e);
      }

      const totalSupplyFormatted = ethers.utils.formatUnits(
        totalSupply,
        decimals,
      );
      return {
        name,
        symbol,
        totalSupply: totalSupplyFormatted,
        tokenDecimals: decimals,
        fundingRaised,
        tokenImageUrl: tokenImageUrl,
      };
    } catch (error) {
      console.log("Error fetching basic token data:", error);
      return {};
    }
  };

  const fetchOwnersData = async () => {
    console.log("Fetching owners data from Moralis...");
    try {
      const ownersResponse = await fetch(
        `https://deep-index.moralis.io/api/v2.2/erc20/${tokenAddress}/owners?chain=monad&order=DESC`,
        {
          headers: {
            accept: "application/json",
            "X-API-Key": CONTRACT_CONFIG.MORALIS_API_KEY,
          },
        },
      );
      if (!ownersResponse.ok) {
        throw new Error(`Failed to fetch owners: ${ownersResponse.status}`);
      }
      const ownersData = await ownersResponse.json();
      return ownersData.result || [];
    } catch (error) {
      console.log("Error fetching owners data:", error);
      return [];
    }
  };

  const fetchTransfersData = async () => {
    console.log("Fetching transfers data from Moralis...");
    try {
      const transfersResponse = await fetch(
        `https://deep-index.moralis.io/api/v2.2/erc20/${tokenAddress}/transfers?chain=monad&order=DESC`,
        {
          headers: {
            accept: "application/json",
            "X-API-Key": CONTRACT_CONFIG.MORALIS_API_KEY,
          },
        },
      );
      if (!transfersResponse.ok) {
        throw new Error(
          `Failed to fetch transfers: ${transfersResponse.status}`,
        );
      }
      const transfersData = await transfersResponse.json();
      return transfersData.result || [];
    } catch (error) {
      console.log("Error fetching transfers data:", error);
      return [];
    }
  };

  const setupPriceChart = () => {
    if (!priceChartRef.current) return;
    const ctx = priceChartRef.current.getContext("2d");
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }
    if (!tokenData.priceHistory) {
      tokenData.priceHistory = generatePriceHistoryData();
    }
    const data = tokenData.priceHistory[activeTimeframe];
    chartInstanceRef.current = new Chart(ctx, {
      type: "line",
      data: {
        labels: data.labels,
        datasets: [
          {
            label: "Token Price (MON)",
            data: data.values,
            backgroundColor: "rgba(99, 102, 241, 0.1)",
            borderColor: "rgba(99, 102, 241, 1)",
            borderWidth: 2,
            pointBackgroundColor: "rgba(99, 102, 241, 1)",
            pointBorderColor: "#fff",
            pointBorderWidth: 1,
            pointRadius: 3,
            pointHoverRadius: 5,
            tension: 0.2,
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: "#9ca3af" },
          },
          y: {
            grid: { color: "rgba(107, 114, 128, 0.1)" },
            ticks: {
              color: "#9ca3af",
              callback: function (value) {
                return value.toFixed(6) + " MON";
              },
            },
          },
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: "rgba(17, 24, 39, 0.8)",
            titleColor: "#f3f4f6",
            bodyColor: "#f3f4f6",
            borderColor: "rgba(107, 114, 128, 0.2)",
            borderWidth: 1,
            padding: 12,
            displayColors: false,
            callbacks: {
              label: function (context) {
                return context.parsed.y.toFixed(6) + " MON";
              },
            },
          },
        },
      },
    });
  };

  const updateChartTimeframe = (timeframe) => {
    setActiveTimeframe(timeframe);
    if (tokenData.priceHistory && chartInstanceRef.current) {
      const data = tokenData.priceHistory[timeframe];
      chartInstanceRef.current.data.labels = data.labels;
      chartInstanceRef.current.data.datasets[0].data = data.values;
      chartInstanceRef.current.update();
    }
  };

  // BUY
  const handleBuyAmountChange = (e) => {
    const value = e.target.value;
    setBuyAmount(value);
    console.log("Buy amount changed:", value);
    if (value && parseFloat(value) > 0) {
      const cost = calculateSimpleCost(parseFloat(value));
      setBuyCost(cost.toFixed(6));
    } else {
      setBuyCost("0");
    }
  };

  // SELL
  const handleSellAmountChange = (e) => {
    const value = e.target.value;
    setSellAmount(value);
    console.log("Sell amount changed:", value);
    if (value && parseFloat(value) > 0) {
      const receive = calculateSimpleSell(parseFloat(value));
      setSellReceive(receive.toFixed(6));
    } else {
      setSellReceive("0");
    }
  };

  // Simple cost function (buy)
  const calculateSimpleCost = (amount) => {
    console.log("Calculating buy cost for", amount);
    if (isNaN(amount) || amount <= 0) return 0;
    try {
      const initialSupply = 200000;
      const currentSupply = parseFloat(tokenData.totalSupply);
      const actualSupply = Math.max(0, currentSupply - initialSupply);
      const k = 0.0000001;
      const n = 1.5;
      const cost =
        (k *
          (Math.pow(actualSupply + amount, n + 1) -
            Math.pow(actualSupply, n + 1))) /
        (n + 1);
      if (isNaN(cost) || cost < 0) return 0;
      return cost;
    } catch (error) {
      console.log("Error in cost calc:", error);
      return 0;
    }
  };

  // Simple sell function
  const calculateSimpleSell = (amount) => {
    console.log("Calculating sell receive for", amount);
    const initialSupply = 200000;
    const currentSupply = parseFloat(tokenData.totalSupply) - initialSupply;
    const k = 0.0000001;
    const n = 1.5;
    const sellAmount = Math.min(amount, currentSupply);
    const receive =
      (k *
        (Math.pow(currentSupply, n + 1) -
          Math.pow(currentSupply - sellAmount, n + 1))) /
      (n + 1);
    return receive * 0.95;
  };

  // When user clicks "Buy" or "Sell" button
  const handleTradeClick = async (tradeType) => {
    console.log("Trade button clicked:", tradeType);
    if (tradeType === "buy") {
      if (!buyAmount || parseFloat(buyAmount) <= 0) {
        alert("Enter a valid buy amount");
        return;
      }
      if (parseFloat(buyAmount) > tokenData.remainingTokens) {
        alert(
          `Only ${tokenData.remainingTokens} tokens available for purchase`,
        );
        return;
      }
    } else {
      if (!sellAmount || parseFloat(sellAmount) <= 0) {
        alert("Enter a valid sell amount");
        return;
      }
    }

    if (isWrongNetwork) {
      const success = await switchToMonad();
      if (!success) {
        alert("Switch to Monad network to proceed");
        return;
      }
    }

    if (!isConnected) {
      alert("Connect your wallet first");
      return;
    }

    // Open the trade modal
    setTradeModal({
      isOpen: true,
      isSell: tradeType === "sell",
      amount: tradeType === "buy" ? buyAmount : sellAmount,
      cost: tradeType === "buy" ? buyCost : sellReceive,
      status: null,
    });
  };

  // Actually perform buy or sell
  const executeTransaction = async () => {
    console.log("Confirming transaction:", tradeModal.isSell ? "SELL" : "BUY");
    setTradeModal({
      ...tradeModal,
      status: { type: "loading", message: "Processing transaction..." },
    });
    try {
      if (!signer) {
        throw new Error("No signer found");
      }
      const contract = new ethers.Contract(
        CONTRACT_CONFIG.CONTRACT_ADDRESS,
        contractAbi,
        signer,
      );

      let tx;
      if (tradeModal.isSell) {
        console.log("Executing SELL with amount:", tradeModal.amount);
        const tokenContract = new ethers.Contract(
          tokenAddress,
          tokenAbi,
          signer,
        );
        setTradeModal({
          ...tradeModal,
          status: { type: "loading", message: "Approving token transfer..." },
        });
        const amountToSellWei = ethers.utils.parseUnits(
          tradeModal.amount,
          tokenData.tokenDecimals,
        );
        const approvalTx = await tokenContract.approve(
          CONTRACT_CONFIG.CONTRACT_ADDRESS,
          amountToSellWei,
        );
        await approvalTx.wait();
        setTradeModal({
          ...tradeModal,
          status: {
            type: "loading",
            message: "Approval confirmed. Selling...",
          },
        });
        tx = await contract.sellMemeToken(tokenAddress, amountToSellWei);
      } else {
        console.log("Executing BUY with amount:", tradeModal.amount);
        const costWei = ethers.utils.parseEther(tradeModal.cost);
        const formattedAmount = ethers.utils.parseUnits(
          tradeModal.amount,
          tokenData.tokenDecimals,
        );
        tx = await contract.buyMemeToken(tokenAddress, formattedAmount, {
          value: costWei,
        });
      }

      setTradeModal({
        ...tradeModal,
        status: {
          type: "loading",
          message: "Transaction submitted. Waiting for confirmation...",
        },
      });

      const receipt = await tx.wait();
      setTradeModal({
        ...tradeModal,
        status: {
          type: "success",
          message: `Transaction success! Hash: ${receipt.transactionHash.substring(
            0,
            10,
          )}...`,
        },
      });

      setTimeout(() => {
        loadTokenData();
        setTimeout(() => {
          setTradeModal({ isOpen: false });
          setBuyAmount("");
          setBuyCost("0");
          setSellAmount("");
          setSellReceive("0");
        }, 1500);
      }, 2000);
    } catch (error) {
      console.log("Trade failed:", error);
      let errorMessage = "Transaction failed";
      if (
        error.message.includes("Not enough tokens available") ||
        error.message.includes("Insufficient supply")
      ) {
        errorMessage = "Not enough tokens available. Try a smaller buy.";
      } else if (error.message.includes("user rejected")) {
        errorMessage = "Transaction rejected by user";
      } else if (error.message.includes("insufficient funds")) {
        errorMessage = "Not enough MON to complete this buy";
      } else if (
        error.message.includes("gas") ||
        error.message.includes("UNPREDICTABLE_GAS_LIMIT")
      ) {
        errorMessage =
          "Cannot process transaction. Try a smaller amount or contact support.";
      } else {
        errorMessage = `Transaction failed: ${error.message.split("(")[0]}`;
      }
      setTradeModal({
        ...tradeModal,
        status: { type: "error", message: errorMessage },
      });
    }
  };

  const handleCopyAddress = async (text, buttonId) => {
    console.log("Copying address:", text);
    const success = await copyToClipboard(text);
    if (success) {
      const button = document.getElementById(buttonId);
      if (button) {
        const originalHTML = button.innerHTML;
        button.innerHTML = '<i class="fas fa-check"></i>';
        setTimeout(() => {
          button.innerHTML = originalHTML;
        }, 1500);
      }
    }
  };

  const generatePriceHistoryData = () => {
    function generateRandomWalk(length, startPrice, volatility, trend) {
      const prices = [startPrice];
      for (let i = 1; i < length; i++) {
        const randomFactor = (Math.random() - 0.5) * 2 * volatility;
        const trendFactor = trend * (1 + Math.random() * 0.5);
        const newPrice = Math.max(
          0.000001,
          prices[i - 1] * (1 + randomFactor + trendFactor),
        );
        prices.push(newPrice);
      }
      return prices;
    }

    const dailyLabels = [];
    const now = new Date();
    for (let i = 23; i >= 0; i--) {
      const date = new Date(now);
      date.setHours(now.getHours() - i);
      dailyLabels.push(date.getHours() + ":00");
    }

    const startPrice =
      (parseFloat(tokenData.fundingRaised) /
        (parseFloat(tokenData.totalSupply) - 200000)) *
        0.5 || 0.0001;

    const dailyValues = generateRandomWalk(24, startPrice, 0.03, 0.005);
    const weeklyLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const weeklyValues = generateRandomWalk(7, startPrice * 0.8, 0.05, 0.01);

    const monthlyLabels = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(now.getDate() - i);
      monthlyLabels.push(`${date.getDate()}`);
    }
    const monthlyValues = generateRandomWalk(30, startPrice * 0.5, 0.07, 0.015);

    const allLabels = [];
    for (let i = 0; i < 12; i++) {
      allLabels.push(`Month ${i + 1}`);
    }
    const allValues = generateRandomWalk(12, startPrice * 0.1, 0.1, 0.03);

    return {
      "1d": { labels: dailyLabels, values: dailyValues },
      "1w": { labels: weeklyLabels, values: weeklyValues },
      "1m": { labels: monthlyLabels, values: monthlyValues },
      all: { labels: allLabels, values: allValues },
    };
  };

  const Modal = ({ isOpen, onClose, title, children, footer, status }) => {
    if (!isOpen) return null;
    const renderStatus = () => {
      if (!status) return null;
      let iconClass = "";
      let statusClass = "";

      switch (status.type) {
        case "loading":
          iconClass = "fa-spinner fa-spin";
          statusClass = "status-loading";
          break;
        case "success":
          iconClass = "fa-check-circle";
          statusClass = "status-success";
          break;
        case "error":
          iconClass = "fa-exclamation-circle";
          statusClass = "status-error";
          break;
        default:
          iconClass = "fa-info-circle";
          statusClass = "status-info";
      }

      return (
        <div className={`modal-status ${statusClass}`}>
          <i className={`fas ${iconClass}`}></i>
          <p className="status-text">{status.message}</p>
        </div>
      );
    };

    return (
      <div className="modal-overlay active">
        <div className="modal">
          <div className="modal-header">
            <h3 className="modal-title">{title}</h3>
            <button className="modal-close" onClick={onClose}>
              &times;
            </button>
          </div>
          <div className="modal-body">
            {children}
            {status && renderStatus()}
          </div>
          {footer && <div className="modal-footer">{footer}</div>}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className={styles.loadingOverlay + " " + styles.active}>
        <div className={styles.loadingContent}>
          <div className={styles.loadingSpinner}>
            <i className="fas fa-spinner fa-spin"></i>
          </div>
          <p className={styles.loadingText}>Loading token data...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="container">
        <div className={styles.backLink}>
          <Link href="/" className={styles.goBack}>
            <i className="fas fa-arrow-left"></i> Back to Home
          </Link>
        </div>

        <div className={styles.tokenDetailContainer}>
          <div className={styles.tokenDetailHeader}>
            <div className={styles.tokenDetailInfo}>
              <div className={styles.tokenDetailIcon}>
                <Image
                  src={tokenData.tokenImageUrl}
                  alt={tokenData.tokenImageUrl || "a"}
                  width={120}
                  height={120}
                />
              </div>
              <div className={styles.tokenDetailMain}>
                <h1 className={styles.tokenDetailName}>{tokenData.name}</h1>
                <div className={styles.tokenDetailSymbol}>
                  {tokenData.symbol}
                </div>
                <div className={styles.tokenDetailAddressRow}>
                  <div className={styles.tokenDetailLabel}>Token Address:</div>
                  <div
                    className={
                      styles.tokenDetailValue + " " + styles.tokenAddress
                    }
                  >
                    {tokenData.address}
                  </div>
                  <button
                    id="copyTokenAddressBtn"
                    className={styles.copyBtn}
                    onClick={() =>
                      handleCopyAddress(
                        tokenData.address,
                        "copyTokenAddressBtn",
                      )
                    }
                  >
                    <i className="fas fa-copy"></i>
                  </button>
                </div>
                <div className={styles.tokenDetailAddressRow}>
                  <div className={styles.tokenDetailLabel}>Creator:</div>
                  <div
                    className={
                      styles.tokenDetailValue + " " + styles.creatorAddress
                    }
                  >
                    {tokenData.creatorAddress ||
                      owners[0]?.owner_address ||
                      ZERO_ADDRESS}
                  </div>
                  <button
                    id="copyCreatorAddressBtn"
                    className={styles.copyBtn}
                    onClick={() =>
                      handleCopyAddress(
                        tokenData.creatorAddress ||
                          owners[0]?.owner_address ||
                          ZERO_ADDRESS,
                        "copyCreatorAddressBtn",
                      )
                    }
                  >
                    <i className="fas fa-copy"></i>
                  </button>
                </div>
                <div className={styles.tokenDetailDescription}>
                  {tokenData.description ||
                    "This token represents a community with innovative tokenomics."}
                </div>
              </div>
            </div>
            <div className={styles.tokenDetailStatus}>
              <div className={styles.tokenDetailStatusItem}>
                <div className={styles.tokenDetailStatusLabel}>
                  Funding Raised
                </div>
                <div className={styles.tokenDetailStatusValue}>
                  {formatCurrency(tokenData.fundingRaised, "MON")}
                </div>
              </div>
              <div className={styles.tokenDetailStatusDivider}></div>
              <div className={styles.tokenDetailStatusItem}>
                <div className={styles.tokenDetailStatusLabel}>
                  Total Holders
                </div>
                <div className={styles.tokenDetailStatusValue}>
                  {owners.length || 0}
                </div>
              </div>
              <div className={styles.tokenDetailStatusDivider}></div>
              <div className={styles.tokenDetailStatusItem}>
                <div className={styles.tokenDetailStatusLabel}>
                  Total Transactions
                </div>
                <div className={styles.tokenDetailStatusValue}>
                  {transfers.length || 0}
                </div>
              </div>
            </div>
          </div>

          <div className={styles.tokenDetailGrid}>
            {/* LEFT SIDE */}
            <div className={styles.tokenDetailLeft}>
              <div className={styles.detailCard}>
                <div className={styles.detailCardHeader}>
                  <h3 className={styles.detailCardTitle}>Price Chart</h3>
                  <div className={styles.detailCardActions}>
                    <button
                      className={`${styles.chartTimeBtn} ${
                        activeTimeframe === "1d" ? styles.active : ""
                      }`}
                      onClick={() => updateChartTimeframe("1d")}
                    >
                      1D
                    </button>
                    <button
                      className={`${styles.chartTimeBtn} ${
                        activeTimeframe === "1w" ? styles.active : ""
                      }`}
                      onClick={() => updateChartTimeframe("1w")}
                    >
                      1W
                    </button>
                    <button
                      className={`${styles.chartTimeBtn} ${
                        activeTimeframe === "1m" ? styles.active : ""
                      }`}
                      onClick={() => updateChartTimeframe("1m")}
                    >
                      1M
                    </button>
                    <button
                      className={`${styles.chartTimeBtn} ${
                        activeTimeframe === "all" ? styles.active : ""
                      }`}
                      onClick={() => updateChartTimeframe("all")}
                    >
                      All
                    </button>
                  </div>
                </div>
                <div className={styles.detailCardBody}>
                  <canvas ref={priceChartRef} height={250}></canvas>
                </div>
              </div>

              <div className={styles.detailCard}>
                <div className={styles.detailCardHeader}>
                  <h3 className={styles.detailCardTitle}>
                    Bonding Curve Progress
                  </h3>
                </div>
                <div className={styles.detailCardBody}>
                  <div className={styles.progressInfo}>
                    <span>
                      {tokenData.fundingRaised} / {FUNDING_GOAL} MON
                    </span>
                  </div>
                  <div className={styles.progressBarContainer}>
                    <div
                      className={styles.progressBar}
                      style={{
                        width: `${Math.min(
                          (parseFloat(tokenData.fundingRaised) / FUNDING_GOAL) *
                            100,
                          100,
                        )}%`,
                      }}
                    ></div>
                  </div>
                  <div className={styles.progressDescription}>
                    When the market cap reaches 24 MON, liquidity from the curve
                    will be deposited into Uniswap and LP tokens burned.
                  </div>
                </div>
              </div>

              <div className={styles.detailCard}>
                <div className={styles.detailCardHeader}>
                  <h3 className={styles.detailCardTitle}>
                    Remaining Tokens for Sale
                  </h3>
                </div>
                <div className={styles.detailCardBody}>
                  <div className={styles.progressInfo}>
                    <span>
                      {tokenData.remainingTokens.toLocaleString()} /{" "}
                      {MAX_SUPPLY.toLocaleString()}
                    </span>
                  </div>
                  <div className={styles.progressBarContainer}>
                    <div
                      className={styles.progressBar}
                      style={{
                        width: `${Math.min(
                          ((MAX_SUPPLY - tokenData.remainingTokens) /
                            MAX_SUPPLY) *
                            100,
                          100,
                        )}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* TRADE CARD WITH TABS */}
              <div className={styles.detailCard}>
                <div className={styles.detailCardHeader}>
                  <h3 className={styles.detailCardTitle}>Trade</h3>
                </div>
                <div className={styles.detailCardBody}>
                  {isWrongNetwork && (
                    <div className={styles.networkWarning}>
                      <i className="fas fa-exclamation-triangle"></i>
                      Wrong network detected. Switch to Monad.
                      <button
                        className={styles.switchNetworkBtn}
                        onClick={() => switchToMonad()}
                      >
                        Switch Network
                      </button>
                    </div>
                  )}

                  {/* Tabs */}
                  <div className={styles.tradeTabs}>
                    <button
                      className={`${styles.tradeTabBtn} ${
                        activeTradeTab === "buy" ? styles.active : ""
                      }`}
                      onClick={() => setActiveTradeTab("buy")}
                    >
                      Buy
                    </button>
                    <button
                      className={`${styles.tradeTabBtn} ${
                        activeTradeTab === "sell" ? styles.active : ""
                      }`}
                      onClick={() => setActiveTradeTab("sell")}
                    >
                      Sell
                    </button>
                  </div>

                  {/* BUY TAB */}
                  <div
                    className={`${styles.tradeTabContent} ${
                      activeTradeTab === "buy" ? styles.active : ""
                    }`}
                  >
                    <div className={styles.tradeInputGroup}>
                      <label className={styles.tradeLabel}>Amount to Buy</label>
                      <div className={styles.tradeInputContainer}>
                        <input
                          type="number"
                          className={styles.tradeInput}
                          placeholder="0"
                          value={buyAmount}
                          onChange={handleBuyAmountChange}
                        />
                        <div className={styles.tradeInputSuffix}>
                          {tokenData.symbol}
                        </div>
                      </div>
                    </div>

                    <div className={styles.tradeTotal}>
                      <span className={styles.tradeTotalLabel}>Cost (MON)</span>
                      <span className={styles.tradeTotalValue}>{buyCost}</span>
                    </div>

                    {!isConnected ? (
                      <div className="login-btn-container">
                        <ConnectWalletButton
                          theme="dark"
                          btnTitle="Connect Wallet"
                          className={styles.tradeBtn}
                        />
                      </div>
                    ) : isWrongNetwork ? (
                      <button
                        className={`${styles.tradeBtn} ${styles.wrongNetworkBtn}`}
                        onClick={() => switchToMonad()}
                      >
                        Switch to Monad
                      </button>
                    ) : (
                      <button
                        className={styles.tradeBtn}
                        onClick={() => handleTradeClick("buy")}
                      >
                        Buy
                      </button>
                    )}
                  </div>

                  {/* SELL TAB */}
                  <div
                    className={`${styles.tradeTabContent} ${
                      activeTradeTab === "sell" ? styles.active : ""
                    }`}
                  >
                    <div className={styles.tradeInputGroup}>
                      <label className={styles.tradeLabel}>
                        Amount to Sell
                      </label>
                      <div className={styles.tradeInputContainer}>
                        <input
                          type="number"
                          className={styles.tradeInput}
                          placeholder="0"
                          value={sellAmount}
                          onChange={handleSellAmountChange}
                        />
                        <div className={styles.tradeInputSuffix}>
                          {tokenData.symbol}
                        </div>
                      </div>
                    </div>

                    <div className={styles.tradeTotal}>
                      <span className={styles.tradeTotalLabel}>
                        You Receive (MON)
                      </span>
                      <span className={styles.tradeTotalValue}>
                        {sellReceive}
                      </span>
                    </div>

                    {!isConnected ? (
                      <div className="login-btn-container">
                        <ConnectWalletButton
                          theme="dark"
                          btnTitle="Connect Wallet"
                          className={styles.tradeBtn}
                        />
                      </div>
                    ) : isWrongNetwork ? (
                      <button
                        className={`${styles.tradeBtn} ${styles.wrongNetworkBtn}`}
                        onClick={() => switchToMonad()}
                      >
                        Switch to Monad
                      </button>
                    ) : (
                      <button
                        className={styles.tradeBtn}
                        onClick={() => handleTradeClick("sell")}
                      >
                        Sell
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT SIDE */}
            <div className={styles.tokenDetailRight}>
              <div className={styles.detailCard}>
                <div className={styles.detailCardHeader}>
                  <h3 className={styles.detailCardTitle}>Owners</h3>
                </div>
                <div className={styles.detailCardBody}>
                  <div className={styles.detailTableContainer}>
                    <table className={styles.detailTable}>
                      <thead>
                        <tr>
                          <th>Owner Address</th>
                          <th>Percentage</th>
                        </tr>
                      </thead>
                      <tbody>
                        {owners && owners.length > 0 ? (
                          owners.map((owner, index) => (
                            <tr key={index}>
                              <td title={owner.owner_address}>
                                <span className={styles.tableAddress}>
                                  {formatAddress(owner.owner_address)}
                                </span>
                              </td>
                              <td>
                                {parseFloat(
                                  owner.percentage_relative_to_total_supply,
                                ).toFixed(2)}
                                %
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="2" className={styles.tableLoading}>
                              No owners found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <VerifyToken isOwner={true} isVerified={false} />

              <div className={styles.detailCard}>
                <div className={styles.detailCardHeader}>
                  <h3 className={styles.detailCardTitle}>Transfers</h3>
                </div>
                <div className={styles.detailCardBody}>
                  <div className={styles.detailTableContainer}>
                    <table className={styles.detailTable}>
                      <thead>
                        <tr>
                          <th>From</th>
                          <th>To</th>
                          <th>Value</th>
                          <th>Tx Hash</th>
                        </tr>
                      </thead>
                      <tbody>
                        {transfers && transfers.length > 0 ? (
                          transfers.map((transfer, index) => (
                            <tr key={index}>
                              <td title={transfer.from_address}>
                                <span className={styles.tableAddress}>
                                  {transfer.from_address === ZERO_ADDRESS
                                    ? "Mint"
                                    : formatAddress(transfer.from_address)}
                                </span>
                              </td>
                              <td title={transfer.to_address}>
                                <span className={styles.tableAddress}>
                                  {transfer.to_address === ZERO_ADDRESS
                                    ? "Burn"
                                    : formatAddress(transfer.to_address)}
                                </span>
                              </td>
                              <td>
                                {parseFloat(transfer.value_decimal).toFixed(2)}
                              </td>
                              <td>
                                <a
                                  href={`https://monad.etherscan.io/tx/${transfer.transaction_hash}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className={styles.tableHash}
                                  title={transfer.transaction_hash}
                                >
                                  {formatAddress(transfer.transaction_hash)}
                                </a>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="4" className={styles.tableLoading}>
                              No transfers found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trade Modal */}
      <Modal
        isOpen={tradeModal.isOpen}
        onClose={() => setTradeModal({ isOpen: false })}
        title={tradeModal.isSell ? "Confirm Sell" : "Confirm Buy"}
        status={tradeModal.status}
        footer={
          <>
            <button
              className="modal-btn secondary"
              onClick={() => setTradeModal({ isOpen: false })}
              disabled={tradeModal.status?.type === "loading"}
            >
              {tradeModal.status?.type === "success" ? "Close" : "Cancel"}
            </button>
            {tradeModal.status?.type !== "success" && (
              <button
                className="modal-btn"
                onClick={executeTransaction}
                disabled={tradeModal.status?.type === "loading"}
              >
                {tradeModal.status?.type === "loading"
                  ? "Processing..."
                  : "Confirm"}
              </button>
            )}
          </>
        }
      >
        <p className="modal-message">
          {tradeModal.isSell
            ? `You are about to sell ${tradeModal.amount} ${tokenData.symbol} for ~${tradeModal.cost} MON.`
            : `You are about to buy ${tradeModal.amount} ${tokenData.symbol} for ~${tradeModal.cost} MON.`}
        </p>
      </Modal>

      {error && (
        <div className="error-toast">
          <i className="fas fa-exclamation-triangle"></i>
          <p>{error}</p>
        </div>
      )}
    </>
  );
}
