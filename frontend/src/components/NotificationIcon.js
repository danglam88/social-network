import React, { useState, useEffect } from 'react';
import NotificationService from '../services/NotificationService';
import eventsService from '../services/EventsService';

const NotificationIcon = ({ handleShowPersonalProfile }) => {
  const [notifications, setNotifications] = useState([]);
  const [showList, setShowList] = useState(false);

  useEffect(() => {
    const messageListener = (message) => {
      if (
        message.type === "follownotification" ||
        message.type === "invitenotification" ||
        message.type === "joinreqnotification" ||
        message.type === "eventnotification"
      ) {
        setNotifications((prevNotifications) => {
          if (!prevNotifications.some((n) => n.message === message.message)) {
            return [...prevNotifications, message].reverse();
          } else {
            return prevNotifications;
          }
        });
      }
    };

    NotificationService.onMessage(messageListener);
  }, []);

  const handleInvitationResponse = async (groupId, index, isAccepted) => {
    try {
      const data = {
        type: "invitenotification",
        group_id: groupId,
        is_accepted: isAccepted,
      };
  
      const response = await NotificationService.reply(data);
  
      if (response.status === 200) {
        try {
          const eventResponse = await eventsService.event(data);
  
          if (eventResponse.status === 200) {
            handleClearNotification(index);
          }
        } catch (eventError) {
          console.log(eventError);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

      
  const handleClearNotification = (index) => {
    setNotifications((prevNotifications) =>
      prevNotifications.filter((_, i) => i !== index)
    );
  };

  const toggleShowList = () => {
    setShowList(!showList);
  };

  return (
    <>
    <div className="notification-icon">
      <div className="icon" onClick={toggleShowList}>
        <i className="fas fa-bell">🔔</i>
          <span className="notification-count">{notifications.length}</span>
      </div>
      {showList && (
        <ul className="notification-list">
{notifications.map((notification, index) => {
  const notificationKey = "notification" + index;
  return (
    <li key={notificationKey}>
      <span>{notification.message}</span>
      {notification.type === "invitenotification" && (
        <>
          <button
            className="accept-invitation"
            onClick={() => handleInvitationResponse(notification.group_id, index, true)}
          >
            Accept
          </button>
          <button
            className="reject-invitation"
            onClick={() => handleInvitationResponse(notification.group_id, index, false)}
          >
            Reject
          </button>
        </>
      )}
            
              </li>
            )})}
        </ul>
      )}
    </div>
    {showList && (
      <ul className="notification-list">
        {notifications.map((notification, index) => {
          const notificationKey = "notification" + index;
          return (
            <li key={notificationKey}>
              <span>{notification.message}</span>
              <button
                className="clear-notification"
                onClick={() => handleClearNotification(index)}
              >
                Clear
              </button>
              <button
                className="go-to-profile"
                onClick={handleShowPersonalProfile}
              >
                Go to Profile
              </button>
          
            </li>
          )})}
      </ul>
    )}
    </>
  );
};

export default NotificationIcon;
