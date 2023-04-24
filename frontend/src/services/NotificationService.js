// services/NotificationService.js
import webSocketService from "./WebSocketService";

let notifications = [];
let updateCallback;

const NotificationService = {
  initialize: (url) => {
    webSocketService.connect(url);
    webSocketService.onMessage((message) => {
      if (
        message.type === "follownotification" ||
        message.type === "invitenotification" ||
        message.type === "joinreqnotification" ||
        message.type === "eventnotification"
      ) {
        console.log("Notification received", message);
        if (!notifications.some((n) => n.message === message.message)) {
          notifications.push(message);
          if (updateCallback) {
            updateCallback(notifications);
          }
        }
      }
    });
  },

  onMessage: (callback) => {
    webSocketService.onMessage(callback);
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
