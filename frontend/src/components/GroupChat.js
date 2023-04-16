import React, { useState, useEffect, useRef } from "react";
// use some websocket library? socket.io?

const Chat = () => {
  const [username, setUsername] = useState("");
  const [group, setGroup] = useState("");
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const socketRef = useRef(null);

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handleGroupChange = (event) => {
    setGroup(event.target.value);
  };

  const handleInputValueChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!inputValue.trim()) return;

    const message = {
      type: "groupmessage",
      from: username,
      to: group,
      message: inputValue,
    };
    socketRef.current.send(JSON.stringify(message));
    setInputValue("");
  };

  useEffect(() => {
    if (!username || !group) return;

    const socket = new WebSocket("ws://localhost:8080/ws");
    socketRef.current = socket;

    socket.addEventListener("message", (event) => {
      const message = JSON.parse(event.data);
      setMessages((messages) => [...messages, message]);
    });

    socket.addEventListener("close", () => {
      console.log("disconnected");
    });

    return () => {
      console.log("cleanup");
      socket.close();
    };
  }, [username, group]);

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={username}
          onChange={handleUsernameChange}
          label="Username"
        />
        <input type="text" value={group} onChange={handleGroupChange} />
        <input
          type="text"
          value={inputValue}
          onChange={handleInputValueChange}
        />
        <button type="submit">Send</button>
      </form>
      <ul>
        {messages.map((message, index) => (
          <li key={index}>
            {message.userName}: {message.message}
          </li>
        ))}
      </ul>
    </>
  );
};

export default Chat;
