import React, { useState, useEffect } from "react";
import ChatService from "../services/ChatService";

const ChatWindow = ({ userId, chat }) => {
  const [chatMessages, setChatMessages] = useState([]);
  const [typedMessage, setTypedMessage] = useState("");

  useEffect(() => {
    ChatService.onMessage((messageData) => {
      setChatMessages((previousMessages) => [...previousMessages, messageData]);
    });

    return () => {
      ChatService.close();
    };
  }, []);

  const sendMessage = () => {
    if (typedMessage.trim() !== "") {
      ChatService.sendMessage(chat.ChatID, typedMessage);
      setTypedMessage("");
    }
  };

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
      <h2>Chat Window</h2>
      <textarea
        rows="10"
        cols="50"
        readOnly
        value={chatMessages
          .map((msg) => `${msg.created_at} - ${msg.username}: ${msg.message}`)
          .join("\n")}
      ></textarea>
      <div>
        <input
          type="text"
          value={typedMessage}
          onChange={(e) => setTypedMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") sendMessage();
          }}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatWindow;