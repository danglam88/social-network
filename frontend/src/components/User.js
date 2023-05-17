import React, { useState, useEffect } from 'react';
import PersonalInfo from './PersonalInfo';
import Posts from './Posts';
import postsService from '../services/PostsService';
import followsService from '../services/FollowsService';
import ChatService from '../services/ChatService';
import ChatWindow from './ChatWindow';

const User = ({ ownId, user }) => {
  const [posts, setPosts] = useState([]);
  const [follows, setFollows] = useState(null);
  const [chatButton, setChatButton] = useState(false);
  const [showChatWindow, setShowChatWindow] = useState(false);
  const [chatNotAllowed, setChatNotAllowed] = useState(false);

  useEffect(() => {
    postsService
      .posts('http://localhost:8080/visible?creator_id=' + user.id)
      .then((response) => {
        setPosts(response.data);
      })
      .catch((error) => console.log(error));

    followsService
      .follows('http://localhost:8080/follow?user_id=' + user.id)
      .then((response) => {
        setFollows(response.data);
      })
      .catch((error) => console.log(error));

    ChatService
      .checkChat('http://localhost:8080/checkchat?user_id=' + user.id)
      .then((response) => {
        if (response.data.Error === "Chat not found") {
          setChatButton(true);
        } else if (response.data.Error === "Chat not allowed") {
          setChatNotAllowed(true);
        }
      })
      .catch((error) => console.log(error));
  }, []);

  const addChatToChatList = () => {
    ChatService
      .checkChat('http://localhost:8080/checkchat?user_id=' + user.id)
      .then((response) => {
        if (response.data.Error === "Chat not allowed") {
          setChatNotAllowed(true);
        } else if (response.data.Error === "Chat not found") {
          setChatButton(false);
          setShowChatWindow(true);
        }
      })
      .catch((error) => console.log(error));
  };

  const userName = user.nick_name ? user.nick_name : `${user.first_name} ${user.last_name}`;

  const handleUpdateFollows = async (userId) => {
    await followsService
      .follows("http://localhost:8080/follow?user_id=" + userId)
      .then((response) => {
        setFollows(response.data);
      })
      .catch((error) => console.log(error));
  };

  return (
    <div>
      <h2>{userName}'s profile</h2>
      {follows && <PersonalInfo ownId={ownId} user={user} type="user" handleUpdateFollows={handleUpdateFollows} follows={follows} setPosts={setPosts} setChatNotAllowed={setChatNotAllowed} />}
      {chatNotAllowed ? <div>You need to follow <b>{userName}</b> in order to chat</div> :
        chatButton ? <button onClick={addChatToChatList}>Add Chat to Chat List</button> :
        showChatWindow ? (
          <div>
            <div><b>{userName}</b> has been added to the chat list</div>
            <ChatWindow chat={{ GroupID: 0, ChatID: user.id }} />
          </div>
        ) : (
          <div><b>{userName}</b> is available in the chat list</div>
        )}
      <br />
      {posts && posts.length > 0 && <Posts posts={posts} type={userName} userId={user.id} />}
    </div>
  );
};

export default User;
