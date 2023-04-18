import React, { useState, useEffect } from 'react';
import NotificationService from '../services/NotificationService';

const NotificationIcon = () => {
  const [notifications, setNotifications] = useState([]);
  const [showList, setShowList] = useState(false);

  useEffect(() => {
    const handleUpdate = (newNotifications) => {
      setNotifications(newNotifications);
    };

    NotificationService.onUpdate(handleUpdate);
    return () => {
      // Clean up any resources when the component is unmounted
    };
  }, []);

  const handleClearNotification = (index) => {
    NotificationService.clearNotification(index);
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