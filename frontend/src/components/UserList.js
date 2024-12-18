import React, { useState, useEffect } from "react";
import usersService from "../services/UsersService";
import User from "./User";
import followsService from "../services/FollowsService";

const UserItem = ({ user, handleUserProfile, userProfileFollowed, setUserProfileFollowed }) => {
  const [userProfilePending, setUserProfilePending] = useState(false);
  const [check_pending, setCheckPending] = useState(true);
  const [updatedUser, setUpdatedUser] = useState(user);
  const [followValue, setFollowValue] = useState(false);
  const [privacyImage, setPrivacyImage] = useState("");

  useEffect(() => {
    if (updatedUser.is_private === 1) {
      setPrivacyImage("http://localhost:8080/upload/private.png");
    } else {
      setPrivacyImage("http://localhost:8080/upload/public.png");
    }
  }, []);

  useEffect(() => {
    const user_id = updatedUser.id;

    followsService
      .follow({ user_id, check_pending })
      .then((response) => {
        if (response.data.Error === "Pending") {
          setUserProfilePending(true);
        } else if (response.data.Error === "Followed") {
          setUserProfileFollowed(true);
        } else {
          setUserProfileFollowed(false);
        }
      })
      .then(() => {
        if (!check_pending) {
          if (!followValue || !updatedUser.is_private) {
            setUserProfileFollowed(!userProfileFollowed);
          } else {
            setUserProfilePending(true);
          }
        }
      })
      .then(() => {
        setCheckPending(true);
      })
      .catch((error) => console.log(error));
  }, [check_pending]);

  const handleShowUserProfile = (userId) => {
    handleUserProfile(userId);
  };

  const toggleFollow = (follow) => {
    setFollowValue(follow);

    usersService
      .user(updatedUser.id)
      .then((response) => {
        setUpdatedUser(response.data);
      })
      .then(() => {
        setCheckPending(false);
      })
      .catch((error) => console.log(error));
  };

  return (
    <div className="user-item">
      {updatedUser.nick_name ? (
        <div
          className="user-profile-name"
          onClick={() => {
            handleShowUserProfile(updatedUser.id);
          }}
        >
          <div className="avatar-border">
            <img
              className="avatar-symbol"
              src={`http://localhost:8080${updatedUser.avatar_url}`}
            />
          </div>
          <div>{updatedUser.nick_name}</div>
          <div className="icon-border">
            <img className="avatar-symbol" src={privacyImage} />
          </div>
        </div>
      ) : (
        <div
          className="user-profile-name"
          onClick={() => {
            handleShowUserProfile(updatedUser.id);
          }}
        >
          <div className="avatar-border">
            <img
              className="avatar-symbol"
              src={`http://localhost:8080${updatedUser.avatar_url}`}
            />
          </div>
          <div>
            {updatedUser.first_name} {updatedUser.last_name}
          </div>
          <div className="icon-border">
            <img className="avatar-symbol" src={privacyImage} />
          </div>
        </div>
      )}

      {userProfilePending ? (
        <button className="button-small pending-users">Pending</button>
      ) : userProfileFollowed ? (
        <button
          className="button-small unfollow-users"
          onClick={() => {
            toggleFollow(false);
          }}
        >
          Unfollow
        </button>
      ) : (
        <button
          className="button-small follow-users"
          onClick={() => {
            toggleFollow(true);
          }}
        >
          Follow
        </button>
      )}
    </div>
  );
};

const UserList = ({
  ownId,
  users,
  showUserProfile,
  setShowUserProfile,
  availableChats,
  setAvailableChats,
  chatListVisible,
  setChatListVisible,
}) => {
  const [userData, setUserData] = useState({});
  const [filter, setFilter] = useState("");
  const [items, setItems] = useState(users);
  const [initialItems, setInitialItems] = useState(users);
  const [filterMessage, setFilterMessage] = useState("");
  const [userProfileFollowed, setUserProfileFollowed] = useState(() => {
    const initialFollowed = {};
    users.forEach((user) => {
      initialFollowed[user.id] = false;
    });
    return initialFollowed;
  });

  useEffect(() => {
    followsService
      .follows("http://localhost:8080/follow?user_id=" + ownId)
      .then((response) => {
        if (response.data && response.data.followings) {
          const updatedFollowed = { ...userProfileFollowed };
          response.data.followings.forEach((following) => {
            updatedFollowed[following.id] = true;
          });
          setUserProfileFollowed(updatedFollowed);
        }
      })
      .catch((error) => console.log(error));
  }, []);

  const handleUserProfile = (userId) => {
    usersService
      .user(userId)
      .then((response) => {
        setUserData(response.data);
        setShowUserProfile(true);
      })
      .catch((error) => console.log(error));
  };

  const handleFilter = (event) => {
    let newFilter = event.target.value.toLowerCase();
    setFilter(newFilter);

    newFilter = newFilter.trim();

    const newItems = users.filter(
      (item) =>
        newFilter.length == 0 ||
        item.nick_name.toLowerCase().includes(newFilter) ||
        item.first_name.toLowerCase().includes(newFilter) ||
        item.last_name.toLowerCase().includes(newFilter)
    );

    if (newItems.length == 0) {
      setItems(initialItems);
      setFilterMessage("No users found");
    } else {
      setItems(newItems);
      setFilterMessage("");
    }
  };

    users.sort(function(a, b) {
        var nameA = a.nick_name || a.first_name + " " + a.last_name;
        var nameB = b.nick_name || b.first_name + " " + b.last_name;
        return nameA.localeCompare(nameB);
      });

  return (
    <>
      {showUserProfile ? (
        <User
          ownId={ownId}
          user={userData}
          key={userData.id}
          availableChats={availableChats}
          setAvailableChats={setAvailableChats}
          chatListVisible={chatListVisible}
          setChatListVisible={setChatListVisible}
        />
      ) : (
        <div className="user-list">
          <h1>Users</h1>
          <br />
          <label className="filter-label">Search users:</label>
          <div className="login-button-error">
            <input type="text" value={filter} onChange={handleFilter} />
            {filterMessage && <div className="error filter">{filterMessage}</div>}
          </div>
          <div className="user-list-list">
            {items.map((user) => {
              const userItemKey = "userItem" + user.id;
              return (
                <UserItem
                  user={user}
                  key={userItemKey}
                  handleUserProfile={handleUserProfile}
                  userProfileFollowed={userProfileFollowed[user.id]}
                  setUserProfileFollowed={(followed) => {
                    setUserProfileFollowed((prevState) => ({
                      ...prevState,
                      [user.id]: followed,
                    }));
                  }}
                />
              );
            })}
          </div>
        </div>
      )}
    </>
  );
};

export default UserList;
