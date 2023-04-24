import axios from 'axios';
import React, { useState, useEffect } from "react";
import ChatService from "../services/ChatService";

const clientToken = document.cookie
  .split("; ")
  .find((row) => row.startsWith("session_token="))
  ?.split("=")[1];

const config = {
  headers: {
    "Authorization": `Bearer ${clientToken}`,
    "Content-Type": "application/json",
  },
};

const ChatList = ({ selectedChat, onSelectChat }) => {
  const [availableChats, setAvailableChats] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8080/allchats", config)
      .then((response) => setAvailableChats(response.data))
      .catch((error) => console.error("Error fetching chats:", error));
  }, []);

  const handleClick = async (chat) => {
    ChatService.fetchChatHistory(chat.GroupID, chat.ChatID)
      .then(response => onSelectChat({ ...chat, history: response.data }))
      .catch(error => console.error("Error fetching chat history:", error));
  };

  return (
    <div
      style={{
        width: "30%",
        borderRight: "1px solid #ccc",
        overflowY: "scroll",
      }}
    >
      <h2>Available Chats</h2>
      <ul>
        {availableChats.map((chat) => (
          <li
            key={chat.ID}
            onClick={() => handleClick(chat)}
            style={{
              cursor: "pointer",
              fontWeight: selectedChat && selectedChat.ID === chat.ID ? "bold" : "normal",
            }}
          >
            {chat.DisplayName}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChatList;