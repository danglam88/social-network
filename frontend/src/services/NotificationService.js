// services/NotificationService.js
import webSocketService from "./WebSocketService";

const NotificationService = {
  initialize: (url) => {
    webSocketService.connect(url);

  },

  onMessage: (callback) => {
    webSocketService.onMessage(callback);
  },

  sendMessage: (message) => {
    webSocketService.sendMessage(message);
  },
};

export default NotificationService;
