import React, { useState, useEffect } from "react";
import perProfileService from "../services/PerProfileService";
import loginService from "../services/LoginService";
import Chat from "./Chat";
import GroupList from "./GroupList";
import NotificationIcon from "./NotificationIcon";
import Posts from "./Posts";
import PostForm from "./PostForm";
import postsService from "../services/PostsService";
import PersonalInfo from "./PersonalInfo";
import usersService from "../services/UsersService";
import UserList from "./UserList";
import followsService from "../services/FollowsService";
import FollowsWrapper from './FollowsWrapper'
import groupService from "../services/GroupsService";
import NotificationService from "../services/NotificationService";

const PersonalProfile = () => {
  const [data, setData] = useState({});

  const [posts, setPosts] = useState([]);
  const [follows, setFollows] = useState(null);

  useEffect(() => {
    perProfileService
      .perprofile(data)
      .then((response) => {
        setData(response.data);

        postsService
          .posts("http://localhost:8080/post?creator_id=" + response.data.id)
          .then((response) => {
            setPosts(response.data);
          })
          .catch((error) => console.log(error));

        followsService
          .follows("http://localhost:8080/follow?user_id=" + response.data.id)
          .then((response) => {
            setFollows(response.data);
          })
          .catch((error) => console.log(error));
      })
      .catch((error) => console.log(error));
  }, []);

  const handleLogout = (event) => {
    event.preventDefault();
    console.log("handle logout");

    loginService
      .logout({})
      .then((response) => {
        console.log(response);

        document.cookie =
          "session_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        sessionStorage.removeItem("userid");
        sessionStorage.removeItem("username");
        window.location.reload();
      })
      .catch((error) => console.log(error));
  };

  const [showPersonalProfile, setShowPersonalProfile] = useState(true);
  const [users, setUsers] = useState([]);
  const [usersVisible, setUsersVisible] = useState(false);
  const [groups, setGroups] = useState([]);
  const [groupsVisible, setGroupsVisible] = useState(false);

  const handleShowPersonalProfile = () => {
    setShowPersonalProfile(true);
    setUsersVisible(false);
    setGroupsVisible(false);
  };

  const handleSetUsersVisible = () => {
    setShowPersonalProfile(false);
    setUsersVisible(true);
    setGroupsVisible(false);
  };

  const handleSetGroupsVisible = () => {
    setShowPersonalProfile(false);
    setUsersVisible(false);
    setGroupsVisible(true);
  };

  useEffect(() => {
    usersService
      .users()
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    groupService
      .groups()
      .then((response) => {
        setGroups(response.data);
      })
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    NotificationService.initialize("ws://localhost:8080/ws");
  }, []);

  return (
    <div>
      <div className="Header">
        {data.nick_name ? (
          <div className="header">
            Welcome{" "}
            <span onClick={handleShowPersonalProfile}>
              <i>
                <u>{data.nick_name}</u>
              </i>
            </span>
            !
          </div>
        ) : (
          <div className="header">
            Welcome{" "}
            <span onClick={handleShowPersonalProfile}>
              <i>
                <u>
                  {data.first_name} {data.last_name}
                </u>
              </i>
            </span>
            !
          </div>
        )}
        <NotificationIcon />
        <form onSubmit={handleLogout}>
          <button type="submit">Logout</button>
        </form>
      </div>
      <div className="page-body">
        <div className="Menu">
          <div className="button-wrapper">
            {users && (
              <div>
                <button onClick={handleSetUsersVisible}>Show Users</button>
                {usersVisible && <UserList users={users} />}
              </div>
            )}
            {groups && (
              <div>
                <button onClick={handleSetGroupsVisible}>Show Groups</button>
                {groupsVisible && <GroupList />}
              </div>
            )}
          </div>
        </div>
        <div className="Mainpage">
          {showPersonalProfile ? (
            <div>
              <h2>Personal Profile</h2>
              <PersonalInfo user={data} />
              {follows && (
                <div className="follow">
                  {follows.followers && <FollowsWrapper follows={follows.followers} title="Follower(s):" />}
                  {follows.followings && <FollowsWrapper follows={follows.followings} title="Following(s):" />}
                </div>
              )}
              <PostForm />
              {posts && <Posts posts={posts} />}
              <Chat />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default PersonalProfile;
