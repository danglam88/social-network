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

const ChatList = ({ selectedChat, onSelectChat, onToggleChatList }) => {
  const [availableChats, setAvailableChats] = useState([]);
  const [chatListVisible, setChatListVisible] = useState(false);

  const toggleChatList = () => {
    setChatListVisible(!chatListVisible);
  };

  React.useEffect(() => {
    axios
      .get("http://localhost:8080/allchats", config)
      .then((response) => setAvailableChats(response.data))
      .catch((error) => console.error("Error fetching chats:", error));
  }, []);

  return (
    <div className="chat-list-container">
      <div className="chat-bubble" onClick={toggleChatList}>
        💬
      </div>
      {chatListVisible && (
        <div className="chat-list">
          <h2>Available Chats</h2>
          <ul>
            {availableChats.map((chat) => (
              <li
                key={chat.ChatID}
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
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ChatList;
