import React, { useState, useEffect } from 'react'
import followsService from "../services/FollowsService"
import Followers from './Followers'
import Followings from './Followings'

const Follows = (props) => {
    const followUrl = 'http://localhost:8080/follow?user_id=' + props.userId
    const [follows, setFollows] = useState(null)
    const [followersVisible, setFollowersVisible] = useState(false)
    const [followingsVisible, setFollowingsVisible] = useState(false)

    useEffect(() => {
        followsService.follows(followUrl)
            .then(response => {
                setFollows(response.data)
            })
    }, [])

    const toggleFollowers = () => {
        setFollowersVisible(!followersVisible)
    }

    const toggleFollowings = () => {
        setFollowingsVisible(!followingsVisible)
    }

    return (
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
    )
}

export default Follows
