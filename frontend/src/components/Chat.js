import React, { useState } from "react";
import ChatList from "./ChatList";
import ChatWindow from "./ChatWindow";
import "../chat.css";

const Chat = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [chatListVisible, setChatListVisible] = useState(false);

  const toggleChatList = () => {
    setChatListVisible(!chatListVisible);
  };

  return (
    <div className="chat-container">
      <div className="chat-bubble" onClick={toggleChatList}>
        💬
      </div>
      {chatListVisible && (
        <div className="chat-list">
        <ChatList
          selectedChat={selectedChat}
          onSelectChat={setSelectedChat}
          onToggleChatList={toggleChatList}
        />
        </div>
      )}
      {selectedChat && (
        <div className="chat-window-modal">
          <ChatWindow chat={selectedChat} />
        </div>
      )}
    </div>
  );
};

export default Chat;
