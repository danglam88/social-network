// services/WebSocketService.js
let socket;

const clientToken = document.cookie
  .split("; ")
  .find((row) => row.startsWith("session_token="))
  ?.split("=")[1];

const WebSocketService = {
  connect: (url, callback) => {
    if (!socket || socket.readyState === WebSocket.CLOSED) {
      socket = new WebSocket(`${url}?Authorization=Bearer%20${clientToken}`);

      socket.addEventListener("open", () => {
        console.log("WebSocket connected to:", url);
        if (callback) {
          callback();
        }
      });
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
        console.log("Message received", event.data)
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