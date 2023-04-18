import React, { useState, useEffect, useRef } from "react";
import ChatService from "../services/ChatService";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [receiverID, setReceiverID] = useState(null);
  const [inputMessage, setInputMessage] = useState("");
  const [availableChats, setAvailableChats] = useState([]);

  useEffect(() => {
    ChatService.onMessage((data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    return () => {
      ChatService.close();
    };
  }, []);

  useEffect(() => {
    fetch("http://localhost:8080/allchats")
      .then((response) => response.json())
      .then((data) => setAvailableChats(data))
      .catch((error) => console.error("Error fetching chats:", error));
  }, []);

  const sendMessage = () => {
    if (inputMessage.trim() !== "") {
      const selectedChat = receiverID;
  
      // Check if the selectedChat object exists before accessing its properties
      if (selectedChat) {
        const msgtype =
          selectedChat.GroupID === 0 ? "privatemessage" : "groupmessage";
  
        // Set the receiver ID based on the GroupID
        const updatedReceiverID =
          selectedChat.GroupID === 0 ? selectedChat.ID : selectedChat.GroupID;
  
        ChatService.sendMessage(updatedReceiverID, msgtype, inputMessage);
      } else {
        console.error("Error: No chat with the provided receiver ID found.");
      }
  
      setInputMessage("");
    }
  };
  
  

  const handleReceiverIDChange = (e) => {
    setReceiverID(JSON.parse(e.target.value));
  };

  return (
    <div>
      <div>
        <label htmlFor="receiverid">Receiver ID: </label>
        <input
          id="receiverid"
          type="text"
          value={receiverID}
          onChange={handleReceiverIDChange}
        />

<select
  value={receiverID ? JSON.stringify(receiverID) : ""}
  onChange={handleReceiverIDChange}
>
  <option value="" disabled>
    Select a chat
  </option>
  {availableChats
    .sort((a, b) => new Date(b.LastMsg) - new Date(a.LastMsg))
    .map((chat) => (
      <option
        key={chat.ID}
        value={JSON.stringify(
          chat.GroupID === 0 ? { ID: chat.ID, GroupID: 0 } : { ID: chat.ID, GroupID: chat.GroupID }
        )}
      >
        {chat.GroupID === 0
          ? `ID: ${chat.ID} - Direct Message`
          : `GroupID: ${chat.GroupID}`}
      </option>
    ))}
</select>
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
