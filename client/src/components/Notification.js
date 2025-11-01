import React, { useEffect } from 'react';
import './Notification.css';

/**
 * Notification Component
 * Displays temporary success/error messages
 */
const Notification = ({ message, type = 'info', onClose, duration = 3000 }) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        if (onClose) {
          onClose();
        }
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  if (!message) return null;

  return (
    <div className={`notification notification-${type}`} role="alert">
      <div className="notification-content">
        <span className="notification-message">{message}</span>
        <button
          className="notification-close"
          onClick={onClose}
          aria-label="Close notification"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default Notification;

