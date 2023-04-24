import axios from 'axios';
import WebSocketService from "./WebSocketService";

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

const callbacks = new Set();

const ChatService = {
  onMessage: (callback) => {
    callbacks.add(callback);
  },

  removeMessageListener: (callback) => {
    callbacks.delete(callback);
  },

  sendMessage: (receiverId, message) => {
    const payload = {
      type: "message",
      to: parseInt(receiverId),
      message: message,
    };
    WebSocketService.sendMessage(payload);
  },

  close: () => {
    WebSocketService.disconnect();
  },

  fetchChatHistory: async (groupId, to, page = 1) => {
    const request = await axios.get(`http://localhost:8080/history?group_id=${groupId}&to=${to}&page=${page}`, config);
    return request;
  },
};

WebSocketService.onMessage((data) => {
  callbacks.forEach((cb) => cb(data));
});

export default ChatService;