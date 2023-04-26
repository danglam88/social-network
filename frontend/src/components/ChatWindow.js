import React, { useState, useEffect, useRef, useCallback } from "react";
import ChatService from "../services/ChatService";

const ChatWindow = ({ chat }) => {
  const [chatMessages, setChatMessages] = useState(chat.history);
  const [typedMessage, setTypedMessage] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const topRef = useRef(null);
  const [hasMore, setHasMore] = useState(true);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    const callback = (messageData) => {
      setChatMessages((previousMessages) => {
        const updatedMessages = [...previousMessages, messageData];
        return updatedMessages.sort(
          (a, b) => new Date(a.created_at) - new Date(b.created_at)
        );
      });
  
      // Scroll chat textarea to the bottom when a new message is received
      if (chatContainerRef.current) {
        // Add a short delay to allow the browser to render the updated content
        setTimeout(() => {
          chatContainerRef.current.scrollTop =
            chatContainerRef.current.scrollHeight;
        }, 50);
      }
    };
  
    ChatService.onMessage(callback);
  
    return () => {
      ChatService.removeMessageListener(callback);
    };
  }, []);

  const sendMessage = () => {
    if (typedMessage.trim() !== "") {
      ChatService.sendMessage(chat.ChatID, typedMessage);
      setTypedMessage("");
    }
  };

  const loadMoreMessages = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    setPage((prevPage) => prevPage + 1);
    ChatService.fetchChatHistory(chat.GroupID, chat.ChatID, page + 1)
      .then((response) => {
        const newHistory = response.data;
        if (newHistory && newHistory.length > 0) {
          setChatMessages((prevMessages) => [...prevMessages, ...newHistory]);
        } else {
          setHasMore(false);
        }
        setLoading(false);
      })
      .catch((error) => console.error("Error fetching chat history:", error));
  }, [chat.GroupID, chat.ChatID, loading, page, hasMore]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMoreMessages();
        }
      },
      { threshold: 1 }
    );

    const currentTopRef = topRef.current;

    if (currentTopRef) {
      observer.observe(currentTopRef);
    }

    return () => {
      if (currentTopRef) {
        observer.unobserve(currentTopRef);
      }
    };
  }, [loadMoreMessages, hasMore]);

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
      <h2>Chat Window</h2>

      <textarea
        ref={chatContainerRef}
        cols="50"
        readOnly
        value={chatMessages
          .slice()
          .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
          .map((msg) => `${new Date(msg.created_at).toLocaleString()} - ${msg.username}: ${msg.message}`)
          .join('\n')}
        style={{
          height: '200px',
          overflowY: 'scroll',
        }}
      ></textarea>

      <div ref={topRef}></div>
      <div>
        <input
          type="text"
          value={typedMessage}
          onChange={(e) => setTypedMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") sendMessage();
          }}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatWindow;
