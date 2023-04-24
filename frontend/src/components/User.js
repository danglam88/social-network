import React, { useState, useEffect } from 'react'
import PersonalInfo from './PersonalInfo'
import Follows from './Follows'
import Posts from './Posts'
import postsService from '../services/PostsService'
import followsService from "../services/FollowsService"

const User = ({ user }) => {
    const [posts, setPosts] = useState([])
    const [follows, setFollows] = useState(null)
    const [followersVisible, setFollowersVisible] = useState(false)
    const [followingsVisible, setFollowingsVisible] = useState(false)

    const toggleFollowers = () => {
        setFollowersVisible(!followersVisible)
      }
    
      const toggleFollowings = () => {
        setFollowingsVisible(!followingsVisible)
      }

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

    return (
        <div>
            <PersonalInfo user={user} />
            <div>
            {follows &&
              <div>
                {follows.followers.length > 0 &&
                <div>
                  <button onClick={toggleFollowers}>Show/Hide Followers</button>
                  {followersVisible && <Follows follows={follows.followers} title="Follower(s):" />}
                </div>}
                {follows.followings.length > 0 &&
                <div>
                  <button onClick={toggleFollowings}>Show/Hide Followings</button>
                  {followingsVisible && <Follows follows={follows.followings} title="Following(s):" />}
                </div>}
              </div>}
            </div>
            {posts && <Posts posts={posts} />}
        </div>
    )
}

export default User
