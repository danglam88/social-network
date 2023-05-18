import React, { useState, useEffect } from "react";
import PersonalInfo from "./PersonalInfo";
import Posts from "./Posts";
import postsService from "../services/PostsService";
import followsService from "../services/FollowsService";
import ChatService from "../services/ChatService";
import ChatWindow from "./ChatWindow";
import usersService from "../services/UsersService";

const User = ({
  ownId,
  user,
  setAvailableChats,
  chatListVisible,
}) => {
  const [posts, setPosts] = useState([]);
  const [follows, setFollows] = useState(null);
  const [chatButton, setChatButton] = useState(false);
  const [showChatWindow, setShowChatWindow] = useState(false);
  const [chatNotAllowed, setChatNotAllowed] = useState(false);
  const [updatedUser, setUpdatedUser] = useState(user);
  const [exclusive, setExclusive] = useState(false);
  const [profilePrivate, setProfilePrivate] = useState(updatedUser.is_private === 1);

  useEffect(() => {
    postsService
      .posts("http://localhost:8080/visible?creator_id=" + updatedUser.id)
      .then((response) => {
        setPosts(response.data);
      })
      .catch((error) => console.log(error));

    followsService
      .follows("http://localhost:8080/follow?user_id=" + updatedUser.id)
      .then((response) => {
        setFollows(response.data);
      })
      .catch((error) => console.log(error));

    ChatService.checkChat(
      "http://localhost:8080/checkchat?user_id=" + updatedUser.id
    )
      .then((response) => {
        if (response.data.Error === "Chat not found") {
          setChatButton(true);
        } else if (response.data.Error === "Chat not allowed") {
          setChatNotAllowed(true);
        }
      })
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    if (updatedUser.is_private === 1) {
      setProfilePrivate(true);
    } else {
      setProfilePrivate(false);
    }

    followsService
      .checkfollow(
        "http://localhost:8080/checkfollow?user_id=" + updatedUser.id
      )
      .then((response) => {
        if (response.data.Error === "Yes") {
          setExclusive(true);
        }
      })
      .catch((error) => console.log(error));
  }, [updatedUser]);

  const addChatToChatList = () => {
    handleUpdateFollows(updatedUser.id);

    ChatService.checkChat(
      "http://localhost:8080/checkchat?user_id=" + updatedUser.id
    )
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

  const fetchChats = () => {
    try {
      ChatService.fetchChats().then((response) => {
        if (response && response.data) {
          setAvailableChats(response.data);
        } else {
          setAvailableChats([]);
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  const userName = updatedUser.nick_name
    ? updatedUser.nick_name
    : `${updatedUser.first_name} ${updatedUser.last_name}`;

  const handleUpdateFollows = async (userId) => {
    await followsService
      .follows("http://localhost:8080/follow?user_id=" + userId)
      .then((response) => {
        setFollows(response.data);
      })
      .catch((error) => console.log(error));

    await usersService
      .user(userId)
      .then((response) => {
        setUpdatedUser(response.data);
      })
      .catch((error) => console.log(error));
  };

  return (
    <div>
      <h2>{userName}'s profile</h2>
      {follows && (
        <PersonalInfo
          ownId={ownId}
          updatedUser={updatedUser}
          setUpdatedUser={setUpdatedUser}
          exclusive={exclusive}
          setExclusive={setExclusive}
          profilePrivate={profilePrivate}
          setProfilePrivate={setProfilePrivate}
          type="user"
          handleUpdateFollows={handleUpdateFollows}
          follows={follows}
          setPosts={setPosts}
          setChatNotAllowed={setChatNotAllowed}
        />
      )}
      {chatNotAllowed ? (
        <div>
          You need to follow <b>{userName}</b> in order to chat
        </div>
      ) : chatButton ? (
        <button onClick={addChatToChatList}>Add Chat to Chat List</button>
      ) : showChatWindow ? (
        <div>
          <div>
            <b>{userName}</b> has been added to the chat list
          </div>
          <ChatWindow
            chat={{
              GroupID: 0,
              ChatID: updatedUser.id,
            }}
            onNewChatCreated={fetchChats}
            chatListVisible={chatListVisible}
          />
        </div>
      ) : (
        <div>
          <b>{userName}</b> is available in the chat list
        </div>
      )}
      <br />
      {posts && posts.length > 0 && (
        <Posts posts={posts} type={userName} userId={updatedUser.id} />
      )}
    </div>
  );
};

export default User;
