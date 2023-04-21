import React, { useState, useEffect } from 'react'
import perProfileService from "../services/PerProfileService"
import loginService from "../services/LoginService"
import Chat from './Chat'
import WebSocketService from '../services/WebSocketService'
import GroupList from './GroupList'
import NotificationIcon from './NotificationIcon'
import Posts from './Posts'
import Follows from './Follows'
import PostForm from './PostForm'
import postsService from '../services/PostsService'
import Users from './Users'

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

    return (
        <div>
            {data.id && data.firstName && data.lastName && data.birthDate && data.email && data.createdAt &&
            <div>
                <div className="App-header">
                    <div>
                        <NotificationIcon />
                    </div>
                </div>
                <div>
                    User {data.email} has been logged-in successfully.
                    <form onSubmit={handleLogout}>
                        <button type="submit">Logout</button>
                    </form>
                    <ul>
                        <li>ID: {data.id}</li>
                        <li>First Name: {data.firstName}</li>
                        <li>Last Name: {data.lastName}</li>
                        <li>Birth Date: {data.birthDate}</li>
                        <li>Is Private: {data.isPrivate}</li>
                        <li>Email: {data.email}</li>
                        <li>Created At: {data.createdAt}</li>
                        <li>Avatar Url: {data.avatarUrl}</li>
                        <li>Nick Name: {data.nickname}</li>
                        <li>About Me: {data.aboutMe}</li>
                    </ul>
                    <PostForm />
                    <Posts posts={posts} />
                    <Follows userId={data.id}/>
                    <Users />
                    <GroupList />
                    <Chat />
                </div>
            </div>}
        </div>
    )
}

export default PersonalProfile;
