import React, { useState, useEffect } from 'react';
import NotificationService from '../services/NotificationService';
import eventsService from '../services/EventsService';
import followsService from '../services/FollowsService';

const NotificationIcon = ({ handleShowPersonalProfile, handleShowPendings}) => {
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
          // if prevNotifications already contains the message, don't add it again
          if (prevNotifications.find((item) => item === message)) {
            return prevNotifications;
          }
          return [...prevNotifications, message];
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

  const handleGroupJoinRequestResponse = async (groupId, index, userId, isAccepted) => {
    try {
      const data = {
        type: "joinreqnotification",
        group_id: groupId,
        user_id: userId,
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

  const handleFollowResponse = async (from, to, index, isAccepted) => {
    try {
     const followResponse = await followsService.pending({user_id: from, follow_id: to, accept: isAccepted});

      if (followResponse.status === 200) {
        try {
          handleShowPendings(from);
          handleClearNotification(index);
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
      
      {notification.type === "invitenotification" && (
        <>
        <span><img src={`http://localhost:8080${notification.avatar_url}`} className='avatar-symbol'/> You are invited to join group <b>{notification.message}</b></span>
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
      {notification.type === "joinreqnotification" && (
        <>
        <span><img src={`http://localhost:8080${notification.avatar_url}`} className='avatar-symbol'/> <b>{notification.username}</b> wants to join your group <b>{notification.message}</b></span>
          <button
            className="accept-invitation"
            onClick={() => handleGroupJoinRequestResponse(notification.group_id, index, notification.from, true)}
          >
            Accept
          </button>
          <button
            className="reject-invitation"
            onClick={() => handleGroupJoinRequestResponse(notification.group_id, index, notification.from, false)}
          >
            Reject
          </button>
        </>
      )}
      {notification.type === "follownotification" && (
        <>
        <span><img src={`http://localhost:8080${notification.avatar_url}`} className='avatar-symbol'/> <b>{notification.username}</b> requested to follow you</span>
          <button
            className="accept-invitation"
            onClick={() => handleFollowResponse(notification.to, notification.from, index, true)}
          >
            Accept
          </button>
          <button
            className="reject-invitation"
            onClick={() => handleFollowResponse(notification.to, notification.from, index, false)}
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
    </>
  );
};

export default NotificationIcon;
