import React, { useState, useEffect } from 'react'
import PersonalInfo from './PersonalInfo'
import Posts from './Posts'
import postsService from '../services/PostsService'
import followsService from "../services/FollowsService"
import FollowsWrapper from './FollowsWrapper'
import ChatWindow from './ChatWindow'

const User = ({ user }) => {
    const [posts, setPosts] = useState([])
    const [follows, setFollows] = useState(null)
    const [showChatWindow, setShowChatWindow] = useState(false);

    useEffect(() => {
        postsService.posts('http://localhost:8080/post?creator_id=' + user.id)
            .then(response => {
                setPosts(response.data)
            })
            .catch((error) => console.log(error))

        followsService.follows('http://localhost:8080/follow?user_id=' + user.id)
            .then(response => {
                setFollows(response.data)
            })
            .catch((error) => console.log(error))
    }, [])

    const toggleChatWindow = () => {
        setShowChatWindow((prevShowChatWindow) => !prevShowChatWindow);
      }; // new function to toggle chat window
    
      return (
        <div>
          <h2>User Profile</h2>
          <PersonalInfo user={user} />
          <div>
            {follows && (
              <div>
                {follows.followers && (
                  <FollowsWrapper follows={follows.followers} title="Follower(s):" />
                )}
                {follows.followings && (
                  <FollowsWrapper follows={follows.followings} title="Following(s):" />
                )}
              </div>
            )}
          </div>
          {posts && <Posts posts={posts} />}
          <button onClick={toggleChatWindow}>
            {showChatWindow ? 'Close Chat' : 'Open Chat'} 
          </button>
          {showChatWindow && <ChatWindow chat={{ GroupID: 0, ChatID: user.id }} />}
        </div>
      );
    };

export default User
