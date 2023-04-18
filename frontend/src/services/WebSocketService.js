// services/WebSocketService.js
let socket;

const WebSocketService = {
  connect: (url) => {
    if (!socket || socket.readyState === WebSocket.CLOSED) {
        socket = new WebSocket(url);
    }
  },

  disconnect: () => {
    if (socket) {
      socket.close();
    }
  },

  onMessage: (callback) => {
    if (socket) {
      socket.addEventListener("message", (event) => {
        const message = JSON.parse(event.data);
        callback(message);
      });
    }
  },

  sendMessage: (message) => {
    if (socket) {
      socket.send(JSON.stringify(message));
    }
  },
};

export default WebSocketService;