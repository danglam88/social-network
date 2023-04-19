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
};

export default ChatService;