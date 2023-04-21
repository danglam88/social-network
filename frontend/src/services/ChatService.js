import WebSocketService from "./WebSocketService";



const ChatService = {
  onMessage: (callback) => {
    WebSocketService.onMessage((data) => {
        callback(data);
    });
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
    const response = await fetch(
      `http://localhost:8080/history?group_id=${groupId}&to=${to}&page=${page}`
    );
    const history = await response.json();
    return history;
  },
};

export default ChatService;