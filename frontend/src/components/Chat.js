import React, { useState } from "react";
import ChatList from "./ChatList";
import ChatWindow from "./ChatWindow";

const Chat = () => {
  const [selectedChat, setSelectedChat] = useState(null);

  return (
    <div style={{ display: "flex", height: "100%" }}>
      <ChatList
        selectedChat={selectedChat}
        onSelectChat={setSelectedChat}
      />
      {selectedChat && <ChatWindow chat={selectedChat} />}
    </div>
  );
};

export default Chat;