import React, { useState, useEffect } from 'react'
import perProfileService from "../services/PerProfileService"
import loginService from "../services/LoginService"
import Chat from './Chat'
import WebSocketService from '../services/WebSocketService'
import GroupList from './GroupList'
import NotificationIcon from './NotificationIcon'
import Posts from './Posts'
import PostForm from './PostForm'
import postsService from '../services/PostsService'
import PersonalInfo from './PersonalInfo'
import usersService from "../services/UsersService"
import UserList from './UserList'
import followsService from "../services/FollowsService"
import Followers from './Followers'
import Followings from './Followings'
import groupService from '../services/GroupsService'

const PersonalProfile = () => {
  const [data, setData] = useState({
    id: "",
    firstName: "",
    lastName: "",
    birthDate: "",
    isPrivate: "",
    email: "",
    createdAt: "",
    avatarUrl: "",
    nickname: "",
    aboutMe: "",
  });

  WebSocketService.connect("ws://localhost:8080/ws");

  const [posts, setPosts] = useState([])
  const [follows, setFollows] = useState(null)
  const [followersVisible, setFollowersVisible] = useState(false)
  const [followingsVisible, setFollowingsVisible] = useState(false)

  useEffect(() => {
    perProfileService
      .perprofile(data)
      .then((response) => {
        setData({
          id: response.data.id,
          firstName: response.data.first_name,
          lastName: response.data.last_name,
          birthDate: response.data.birth_date,
          isPrivate: response.data.is_private,
          email: response.data.email,
          createdAt: response.data.created_at,
          avatarUrl: response.data.avatar_url,
          nickname: response.data.nick_name,
          aboutMe: response.data.about_me,
        });

        postsService.posts('http://localhost:8080/post?creator_id=' + response.data.id)
          .then(response => {
            setPosts(response.data) 
          })
          .catch((error) => console.log(error))

        followsService.follows('http://localhost:8080/follow?user_id=' + response.data.id)
          .then(response => {
              setFollows(response.data)
          })
          .catch(error => console.log(error))
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

        document.cookie = "session_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        sessionStorage.removeItem("userid");
        sessionStorage.removeItem("username");
        window.location.reload();
      })
      .catch((error) => console.log(error));
  };

  const toggleFollowers = () => {
    setFollowersVisible(!followersVisible)
  }

  const toggleFollowings = () => {
    setFollowingsVisible(!followingsVisible)
  }

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
    usersService.users()
      .then(response => {
        setUsers(response.data)
      })
      .catch(error => console.log(error))
  }, []);

  useEffect(() => {
    groupService.groups()
      .then(response => {
        setGroups(response.data)
      })
      .catch(error => console.log(error))
  }, []);

  return (
    <div>
      <div className="App-header">
        {data.nickname ? (
          <div>
            WELCOME <span onClick={handleShowPersonalProfile}><i><u>{data.nickname}</u></i></span>!
          </div>
        ) : (
          <div>
            WELCOME <span onClick={handleShowPersonalProfile}><i><u>{data.firstName} + " " + {data.lastName}</u></i></span>!
          </div>
        )}
        <NotificationIcon />
        <form onSubmit={handleLogout}>
          <button type="submit">Logout</button>
        </form>
      </div>
      <div>
        {users.length > 0 &&
        <div>
          <button onClick={handleSetUsersVisible}>Show Users</button>
          {usersVisible && <UserList users={users} />}
        </div>}
        {groups.length > 0 &&
        <div>
          <button onClick={handleSetGroupsVisible}>Show Groups</button>
          {groupsVisible && <GroupList />}
        </div>}
        {showPersonalProfile ? (
          <div>
            <PersonalInfo data={data} />
            <div>
            {follows &&
              <div>
                {follows.followers.length > 0 &&
                <div>
                  <button onClick={toggleFollowers}>Show/Hide Followers</button>
                  {followersVisible && <Followers followers={follows.followers} />}
                </div>}
                {follows.followings.length > 0 &&
                <div>
                  <button onClick={toggleFollowings}>Show/Hide Followings</button>
                  {followingsVisible && <Followings followings={follows.followings} />}
                </div>}
              </div>}
            </div>
            <PostForm />
            {posts && <Posts posts={posts} />}
            <Chat />
          </div>) : null}
      </div>
    </div>
  )
}

export default PersonalProfile;
