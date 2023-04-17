const GROUPMESSAGE_TYPE = "groupmessage";

class ChatService {
  constructor() {
    this.client = new WebSocket("ws://localhost:8080/ws");
  }

  onMessage(callback) {
    this.client.onmessage = (message) => {
      const data = JSON.parse(message.data);
      if (data.type === GROUPMESSAGE_TYPE) {
        callback(data);
      }
    };
  }

  sendMessage(recieverId, message) {
    const payload = {
      type: GROUPMESSAGE_TYPE,
      // to is a int
      to: parseInt(recieverId),
      message: message,
    };
    this.client.send(JSON.stringify(payload));
  }

  close() {
    if (this.client) {
      this.client.close();
    }
  }
}

export default ChatService;
