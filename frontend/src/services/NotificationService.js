// services/NotificationService.js
import webSocketService from "./WebSocketService";
import axios from 'axios'

const notificationsUrl = 'http://localhost:8080/notification'

const clientToken = document.cookie
  .split("; ")
  .find((row) => row.startsWith("session_token="))
  ?.split("=")[1];

const config = {
  headers: {
    "Authorization": `Bearer ${clientToken}`,
    "Content-Type": "application/json",
  },
};

const postConfig = {
  mode: 'no-cors',
  headers : {
    "Authorization": `Bearer ${clientToken}`,
    'Content-Type': 'application/x-www-form-urlencoded'
  }
};

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

  getAll: async data => {
    const request = await axios.get(notificationsUrl, config)
    return request
  },

  reply : async data => {
    const request = await axios.post(notificationsUrl, data, postConfig)
    return request
  }
};

export default NotificationService;
