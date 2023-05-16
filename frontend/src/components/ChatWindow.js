import React, { useState, useEffect, useRef, useCallback, memo } from "react";
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

const ChatWindow = memo(({ chat, onClose, chatId, username, avatarUrl, userId }) => {
  const [chatMessages, setChatMessages] = useState([]);
  const [typedMessage, setTypedMessage] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const chatContainerRef = useRef(null);
  const [scrollToBottom, setScrollToBottom] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [error, setError] = useState(null);
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
  const [newChatCreated, setNewChatCreated] = useState(false);

  

  const toggleEmojiPicker = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  const addEmoji = emoji => {
    setTypedMessage(typedMessage + emoji);
    setShowEmojiPicker(false);
  };

  const fetchInitialChatHistory = useCallback(
    async () => {
      setChatMessages([]);
      try {
        const response = await ChatService.fetchChatHistory(
          chat.GroupID,
          // if chatId is not provided, use chat.ChatID
          chatId || chat.ChatID,
        );
        if (response.data.Status === "not allowed to send message to this user") {
          console.log(response.data.Status);
          setError(response.data.Status);

          return;
        }
        if (response.data.Error) {
          console.error(response.data.Error);
          return;
        }
        if (response.data.created === true) {
          console.log("New chat created");
          setNewChatCreated(true);
        }
        
        if (!response.data.history) {
          console.log("No chat history found, new chat created");
          recipientChatId = response.data.chat_id;
          return;
        }
        recipientChatId = response.data.chat_id;
        console.log("Initial chat history:", response.data.history);
        const initialHistory = await response.data.history;
        setChatMessages(sortMessagesByDate(initialHistory));
        // Scroll chat textarea to the bottom when it first loads
        setTimeout(() => {
        if (chatContainerRef.current) {
          chatContainerRef.current.scrollTop =
            chatContainerRef.current.scrollHeight;
        }
        }, 50);
      } catch (error) {
        console.error("Error fetching initial chat history:", error);
      }
    },
    [chat.GroupID, chat.ChatID]
  );

  useEffect(() => {
    fetchInitialChatHistory();
  }, [fetchInitialChatHistory]);

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

  if (error) {
    console.log("Error:", error)
    return <div className="error">{error}</div>;
  }

  return (
  <div>
    {!newChatCreated ? (
    <div className="chatBox" style={{ flex: 1, display: "flex", flexDirection: "column" }} onClick={handleOutsideClick}>
              <button onClick={onClose}>X</button>
      <div className="chat-info">
      <div className="chat-avatar">
      <img src={`http://localhost:8080${avatarUrl || chat.AvatarUrl}`} className='avatar-symbol'/>
      </div>
      <div className="chat-title"><h2>{username ? username : chat.DisplayName}</h2></div>
      </div>
      <div
        ref={chatContainerRef}
        className="chat-container"
      >

        {chatMessages.map(msg => (
          <div key={msg.created_at+msg.id+msg.message} className={msg.from ===  userId ? "right-message" : "left-message"}>
            {msg.from !==  userId ? (
              <span>
                <span style={{fontWeight: "bold"}}>{msg.username+" "}</span>
                <span style={{fontSize: "12px", color: "grey", marginRight: "10px"}}>
                  {msg.created_at.replace("T", " ").replace("Z", "")}
                </span>
              </span>
            ) : (
              <span>
                <span style={{fontSize: "12px", color: "grey", marginRight: "10px"}}>
                  {msg.created_at.replace("T", " ").replace("Z", "")}
                </span>
                <span style={{fontWeight: "bold"}}>{msg.username}</span>
              </span>
            )}
            <br />
            <div className="chat-message">
            <div className="chat-message-displayed">{msg.message}</div>
            </div>
          </div>
          ))}
      </div>

      <div className="chat-input-user">
        <input
          type="text"
          value={typedMessage}
          onChange={e => setTypedMessage(e.target.value)}
          onKeyDown={e => {
            if (e.key === "Enter") sendMessage();
          }}
        />
        
        <button onClick={toggleEmojiPicker}>
          {showEmojiPicker ? "😊" : "😊"}
        </button>
          <button onClick={sendMessage}>Send</button>
          {showEmojiPicker &&
          <div className="emoji-wrapper"><div
          className="emoji-picker"
          >
            {emojis.map((emoji, index) => {
              const emojiKey = "emoji" + index;
              return <span
                key={emojiKey}
                onClick={() => addEmoji(emoji)}
              >
                {emoji}
              </span>
            })}
          </div></div>}
      </div>
    </div>) : null}
  </div>
  );
});

export default ChatWindow;
