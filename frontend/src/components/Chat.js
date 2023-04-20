import React, { useState, useEffect } from "react";
import ChatService from "../services/ChatService";

const Chat = (props) => {
  console.log("User ID: " + props.userId);

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
        // Set the receiver ID based on the GroupID
        ChatService.sendMessage(receiverID.ID, inputMessage);
      setInputMessage("");
    }
  };
  
  

  const handleReceiverIDChange = (e) => {
    setReceiverID(JSON.parse(e.target.value));
  };

  return (
    <div>
      <div>

<select
  value={receiverID ? JSON.stringify(receiverID) : ""}
  onChange={handleReceiverIDChange}
>
  <option value="" disabled selected>
    Select a chat
  </option>
  {availableChats
    .sort((a, b) => new Date(b.LastMsg) - new Date(a.LastMsg))
    .map((chat) => (
      <option
        key={chat.ID}
        value={JSON.stringify(
          chat.GroupID === 0 ? { ID: chat.ChatID, GroupID: 0 } : { ID: chat.ChatID, GroupID: chat.GroupID }
        )}
        selected={JSON.stringify(receiverID) === JSON.stringify(chat.GroupID === 0 ? { ID: chat.ChatID, GroupID: 0 } : { ID: chat.ChatID, GroupID: chat.GroupID })}
      >
        {chat.GroupID === 0
          ? `ChatID: ${chat.ChatID} - Direct Message between ${chat.UserOne} and ${chat.UserTwo}`
          : `ChatID: ${chat.ChatID} - Group Chat with Group ID ${chat.GroupID}`}
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
