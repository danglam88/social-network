// services/WebSocketService.js
let socket;

let messageListenerRegistered = false;

const clientToken = document.cookie
  .split("; ")
  .find((row) => row.startsWith("session_token="))
  ?.split("=")[1];

const messageCallbacks = new Set();

const WebSocketService = {
  connect: (url, callback) => {
    if (!socket || socket.readyState === WebSocket.CLOSED) {
      socket = new WebSocket(`${url}?Authorization=Bearer%20${clientToken}`);

      socket.addEventListener("open", () => {
        console.log("WebSocket connected to:", url);
        if (callback) {
          callback();
        }
        if (!messageListenerRegistered) {
          socket.addEventListener("message", (event) => {
            const message = JSON.parse(event.data);
            messageCallbacks.forEach((cb) => cb(message));
          });
          messageListenerRegistered = true;
        }
      });
      socket.addEventListener("close", (event) => {
        console.log("WebSocket closed:", event);
      });
    }
  },

  disconnect: () => {
    if (socket) {
      socket.close();
    }
  },

  onMessage: (callback) => {
    messageCallbacks.add(callback);
  },

  removeMessageListener: (callback) => {
    messageCallbacks.delete(callback);
  },

  sendMessage: (message) => {
    if (socket) {
      setTimeout(() => {
        if (socket.readyState === WebSocket.OPEN) {
          socket.send(JSON.stringify(message));
        } else {
          console.error("Unable to send message: WebSocket is not open");
        }
      }, 100);
    }
  },
};

export default WebSocketService;
