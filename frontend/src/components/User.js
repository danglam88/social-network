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
      <PersonalInfo user={user} type="user" handleUpdateFollows={handleUpdateFollows} />
      <div>
        {follows && (
          <div className="follow">
            {follows.followers && follows.followers.length > 0 && (
              <FollowsWrapper
                userId={user.id}
                follows={follows.followers}
                title="Followers"
                handleShowPendings={handleUpdateFollows}
              />
            )}
            {follows.followings && follows.followings.length > 0 && (
              <FollowsWrapper
                userId={user.id}
                follows={follows.followings}
                title="Followings"
                handleShowPendings={handleUpdateFollows}
              />
            )}
          </div>
        )}
      </div>
      {posts && <Posts posts={posts} type={userName} />}
      <br />
      {chatButton ? <button onClick={addChatToChatList}>Add Chat to Chat List</button> :
        showChatWindow ? (
          <div>
            <div>{userName} is available to chat from chat list</div>
            <ChatWindow chat={{ GroupID: 0, ChatID: user.id }} />
          </div>
        ) : (
          <div>{userName} is available to chat from chat list</div>
        )}
    </div>
  );
};

export default User;
