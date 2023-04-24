import React, { useState, useEffect } from 'react';
import NotificationService from '../services/NotificationService';

const NotificationIcon = () => {
  const [notifications, setNotifications] = useState([]);
  const [showList, setShowList] = useState(false);

  // Wrap the onUpdate with useEffect
  useEffect(() => {
    NotificationService.onUpdate(setNotifications);
  }, []);

  const handleClearNotification = (index) => {
    setNotifications((prevNotifications) =>
      prevNotifications.filter((_, i) => i !== index)
    );
  };

  const toggleShowList = () => {
    setShowList(!showList);
  };

  return (
    <div className="notification-icon">
      <div className="icon" onClick={toggleShowList}>
        <i className="fas fa-bell">🔔</i>
        {notifications.length !== 0 && (
          <span className="notification-count">{notifications.length}</span>
        )}
        {notifications.length === 0 && (
          <span className="notification-count">0</span>
        )}
      </div>
      {showList && (
        <ul className="notification-list">
          {notifications.map((notification, index) => (
            <li key={index}>
              <span>{notification.message}</span>
              <button
                className="clear-notification"
                onClick={() => handleClearNotification(index)}
              >
                Clear
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NotificationIcon;
