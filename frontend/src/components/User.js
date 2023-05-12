import React, { useState, useEffect } from 'react';
import PersonalInfo from './PersonalInfo';
import Posts from './Posts';
import postsService from '../services/PostsService';
import followsService from '../services/FollowsService';
import ChatService from '../services/ChatService';
import FollowsWrapper from './FollowsWrapper';
import ChatWindow from './ChatWindow';

const User = ({ user }) => {
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
    setChatButton(false);
    setShowChatWindow(true);
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
      <PersonalInfo user={user} type="user" handleUpdateFollows={handleUpdateFollows} follows={follows} limitedInfo={chatNotAllowed} />
      {posts && posts.length > 0 && <Posts posts={posts} type={userName} userId={user.id} />}
      <br />
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
    </div>
  );
};

export default User;
