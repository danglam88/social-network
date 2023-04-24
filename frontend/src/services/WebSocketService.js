// services/WebSocketService.js
let socket;

let messageListenerRegistered = false;


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
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.addEventListener("message", (event) => {
        console.log("Message received", event.data);
        const message = JSON.parse(event.data);
        callback(message);
      });
    } else {
      setTimeout(() => WebSocketService.onMessage(callback), 100);
    }
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