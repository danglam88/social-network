import WebSocketService from "./WebSocketService";

const GROUPMESSAGE_TYPE = "groupmessage";

const ChatService = {
  onMessage: (callback) => {
    WebSocketService.onMessage((data) => {
      if (data.type === GROUPMESSAGE_TYPE) {
        callback(data);
      }
    });
  },

  sendMessage: (receiverId, message) => {
    const payload = {
      type: GROUPMESSAGE_TYPE,
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