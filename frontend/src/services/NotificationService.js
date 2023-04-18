// services/NotificationService.js
import webSocketService from "./WebSocketService";

let notifications = [];
let updateCallback;

const NotificationService = {
  onMessage: (callback) => {
    webSocketService.onMessage((message) => {
      if (
        message.type === "follownotification" ||
        message.type === "invitenotification" ||
        message.type === "joinreqnotification" ||
        message.type === "eventnotification"
      ) {
        notifications.push(message);
        if (updateCallback) {
          updateCallback(notifications);
        }
      }
      callback(message);
    });
  },

  sendMessage: (message) => {
    webSocketService.sendMessage(message);
  },

  onUpdate: (callback) => {
    updateCallback = callback;
    callback(notifications);
  },

  clearNotification: (index) => {
    notifications = notifications.filter((_, i) => i !== index);
    if (updateCallback) {
      updateCallback(notifications);
    }
  },
};

export default NotificationService;