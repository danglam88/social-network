const clientToken = document.cookie
  .split("; ")
  .find((row) => row.startsWith("session_token="))
  ?.split("=")[1];

const config = {
  headers: {
    "Authorization": `Bearer ${clientToken}`,
    "Content-Type": "application/json",
  },
};

const ChatList = ({ availableChats, selectedChat, onSelectChat, onToggleChatList }) => {


  return (
    <div className="chat-list-container">
      <h2>Available Chats</h2>
      {availableChats.length === 0 && <div>Find a user and add them to your chat list from their profile</div>}
      <ul>
        {availableChats.map((chat) => {
          const chatKey = "chat" + chat.ChatID;
          return (
            <li
              key={chatKey}
              onClick={() => {
                onSelectChat(chat);
                onToggleChatList();
              }}
              style={{
                cursor: "pointer",
                fontWeight:
                  selectedChat && selectedChat.ChatID === chat.ChatID
                    ? "bold"
                    : "normal",
              }}
            >
               <img src={`http://localhost:8080${chat.AvatarUrl}`} className='avatar-symbol'/>{chat.DisplayName}
            </li>
          )})}
      </ul>
    </div>
  );
};

export default ChatList;
