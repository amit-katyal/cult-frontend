import styles from '@/styles/TokenDetail.module.css';

export default function Loading() {
  return (
    <div className={styles.loadingOverlay + ' ' + styles.active}>
      <div className={styles.loadingContent}>
        <div className={styles.loadingSpinner}>
          <i className="fas fa-spinner fa-spin"></i>
        </div>
        <p className={styles.loadingText}>Loading token data...</p>
      </div>
    </div>
  );
}