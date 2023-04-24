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

const ChatItem = ({ chat, selectedChat, onSelectChat }) => {

  const handleClick = async (chat) => {
    ChatService.fetchChatHistory(chat.GroupID, chat.ChatID)
      .then(response => onSelectChat({ ...chat, history: response.data }))
      .catch(error => console.error("Error fetching chat history:", error));
  };

  return (
    <li
      onClick={() => handleClick(chat)}
      style={{
        cursor: "pointer",
        fontWeight: selectedChat && selectedChat.ChatID === chat.ChatID ? "bold" : "normal",
      }}
    >
      {chat.DisplayName}
    </li>
  )
};

const ChatList = ({ selectedChat, onSelectChat }) => {
  const [availableChats, setAvailableChats] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8080/allchats", config)
      .then((response) => setAvailableChats(response.data))
      .catch((error) => console.error("Error fetching chats:", error));
  }, []);

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
          <ChatItem chat={chat} key={chat.ChatID} selectedChat={selectedChat} onSelectChat={onSelectChat}/>
        ))}
      </ul>
    </div>
  );
};

export default ChatList;