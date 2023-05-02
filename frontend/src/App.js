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
import NotificationService from "./services/NotificationService";
import loginService from "./services/LoginService";
import usersService from "./services/UsersService";
import groupService from "./services/GroupsService";
import postsService from "./services/PostsService";

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
  const [showUserProfile, setShowUserProfile] = useState(false)
  const [groups, setGroups] = useState([]);
  const [groupsListVisible, setGroupsListVisible] = useState(false);
  const [isGroupDetailPage, setIsGroupDetailPage] = useState(false);

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
        .perprofile()
        .then((response) => {
          setUser(response.data);
          NotificationService.initialize("ws://localhost:8080/ws");

          handleShowPendings(response.data.id);

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
    perProfileService
      .perprofile()
      .then((response) => {
        setUser(response.data);

        setPerProfileVisible(true);
        setUsersListVisible(false);
        setGroupsListVisible(false);
      })
      .catch((error) => console.log(error));
  };

  const handleShowUsersList = () => {
    handleShowPendings(user.id)
      .then(() => {
        usersService
          .users()
          .then((response) => {
            setUsers(response.data);

            setPerProfileVisible(false);
            setUsersListVisible(true);
            setShowUserProfile(false);
            setGroupsListVisible(false);
          })
          .catch((error) => console.log(error));
      })
      .catch((error) => console.log(error));
  };

  const handleShowGroupsList = () => {
    setPerProfileVisible(false);
    setUsersListVisible(false);
    setGroupsListVisible(true);
    setIsGroupDetailPage(false);
  };

  const handleShowPendings = async (userId) => {
    await followsService
      .follows("http://localhost:8080/follow?user_id=" + userId)
      .then((response) => {
        setFollows(response.data);
      })
      .catch((error) => console.log(error));
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

        setToken("");
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
              {perProfileVisible && <PersonalProfile user={user} posts={posts} setPosts={setPosts} follows={follows} handleShowPendings={handleShowPendings} />}
              {usersListVisible && <UserList users={users} followings={follows.followings} showUserProfile={showUserProfile} setShowUserProfile={setShowUserProfile} />}
              {groupsListVisible && <GroupList isGroupDetailPage={isGroupDetailPage} setIsGroupDetailPage={setIsGroupDetailPage}/>}
            </div>
            <Chat userId={user.id}/>
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
