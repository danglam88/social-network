import React, { useState, useEffect } from 'react'
import followsService from "../services/FollowsService"

const Follows = (props) => {
    const followUrl = 'http://localhost:8080/follow?user_id=' + props.userId
    const [follows, setFollows] = useState(null)

    useEffect(() => {
        followsService.follows(followUrl)
            .then(response => {
                setFollows(response.data)
            })
    }, [])

    return (
        <div>
            {follows &&
            <div>
                {follows.followers.length > 0 &&
                <table>
                    <thead>
                        <h2>Followers:</h2>
                        <tr>
                            <th>FirstName</th>
                            <th>LastName</th>
                            <th>Email</th>
                            <th>NickName</th>
                        </tr>
                    </thead>
                    <tbody>
                        {follows.followers.map(follower =>
                            <tr id={follower.id}>
                                <td>{follower.first_name}</td>
                                <td>{follower.last_name}</td>
                                <td>{follower.email}</td>
                                <td>{follower.nick_name}</td>
                            </tr>
                        )}
                    </tbody>
                </table>}
                {follows.followings.length > 0 &&
                <table>
                    <thead>
                        <h2>Followings:</h2>
                        <tr>
                            <th>FirstName</th>
                            <th>LastName</th>
                            <th>Email</th>
                            <th>NickName</th>
                        </tr>
                    </thead>
                    <tbody>
                        {follows.followings.map(following =>
                            <tr id={following.id}>
                                <td>{following.first_name}</td>
                                <td>{following.last_name}</td>
                                <td>{following.email}</td>
                                <td>{following.nick_name}</td>
                            </tr>
                        )}
                    </tbody>
                </table>}
            </div>}
        </div>
    )
}

export default Follows
