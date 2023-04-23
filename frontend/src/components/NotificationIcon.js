import React, { useState, useEffect } from 'react';
import NotificationService from '../services/NotificationService';
import WebSocketService from '../services/WebSocketService';

const NotificationIcon = () => {
  const [notifications, setNotifications] = useState([]);
  const [showList, setShowList] = useState(false);

  useEffect(() => {
    WebSocketService.connect("ws://localhost:8080/ws");
    WebSocketService.onMessage((message) => {
      if (
        message.type === "follownotification" ||
        message.type === "invitenotification" ||
        message.type === "joinreqnotification" ||
        message.type === "eventnotification"
      ) {
        console.log("Notification received", message);
        setNotifications((prevNotifications) => [...prevNotifications, message]);
      }
    });
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
