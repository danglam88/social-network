import React, { useState, useEffect } from 'react';
import PersonalInfo from './PersonalInfo';
import Posts from './Posts';
import postsService from '../services/PostsService';
import followsService from '../services/FollowsService';
import FollowsWrapper from './FollowsWrapper';
import ChatWindow from './ChatWindow';

const User = ({ user }) => {
  const [posts, setPosts] = useState([]);
  const [follows, setFollows] = useState(null);
  const [showChatWindow, setShowChatWindow] = useState(false);
  const [chatuserName, setUserName] = useState('')
  const [avatar, setAvatar] = useState('')

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
      setUserName(userName);
      setAvatar(user.avatar_url);
      console.log(user);
  }, []);

  const openChatWindow = () => {
    setShowChatWindow(true);
  };

  const closeChatWindow = () => {
    setShowChatWindow(false);
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
      <PersonalInfo user={user} type="user" handleUpdateFollows={handleUpdateFollows} />
      <div>
        {follows && (
          <div className="follow">
            {follows.followers && (
              <FollowsWrapper
                userId={user.id}
                follows={follows.followers}
                title="Followers:"
                handleShowPendings={handleUpdateFollows}
              />
            )}
            {follows.followings && (
              <FollowsWrapper
                userId={user.id}
                follows={follows.followings}
                title="Followings:"
                handleShowPendings={handleUpdateFollows}
              />
            )}
          </div>
        )}
      </div>
      {posts && <Posts posts={posts} type={userName} />}
      <br />
      <button onClick={openChatWindow}>Open Chat</button>
      {showChatWindow && (
  <div
    className="chat-window-modal"
    onClick={closeChatWindow}
    onKeyDown={(e) => {
      if (e.key === 'esc') {
        closeChatWindow();
      }
    }}
    tabIndex="0"
  >
    <ChatWindow chat={{ GroupID: 0, ChatID: user.id }} username={chatuserName} onClose={closeChatWindow} avatarUrl={avatar} />

  </div>
)}
    </div>
  );
};

export default User;
