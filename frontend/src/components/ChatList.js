import React, { useState } from "react";
import axios from "axios";
import "../chatlist.css";

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

const ChatList = ({ availableChats, selectedChat, onSelectChat, onToggleChatList }) => {


  return (
    <div className="chat-list-container">
      <h2>Available Chats</h2>
      <ul>
        {availableChats.map((chat) => {
          const chatKey = "chat" + chat.ChatID;
          return (
            <li
              key={chatKey}
              onClick={() => {
                onSelectChat(chat);
                onToggleChatList();
              }}
              style={{
                cursor: "pointer",
                fontWeight:
                  selectedChat && selectedChat.ChatID === chat.ChatID
                    ? "bold"
                    : "normal",
              }}
            >
              {chat.DisplayName}
            </li>
          )})}
      </ul>
    </div>
  );
};

export default ChatList;
