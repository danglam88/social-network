import React, { useState, useEffect, useRef } from "react";

const GROUPMESSAGE_TYPE = "groupmessage";

let data = {
  token: "",
  userid: "",
  username: "",
};

if (document.cookie.includes("session_token")) {
  const tokens = document.cookie.split(";");
  for (let i = 0; i < tokens.length; i++) {
    if (tokens[i].includes("session_token")) {
      data.token = tokens[i].split("=")[1];
      data.userid = sessionStorage.getItem("userid");
      data.username = sessionStorage.getItem("username");
    }
  }
}

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const userId = data.userid;
  const [group, setGroup] = useState("");
  const [inputMessage, setInputMessage] = useState("");
  const chatServiceRef = useRef(null);

  useEffect(() => {
    if (!chatServiceRef.current) {
      chatServiceRef.current = new ChatService();
      chatServiceRef.current.onMessage((data) => {
        setMessages((prevMessages) => [...prevMessages, data]);
      });
    }
    return () => {
      if (chatServiceRef.current) {
        chatServiceRef.current.close();
        chatServiceRef.current = null;
      }
    };
  }, []);

  const sendMessage = () => {
    if (inputMessage.trim() !== "") {
      const message = {
        type: GROUPMESSAGE_TYPE,
        from: userId,
        to: group,
        message: inputMessage,
      };
      clientRef.current.send(JSON.stringify(message));
      setInputMessage("");
    }
  };

  return (
    <div>
      <div>
        <label htmlFor="group">Group: </label>
        <input
          id="group"
          type="text"
          value={group}
          onChange={(e) => setGroup(e.target.value)}
        />
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
