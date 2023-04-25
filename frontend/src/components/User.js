import React, { useState, useEffect } from 'react'
import PersonalInfo from './PersonalInfo'
import Posts from './Posts'
import postsService from '../services/PostsService'
import followsService from "../services/FollowsService"
import FollowsWrapper from './FollowsWrapper'

const User = ({ user }) => {
    const [posts, setPosts] = useState([])
    const [follows, setFollows] = useState(null)

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
            <h2>User Profile</h2>
            <PersonalInfo user={user} />
            <div>
            {follows &&
              <div>
                {follows.followers && <FollowsWrapper follows={follows.followers} title="Follower(s):" />}
                {follows.followings && <FollowsWrapper follows={follows.followings} title="Following(s):" />}
              </div>}
            </div>
            {posts && <Posts posts={posts} />}
        </div>
    )
}

export default User
