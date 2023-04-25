// services/NotificationService.js
import webSocketService from "./WebSocketService";

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
      }
    });
  },

  onMessage: (callback) => {
    webSocketService.onMessage(callback);
  },

  sendMessage: (message) => {
    webSocketService.sendMessage(message);
  },
};

export default NotificationService;
