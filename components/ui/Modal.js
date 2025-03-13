'use client';

import { useEffect } from 'react';

export default function Modal({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  footer,
  status = null // { type: 'loading' | 'success' | 'error', message: string }
}) {
  // Close on ESC key
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    
    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
    }
    
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Render status icon and message if provided
  const renderStatus = () => {
    if (!status) return null;
    
    let iconClass = '';
    switch (status.type) {
      case 'loading':
        iconClass = 'fa-spinner status-icon loading';
        break;
      case 'success':
        iconClass = 'fa-check-circle status-icon success';
        break;
      case 'error':
        iconClass = 'fa-times-circle status-icon error';
        break;
      default:
        iconClass = 'fa-info-circle';
    }
    
    return (
      <div className="modal-status">
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
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>
        <div className="modal-body">
          {children}
          {status && renderStatus()}
        </div>
        {footer && (
          <div className="modal-footer">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}