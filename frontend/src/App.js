import React, { useState, useEffect } from "react";
import perProfileService from "./services/PerProfileService";
import axios from "axios";
import logo from "./logo.png";
import "./App.css";
import RegisterForm from "./components/RegisterForm";
import LoginForm from "./components/LoginForm";
import PersonalProfile from "./components/PersonalProfile";
import Chat from "./components/Chat";
import UserList from "./components/UserList";
import GroupList from "./components/GroupList";
import NotificationIcon from "./components/NotificationIcon";
import followsService from "./services/FollowsService";
import postsService from "./services/PostsService";
import NotificationService from "./services/NotificationService";
import loginService from "./services/LoginService";
import usersService from "./services/UsersService";
import groupService from "./services/GroupsService";

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

const loggedInUrl = "http://localhost:8080/loggedin";

function App() {
  const [token, setToken] = useState("");
  const [user, setUser] = useState(null);
  const [perProfileVisible, setPerProfileVisible] = useState(true);
  const [follows, setFollows] = useState(null);
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [usersListVisible, setUsersListVisible] = useState(false);
  const [groups, setGroups] = useState([]);
  const [groupsListVisible, setGroupsListVisible] = useState(false);
  const [isGroupDetailPage, setIsGroupDetailPage] = useState(false)
 

  useEffect(() => {
    axios
      .post(loggedInUrl, JSON.stringify({}), config)
      .then((response) => {
        setToken(response.data.token);
      })
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    if (token !== "") {
      perProfileService
        .perprofile(user)
        .then((response) => {
          setUser(response.data);
          NotificationService.initialize("ws://localhost:8080/ws");

          followsService
            .follows("http://localhost:8080/follow?user_id=" + response.data.id)
            .then((response) => {
              setFollows(response.data);
            })
            .catch((error) => console.log(error));

          postsService
            .posts("http://localhost:8080/post?creator_id=" + response.data.id)
            .then((response) => {
              setPosts(response.data);
            })
            .catch((error) => console.log(error));
        })
        .catch((error) => console.log(error));

      usersService
        .users()
        .then((response) => {
          setUsers(response.data);
        })
        .catch((error) => console.log(error));

      groupService
        .groups()
        .then((response) => {
          setGroups(response.data);
        })
        .catch((error) => console.log(error));
    }
  }, [token]);

  const handleShowPersonalProfile = () => {
    setPerProfileVisible(true);
    setUsersListVisible(false);
    setGroupsListVisible(false);
  };

  const handleShowUsersList = () => {
    setPerProfileVisible(false);
    setUsersListVisible(true);
    setGroupsListVisible(false);
  };

  const handleShowGroupsList = () => {
    setPerProfileVisible(false);
    setUsersListVisible(false);
    setGroupsListVisible(true);
    setIsGroupDetailPage(false);
  };

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

  return (
    <div>
      {token !== "" && user ? (
        <div>
          <div className="Header">
            {user.nick_name ? (
              <div className="header">
                Welcome{" "}
                <span onClick={handleShowPersonalProfile}>
                  <i>
                    <u>{user.nick_name}</u>
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
                      {user.first_name} {user.last_name}
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
                    <button onClick={handleShowUsersList}>Show Users</button>
                  </div>
                )}
                {groups && (
                  <div>
                    <button onClick={handleShowGroupsList}>Show Groups</button>
                  </div>
                )}
              </div>
            </div>
            <div className="Mainpage">
              {perProfileVisible && <PersonalProfile user={user} posts={posts} />}
              {usersListVisible && <UserList users={users} followings={follows.followings} />}
              {groupsListVisible && <GroupList isGroupDetailPage={isGroupDetailPage} setIsGroupDetailPage={setIsGroupDetailPage}/>}
            </div>
            <Chat />
          </div>
        </div>
      ) : (
        <div className="App-body">
          <div><img src={logo} className="App-logo" alt="logo" /></div>
            <RegisterForm />
            <LoginForm />
        </div>
      )}
    </div>
  );
}

export default App;
