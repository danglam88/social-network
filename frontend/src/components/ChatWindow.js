import React, { useState, useEffect, useRef, useCallback } from "react";
import ChatService from "../services/ChatService";
import debounce from "lodash/debounce";
let recipientChatId;

const sortMessagesByDate = messages => {
  if (!messages) return [];
  if (messages.length === 0) return [];
  const sortedMessages = messages.sort((a, b) => {
    const dateA = new Date(a.created_at.replace("T", " ").replace("Z", ""));
    const dateB = new Date(b.created_at.replace("T", " ").replace("Z", ""));

    const timestampA = dateA.getTime() || dateA.valueOf();
    const timestampB = dateB.getTime() || dateB.valueOf();

    // Handle the case when `created_at` is not a valid date
    if (isNaN(timestampA)) return 1;
    if (isNaN(timestampB)) return -1;

    return timestampA - timestampB;
  });

  return sortedMessages;
};

const ChatWindow = ({ chat }) => {
  const [chatMessages, setChatMessages] = useState([]);
  const [typedMessage, setTypedMessage] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const topRef = useRef(null);
  const [hasMore, setHasMore] = useState(true);
  const chatContainerRef = useRef(null);
  const [scrollToBottom, setScrollToBottom] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojis = [
    "😀",
    "😁",
    "😂",
    "🤣",
    "😃",
    "😄",
    "😅",
    "😆",
    "😉",
    "😊",
    "😋",
    "😎",
    "😍",
    "😘",
    "😗",
    "😙",
    "😚",
    "☺️",
    "🙂",
    "🤗",
    "🤩",
    "🤔",
    "🤨",
    "😐",
    "😑",
    "😶",
    "🙄",
    "😏",
    "😣",
    "😥",
    "😮",
    "🤐",
    "😯",
    "😪",
    "😫",
    "😴",
    "😌",
    "😛",
    "😜",
    "😝",
    "🤤",
    "😒",
    "😓",
    "😔",
    "😕",
    "🙃",
    "🤑",
    "😲",
    "🙁",
    "😖",
    "😞",
    "😟",
    "😤",
    "😢",
    "😭",
    "😦",
    "😧",
    "😨",
    "😩",
    "🤯",
    "😬",
    "😰",
    "😱",
    "🥵",
    "🥶",
    "😳",
    "🤪",
    "😵",
    "😡",
    "😠",
    "🤬",
    "😷",
    "🥴",
    "🤢",
    "🤮",
    "🤧",
    "😇",
    "🥰",
    "🤠",
    "🥳",
    "🥺",
    "🦄",
    "🧜",
    "🦸",
    "🦹",
    "🤖",
    "🎃",
    "🤡",
    "💩",
  ];
  

  const toggleEmojiPicker = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  const addEmoji = emoji => {
    setTypedMessage(typedMessage + emoji);
    setShowEmojiPicker(false);
  };

  const fetchInitialChatHistory = useCallback(
    async () => {
      try {
        const response = await ChatService.fetchChatHistory(
          chat.GroupID,
          chat.ChatID,
        );
        if (!response.data.history) {
          console.log(
            "No chat history found, set recipient id to response.chat_id" + response.data.chat_id
          );
          recipientChatId = response.data.chat_id;

          return;
        }
        console.log("Initial chat history:", response.data.history);
        recipientChatId = response.data.chat_id;
        const initialHistory = response.data.history;
        setChatMessages(sortMessagesByDate(initialHistory));
        // Scroll chat textarea to the bottom when it first loads
        if (chatContainerRef.current) {
          chatContainerRef.current.scrollTop =
            chatContainerRef.current.scrollHeight;
        }
      } catch (error) {
        console.error("Error fetching initial chat history:", error);
      }
    },
    [chat.GroupID, chat.ChatID]
  );

  useEffect(
    () => {
      fetchInitialChatHistory();
    },
    [fetchInitialChatHistory]
  );

  useEffect(() => {
    const callback = messageData => {
      setChatMessages(previousMessages => {
        const updatedMessages = [...previousMessages, messageData];
        return sortMessagesByDate(updatedMessages);
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
      console.log("Sending message:", typedMessage, "to chat:", recipientChatId, "ChatWindow.js 199")
      ChatService.sendMessage(recipientChatId, typedMessage);
      setTypedMessage("");
      setScrollToBottom(true);
    }
  };

  const loadMoreMessages = useCallback(
    debounce(async () => {
      if (loading || !hasMore) return;
      setLoading(true);
      setPage(prevPage => prevPage + 1);
      const chatContainer = chatContainerRef.current; // get the container element
      const oldHeight = chatContainer.scrollHeight; // get the old height
      const oldScrollPosition = chatContainer.scrollTop; // store the current scroll position

      ChatService.fetchChatHistory(chat.GroupID, chat.ChatID, page + 1)
        .then(response => {
          const newHistory = response.data.history;
          if (newHistory && newHistory.length > 0) {
            setChatMessages(prevMessages => {
              const updatedMessages = [...prevMessages, ...newHistory];
              return sortMessagesByDate(updatedMessages);
            });

            // Add a short delay to allow the browser to render the updated content
            setTimeout(() => {
              const newHeight = chatContainer.scrollHeight; // get the new height
              const scrollOffset = newHeight - oldHeight; // calculate the scroll offset
              chatContainer.scrollTop = oldScrollPosition + scrollOffset; // adjust the scroll position
            }, 50);
          } else {
            setHasMore(false);
          }
          setLoading(false);
        })
        .catch(error => console.error("Error fetching chat history:", error));
    }, 500),
    [chat.GroupID, chat.ChatID, loading, page, hasMore]
  );

  useEffect(
    () => {
      const handleScroll = () => {
        if (chatContainerRef.current.scrollTop === 0) {
          setScrollToBottom(false);
          loadMoreMessages();
        }
      };

      chatContainerRef.current.addEventListener("scroll", handleScroll);

      return () => {
        if (chatContainerRef.current) {
          chatContainerRef.current.removeEventListener("scroll", handleScroll);
        }
      };
    },
    [loadMoreMessages]
  );

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
      <h2>Chat Window</h2>

      <div
        ref={chatContainerRef}
        className="chat-container"
        style={{
          height: "150px",
          overflowY: "scroll",
          border: "1px solid #ccc",
          padding: "4px",
          whiteSpace: "pre-wrap",
        }}
      >
        <div style={{ minHeight: "1px" }}>
          <div ref={topRef} />
        </div>
        {chatMessages
          .map(
            msg =>
              `${msg.created_at
                .replace("T", " ")
                .replace("Z", "")} - ${msg.username}: ${msg.message}`
          )
          .join("\n")}
      </div>

      <div>
        <input
          type="text"
          value={typedMessage}
          onChange={e => setTypedMessage(e.target.value)}
          onKeyDown={e => {
            if (e.key === "Enter") sendMessage();
          }}
        />
        <button onClick={sendMessage}>Send</button>
        <button onClick={toggleEmojiPicker}>
          {showEmojiPicker ? "Emojis 🔼" : "Emojis 🔽"}
        </button>
        {showEmojiPicker &&
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              maxWidth: "250px",
              border: "1px solid #ccc",
              padding: "4px",
              borderRadius: "4px",
              backgroundColor: "#f1f1f1",
            }}
          >
            {emojis.map((emoji, index) =>
              <span
                key={index}
                style={{
                  cursor: "pointer",
                  fontSize: "20px",
                  padding: "4px",
                }}
                onClick={() => addEmoji(emoji)}
              >
                {emoji}
              </span>
            )}
          </div>}
      </div>
    </div>
  );
};

export default ChatWindow;
