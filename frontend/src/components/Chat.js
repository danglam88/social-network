import React, { useState } from "react";
import ChatList from "./ChatList";
import ChatWindow from "./ChatWindow";
import "../chat.css";
import ChatService from "../services/ChatService"

const Chat = ({ userId }) => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [chatListVisible, setChatListVisible] = useState(false);
  const [availableChats, setAvailableChats] = useState([]);

  const toggleChatList = () => {
    if (!chatListVisible) {
      try {
      ChatService.fetchChats().then((response) => {
        setAvailableChats(response.data);
      });
      } catch (error) {
        console.log(error);
      }
    }
    setChatListVisible(!chatListVisible);

  };
  const closeChatWindow = () => {
    setSelectedChat(null);
  };

  const getOtherUserId = (chat) => {
    return chat.UserOne === userId ? chat.UserTwo : chat.UserOne;
  };

  return (
    <div className="chat-container">
      <div className="chat-bubble" onClick={toggleChatList}>
        💬
      </div>
      <div className="chat-list" style={{ display: chatListVisible ? "block" : "none" }}>
        <ChatList
          availableChats={availableChats}
          selectedChat={selectedChat}
          onSelectChat={setSelectedChat}
          onToggleChatList={toggleChatList}
        />
      </div>
      {selectedChat && (
        <div
          className="chat-window-modal"
          onClick={closeChatWindow}
          onKeyDown={(e) => {
            if (e.key === "esc") {
              closeChatWindow();
            }
          }}
          tabIndex="0"
        >
          <ChatWindow chat={selectedChat} chatId={getOtherUserId(selectedChat)} onClose={closeChatWindow} />
        </div>
      )}
    </div>
  );
};

export default Chat;
