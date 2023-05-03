import React, { useState, useEffect, useRef, useCallback } from "react";
import ChatService from "../services/ChatService";
import debounce from "lodash/debounce";
import "../chat.css";
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

const ChatWindow = ({ chat, onClose, chatId }) => {
  const [chatMessages, setChatMessages] = useState([]);
  const [typedMessage, setTypedMessage] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const topRef = useRef(null);
  const [hasMore, setHasMore] = useState(true);
  const chatContainerRef = useRef(null);
  const [scrollToBottom, setScrollToBottom] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [emojiPickerPosition, setEmojiPickerPosition] = useState({ top: 0, left: 0 });
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
  ];
  
  

  const toggleEmojiPicker = () => {
    setShowEmojiPicker(!showEmojiPicker);
    if (!showEmojiPicker) {
      const buttonRect = document.getElementById("emoji-button").getBoundingClientRect();
      setEmojiPickerPosition({
        top: buttonRect.top + 50,
        left: buttonRect.left - 200,
      });
    }
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
          // if chatId is not provided, use chat.ChatID
          chatId || chat.ChatID,
        );
        if (response.data.Status === "not allowed to send message to this user") {
          console.log(response.data.Status);
          //close chat window
          onClose();
          return;
        }
        if (response.data.Error) {
          console.error(response.data.Error);
          return;
        }
        if (!response.data.history) {
          console.log(
            "No chat history found, set recipient id to response.chat_id" + response.data.chat_id
          );
          recipientChatId = response.data.chat_id;
          return;
        }
        recipientChatId = response.data.chat_id;
        console.log("Initial chat history:", response.data.history);
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

  useEffect(() => {
    fetchInitialChatHistory();
  }, [fetchInitialChatHistory, chatId]);

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
      console.log("Sending message:", typedMessage, "to chat:", chat.ChatID, "ChatWindow.js 199")
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

  const handleOutsideClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div
      className="chatBox"
      style={{ flex: 1, display: "flex", flexDirection: "column" }}
      onClick={handleOutsideClick}
      ref={chatContainerRef}
    >
      <h2>
        Chat Window{" "}
        <button onClick={onClose} style={{ marginLeft: "auto" }}>
          Close
        </button>
      </h2>
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
  
      <div
        style={{
          position: "relative",
        }}
      >
        <input
          type="text"
          value={typedMessage}
          onChange={e => setTypedMessage(e.target.value)}
          onKeyDown={e => {
            if (e.key === "Enter") sendMessage();
          }}
        />
        <button onClick={sendMessage}>Send</button>
        <button id="emoji-button" onClick={toggleEmojiPicker}>
  {showEmojiPicker ? "Emojis 🔼" : "Emojis 🔽"}
</button>
        {showEmojiPicker && (
          <div
            className="emoji-picker"
            style={{
              top: emojiPickerPosition.top,
              left: emojiPickerPosition.left,
            }}
          >
            {emojis.map((emoji, index) => (
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
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatWindow;
