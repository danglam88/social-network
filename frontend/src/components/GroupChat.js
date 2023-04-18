import React, { useState, useEffect, useRef } from "react";
import ChatService from "../services/ChatService";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [group, setGroup] = useState("");
  const [inputMessage, setInputMessage] = useState("");

  useEffect(() => {
    ChatService.onMessage((data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    return () => {
      ChatService.close();
    };
  }, []);

  const sendMessage = () => {
    if (inputMessage.trim() !== "") {
      ChatService.sendMessage(group, inputMessage);
      setInputMessage("");
    }
  };

  return (
    <div>
      <div>
        <label htmlFor="group">Group: </label>
        <input
          id="group"
          type="text"
          value={group}
          onChange={(e) => setGroup(e.target.value)}
        />
      </div>
      <div>
        <textarea
          rows="10"
          cols="50"
          readOnly
          value={messages
            .map((msg) => `${msg.created_at} - ${msg.username}: ${msg.message}`)
            .join("\n")}
        ></textarea>
      </div>
      <div>
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") sendMessage();
          }}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chat;