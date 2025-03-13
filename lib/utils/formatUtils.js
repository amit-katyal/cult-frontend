/**
 * Format address for display (0x1234...5678)
 */
export function formatAddress(address) {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  }
  
  /**
   * Format timestamp to relative time (e.g. "2 hours ago")
   */
  export function formatRelativeTime(timestamp) {
    const now = new Date();
    const date = new Date(timestamp);
    const seconds = Math.floor((now - date) / 1000);
    
    if (seconds < 60) {
      return `${seconds}s ago`;
    }
    
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) {
      return `${minutes}m ago`;
    }
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) {
      return `${hours}h ago`;
    }
    
    const days = Math.floor(hours / 24);
    if (days < 30) {
      return `${days}d ago`;
    }
    
    const months = Math.floor(days / 30);
    if (months < 12) {
      return `${months}mo ago`;
    }
    
    const years = Math.floor(months / 12);
    return `${years}y ago`;
  }
  
  /**
   * Format number with commas (e.g. 1,234,567)
   */
  export function formatNumber(number) {
    if (!number && number !== 0) return '—';
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  
  /**
   * Format currency with symbol and decimal places (e.g. "MON 1.23")
   */
  export function formatCurrency(amount, symbol = 'MON', decimals = 6) {
    if (!amount && amount !== 0) return `0 ${symbol}`;
    
    // Parse to float and handle potential string input
    const value = typeof amount === 'string' ? parseFloat(amount) : amount;
    
    // Format with decimal places
    const formatted = value.toFixed(decimals);
    
    // Remove trailing zeros
    const trimmed = formatted.replace(/\.?0+$/, '');
    
    return `${trimmed} ${symbol}`;
  }
  
  /**
   * Copy text to clipboard with fallback
   */
  export async function copyToClipboard(text) {
    if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch (e) {
        console.error('Failed to copy using navigator.clipboard:', e);
      }
    }
    
    // Fallback method
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      return true;
    } catch (e) {
      console.error('Failed to copy using fallback:', e);
      return false;
    }
  }