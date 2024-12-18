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
import UserOptions from "./components/UserOptions";

const clientToken = document.cookie
  .split("; ")
  .find((row) => row.startsWith("session_token="))
  ?.split("=")[1];

const config = {
  headers: {
    Authorization: `Bearer ${clientToken}`,
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
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [groups, setGroups] = useState([]);
  const [groupsListVisible, setGroupsListVisible] = useState(false);
  const [isGroupDetailPage, setIsGroupDetailPage] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [isLinkClicked, setIsLinkClicked] = useState(false);
  const [showUserOptions, setShowUserOptions] = useState(false);
  const [showList, setShowList] = useState(false);
  const [availableChats, setAvailableChats] = useState([]);
  const [chatListVisible, setChatListVisible] = useState(false);
  const [profilePrivate, setProfilePrivate] = useState(false);

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

          if (response.data.is_private === 1) {
            setProfilePrivate(true);
          }

          NotificationService.initialize("ws://localhost:8080/ws");

          handleShowPendings(response.data.id);

          handleShowNotifications();

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

  useEffect(() => {
    if (showUserProfile || isGroupDetailPage) {
      setShowUserOptions(false);
      setShowList(false);
    }
  }, [showUserProfile, isGroupDetailPage]);

  const handleShowPersonalProfile = () => {
    perProfileService
      .perprofile()
      .then((response) => {
        setUser(response.data);

        if (response.data.is_private === 1) {
          setProfilePrivate(true);
        }

        handleShowPendings(response.data.id);

        handleShowNotifications();

        postsService
          .posts("http://localhost:8080/post?creator_id=" + response.data.id)
          .then((response) => {
            setPosts(response.data);
          })
          .catch((error) => console.log(error));

        setPerProfileVisible(true);
        setUsersListVisible(false);
        setGroupsListVisible(false);
        setShowUserOptions(false);
        setShowList(false);
      })
      .catch((error) => console.log(error));
  };

  const handleShowUsersList = () => {
    usersService
      .users()
      .then((response) => {
        setUsers(response.data);

        setPerProfileVisible(false);
        setUsersListVisible(true);
        setShowUserProfile(false);
        setGroupsListVisible(false);
        setShowUserOptions(false);
        setShowList(false);
      })
      .catch((error) => console.log(error));
  };

  const handleShowGroupsList = () => {
    groupService
      .groups()
      .then((response) => {
        setGroups(response.data);

        setPerProfileVisible(false);
        setUsersListVisible(false);
        setGroupsListVisible(true);
        setIsGroupDetailPage(false);
        setShowUserOptions(false);
        setShowList(false);
      })
      .catch((error) => console.log(error));
  };

  const handleShowPendings = async (userId) => {
    await followsService
      .follows("http://localhost:8080/follow?user_id=" + userId)
      .then((response) => {
        setFollows(response.data);
      })
      .catch((error) => console.log(error));
  };

  const handleShowNotifications = async () => {
    await NotificationService.getAll()
      .then((response) => {
        setNotifications(response.data);
      })
      .catch((error) => console.log(error));
  };

  const handleShowUserOptions = () => {
    setShowUserOptions(!showUserOptions);
  };

  const handleRegisterLinkClick = () => {
    setShowRegisterForm(!showRegisterForm);
    setIsLinkClicked(!isLinkClicked);
  };

  const handleLogout = (event) => {
    event.preventDefault();

    loginService
      .logout({})
      .then(() => {
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
            <div className="header">
              <div className="another-header-wrapper" onClick={handleShowPersonalProfile}>
                <div className="header-logo-title">
                  <div><img src={logo} className="App-logo" alt="logo" /></div>
                  <div><h1>Interstellar</h1></div>
                  </div>
              </div>
            </div>
          </div>
          <ul className="Menu">
            <div>
              {users && users.length > 0 && (
                <li onClick={handleShowUsersList}>Users</li>
              )}
              {groups && groups.length > 0 && (
                <li onClick={handleShowGroupsList}>Groups</li>
              )}
            </div>
            <div className="user-options-menu">
              <NotificationIcon
                showList={showList}
                setShowList={setShowList}
                handleShowPendings={handleShowPendings}
                showUserOptions={showUserOptions}
                setShowUserOptions={setShowUserOptions}
                profilePrivate={profilePrivate}
              />
              <img
                onClick={handleShowUserOptions}
                className="avatar-symbol"
                src={`http://localhost:8080${user.avatar_url}`}
                alt="Avatar Image"
              />
              {showUserOptions && (
                <UserOptions
                  handleShowPersonalProfile={handleShowPersonalProfile}
                  handleLogout={handleLogout}
                />
              )}
            </div>
          </ul>
          <div className="page-body">
            <div className="Mainpage">
              {perProfileVisible && follows && (
                <PersonalProfile
                  user={user}
                  posts={posts}
                  setPosts={setPosts}
                  follows={follows}
                  handleShowPendings={handleShowPendings}
                  notifications={notifications}
                  setNotifications={setNotifications}
                  profilePrivate={profilePrivate}
                  setProfilePrivate={setProfilePrivate}
                />
              )}
              {usersListVisible && (
                <UserList
                  ownId={user.id}
                  users={users}
                  showUserProfile={showUserProfile}
                  setShowUserProfile={setShowUserProfile}
                  availableChats={availableChats}
                  setAvailableChats={setAvailableChats}
                  chatListVisible={chatListVisible}
                  setChatListVisible={setChatListVisible}
                />
              )}
              {groupsListVisible && (
                <GroupList
                  items={groups}
                  setItems={setGroups}
                  isGroupDetailPage={isGroupDetailPage}
                  setIsGroupDetailPage={setIsGroupDetailPage}
                  chatListVisible={chatListVisible}
                  setChatListVisible={setChatListVisible}
                  setAvailableChats={setAvailableChats}
                />
              )}
            </div>
            <Chat
              userId={user.id}
              availableChats={availableChats}
              setAvailableChats={setAvailableChats}
              chatListVisible={chatListVisible}
              setChatListVisible={setChatListVisible}
            />
          </div>
        </div>
      ) : (
        <div className="App-body">
          <div>
            <img src={logo} className="App-logo" alt="logo" />
          </div>
          <LoginForm />
          <div
            className={isLinkClicked ? "register-clicked" : "register"}
            onClick={handleRegisterLinkClick}
          >
            {" "}
            Register new user
          </div>
          {showRegisterForm && (
            <div>
              <RegisterForm />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
