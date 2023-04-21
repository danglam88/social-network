import React, { useState, useEffect, useRef, useCallback } from "react";
import ChatService from "../services/ChatService";

const ChatWindow = ({ userId, chat }) => {
  const [chatMessages, setChatMessages] = useState(chat.history);
  const [typedMessage, setTypedMessage] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const topRef = useRef(null);

  useEffect(() => {
    ChatService.onMessage((messageData) => {
      setChatMessages((previousMessages) => [...previousMessages, messageData]);
    });

    return () => {
      ChatService.close();
    };
  }, []);

  const sendMessage = () => {
    if (typedMessage.trim() !== "") {
      ChatService.sendMessage(chat.ChatID, typedMessage);
      setTypedMessage("");
    }
  };


  const loadMoreMessages = useCallback(async () => {
    if (loading) return;
    setLoading(true);
    setPage((prevPage) => prevPage + 1);
    const newHistory = await ChatService.fetchChatHistory(chat.GroupID, chat.ChatID, page + 1);
    if (newHistory.length > 0) {
      setChatMessages((prevMessages) => [...newHistory, ...prevMessages]);
    }
    setLoading(false);
  }, [chat.GroupID, chat.ChatID, loading, page]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMoreMessages();
        }
      },
      { threshold: 1 }
    );

    if (topRef.current) {
      observer.observe(topRef.current);
    }

    return () => {
      if (topRef.current) {
        observer.unobserve(topRef.current);
      }
    };
  }, [loadMoreMessages]);

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
      <h2>Chat Window</h2>
      <textarea
        rows="10"
        cols="50"
        readOnly
        value={chatMessages
          .map((msg) => `${msg.created_at} - ${msg.username}: ${msg.message}`)
          .join("\n")}
      ></textarea>
      <div ref={topRef}></div>
      {/* ... other code ... */}
    </div>
  );
};

export default ChatWindow;