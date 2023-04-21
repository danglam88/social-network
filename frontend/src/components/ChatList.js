import React, { useState, useEffect } from "react";
import ChatService from "../services/ChatService";

const ChatList = ({ selectedChat, onSelectChat }) => {
  const [availableChats, setAvailableChats] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/allchats")
      .then((response) => response.json())
      .then((data) => setAvailableChats(data))
      .catch((error) => console.error("Error fetching chats:", error));
  }, []);

  const handleClick = async (chat) => {
    const history = await ChatService.fetchChatHistory(chat.GroupID, chat.ChatID);
    onSelectChat({ ...chat, history });
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