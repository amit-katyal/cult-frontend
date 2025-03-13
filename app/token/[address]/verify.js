import { useState } from "react";
import styles from "@/styles/TokenDetail.module.css";

export default function VerifyToken({ isOwner = false, isVerified = false }) {
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [connectedAccounts, setConnectedAccounts] = useState({
    twitter: false,
    telegram: false,
    youtube: false,
    tiktok: false,
    instagram: false,
    facebook: false
  });

  const handleConnectSocial = (platform) => {
    // This would normally connect to the platform API
    // For demo purposes, just toggle the state
    setConnectedAccounts({
      ...connectedAccounts,
      [platform]: !connectedAccounts[platform]
    });
  };

  const verificationBenefits = [
    {
      icon: "fa-shield-alt",
      title: "Enhanced Trust",
      description: "Verified tokens display a blue checkmark, signaling legitimacy to potential investors."
    },
    {
      icon: "fa-chart-line",
      title: "Higher Visibility",
      description: "Verified tokens are prioritized in search results and recommended token lists."
    },
    {
      icon: "fa-users",
      title: "Community Growth",
      description: "Connect your social media to instantly engage with your token community."
    },
    {
      icon: "fa-rocket",
      title: "Marketing Advantage",
      description: "Gain access to platform-wide promotional opportunities exclusive to verified projects."
    }
  ];

  const socialPlatforms = [
    { name: "twitter", icon: "fa-twitter", label: "Twitter", color: "#1DA1F2" },
    { name: "telegram", icon: "fa-telegram-plane", label: "Telegram", color: "#0088cc" },
    { name: "youtube", icon: "fa-youtube", label: "YouTube", color: "#FF0000" },
    { name: "tiktok", icon: "fa-tiktok", label: "TikTok", color: "#000000" },
    { name: "instagram", icon: "fa-instagram", label: "Instagram", color: "#E1306C" },
    { name: "facebook", icon: "fa-facebook-f", label: "Facebook", color: "#4267B2" }
  ];

  return (
    <div className={styles.detailCard}>
      <div className={styles.detailCardHeader}>
        <h3 className={styles.detailCardTitle}>
          {isVerified ? "Verified Token" : "Verify your Token"}
          {isVerified && <i className="fas fa-check-circle" style={{ color: "#2196f3", marginLeft: "10px" }}></i>}
        </h3>
      </div>
      <div className={styles.detailCardBody}>
        {isVerified ? (
          <div className={styles.verifiedStatusContainer}>
            <div className={styles.verifiedBadge}>
              <i className="fas fa-check-circle"></i>
              <span>This token has been verified</span>
            </div>
            <div className={styles.connectedSocialsList}>
              <h4>Connected Platforms</h4>
              <div className={styles.socialIcons}>
                {socialPlatforms.map(platform => (
                  <div 
                    key={platform.name}
                    className={`${styles.socialIcon} ${connectedAccounts[platform.name] ? styles.connected : styles.disconnected}`}
                    title={`${platform.label} ${connectedAccounts[platform.name] ? "(Connected)" : "(Not Connected)"}`}
                    style={{ backgroundColor: connectedAccounts[platform.name] ? platform.color : "rgba(255,255,255,0.1)" }}
                  >
                    <i className={`fab ${platform.icon}`}></i>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <>
            <p className={styles.verifyDescription}>
              Verify your token to increase visibility and build trust with investors. Connect your social accounts to appear in the verified tokens list.
            </p>
            
            <div className={styles.verifyBenefitsGrid}>
              {verificationBenefits.map((benefit, index) => (
                <div className={styles.benefitCard} key={index}>
                  <div className={styles.benefitIcon}>
                    <i className={`fas ${benefit.icon}`}></i>
                  </div>
                  <div className={styles.benefitContent}>
                    <h4>{benefit.title}</h4>
                    <p>{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
            
            {isOwner ? (
              <>
                <div className={styles.socialConnectSection}>
                  <h4>Connect Your Social Accounts</h4>
                  <p>Connect at least 2 social accounts to get your token verified</p>
                  
                  <div className={styles.socialButtonsGrid}>
                    {socialPlatforms.map(platform => (
                      <button 
                        key={platform.name}
                        className={`${styles.socialConnectButton} ${connectedAccounts[platform.name] ? styles.connected : ""}`}
                        onClick={() => handleConnectSocial(platform.name)}
                        style={connectedAccounts[platform.name] ? {backgroundColor: platform.color} : {}}
                      >
                        <i className={`fab ${platform.icon}`}></i>
                        <span>
                          {connectedAccounts[platform.name] 
                            ? `${platform.label} Connected` 
                            : `Connect ${platform.label}`}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
                
                <button 
                  className={styles.verifySubmitButton}
                  disabled={Object.values(connectedAccounts).filter(Boolean).length < 2}
                  onClick={() => setShowVerifyModal(true)}
                >
                  Submit for Verification
                </button>
                
                {Object.values(connectedAccounts).filter(Boolean).length < 2 && (
                  <p className={styles.verifyNote}>
                    <i className="fas fa-info-circle"></i> Connect at least 2 social accounts to enable verification
                  </p>
                )}
              </>
            ) : (
              <div className={styles.ownerOnlyMessage}>
                <i className="fas fa-lock"></i>
                <p>Only the token creator can verify this token</p>
              </div>
            )}
          </>
        )}
      </div>
      
      {/* Verification Modal */}
      {showVerifyModal && (
        <div className="modal-overlay active">
          <div className="modal">
            <div className="modal-header">
              <h3 className="modal-title">Submit for Verification</h3>
              <button className="modal-close" onClick={() => setShowVerifyModal(false)}>
                &times;
              </button>
            </div>
            <div className="modal-body">
              <p className="modal-message">
                Your token verification request will be reviewed by our team within 24-48 hours. 
                You've connected {Object.values(connectedAccounts).filter(Boolean).length} social accounts.
              </p>
              <div className="modal-status">
                <div className={styles.connectedAccountsList}>
                  {socialPlatforms.map(platform => (
                    connectedAccounts[platform.name] && (
                      <div key={platform.name} className={styles.connectedAccount}>
                        <i className={`fab ${platform.icon}`} style={{color: platform.color}}></i>
                        <span>{platform.label}</span>
                      </div>
                    )
                  ))}
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button 
                className="modal-btn secondary" 
                onClick={() => setShowVerifyModal(false)}
              >
                Cancel
              </button>
              <button className="modal-btn">
                Submit for Review
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}