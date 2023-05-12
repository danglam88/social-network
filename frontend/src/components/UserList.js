import React, { useState, useEffect } from 'react';
import usersService from '../services/UsersService';
import User from './User';
import followsService from "../services/FollowsService";

const UserItem = ({user, users, setUsers, followings, handleUserProfile}) => {
    const [userProfileFollowed, setUserProfileFollowed] = useState(false)
    const [userProfilePending, setUserProfilePending] = useState(false)
    const [check_pending, setCheckPending] = useState(true)
    const [updatedUser, setUpdatedUser] = useState(user)
    const [followValue, setFollowValue] = useState(false)

    useEffect(() => {
        if (followings !== null) {
            followings.forEach(following => {
                if (following.id === updatedUser.id) {
                    setUserProfileFollowed(true)
                }
            })
        }
    }, [])

    useEffect(() => {
        const user_id = updatedUser.id

        followsService.follow({user_id, check_pending})
            .then(response => {
                if (response.data.Error === "Pending") {
                    setUserProfilePending(true)
                }
            })
            .then(() => {
                if (!check_pending) {
                    if (!followValue || !updatedUser.is_private) {
                        setUserProfileFollowed(!userProfileFollowed)
                    } else {
                        setUserProfilePending(true)
                    }
                }
            })
            .then(() => {
                setCheckPending(true)
            })
            .catch(error => console.log(error))
    }, [check_pending])

    const handleShowUserProfile = (userId) => {
        handleUserProfile(userId)
    }

    const toggleFollow = (follow) => {
        setFollowValue(follow)

        usersService
            .users()
            .then((response) => {
                setUsers(response.data);
            })
            .then(() => {
                setUpdatedUser(users.find(u => u.id === updatedUser.id))
            })
            .then(() => {
                setCheckPending(false)
            })
            .catch((error) => console.log(error));
    }

    return (
        <div className="user-item">
            {updatedUser.nick_name ? (
                <span onClick={() => {handleShowUserProfile(updatedUser.id)}}><img className="avatar-symbol" src={`http://localhost:8080${updatedUser.avatar_url}`}/>{updatedUser.nick_name}</span>
            ) : (
                <span onClick={() => {handleShowUserProfile(updatedUser.id)}}><img className="avatar-symbol" src={`http://localhost:8080${updatedUser.avatar_url}`}/>{updatedUser.first_name} {updatedUser.last_name}</span>
            )}

            {userProfilePending ? (
                <button className="button-small pending-users">Pending</button>
            ) : (
                userProfileFollowed ? (
                    <button className="button-small unfollow-users" onClick={() => {toggleFollow(false)}}>Unfollow</button>
                ) : (
                    <button className="button-small follow-users" onClick={() => {toggleFollow(true)}}>Follow</button>
                )
            )}
        </div>
    )
}

const UserList = ({users, setUsers, followings, showUserProfile, setShowUserProfile}) => {
    const [userData, setUserData] = useState({})

    const handleUserProfile = (userId) => {
        usersService.user(userId)
            .then(response => {
                setUserData(response.data)
                setShowUserProfile(true)
            })
            .catch(error => console.log(error))
    }

    return (
        <div>
            {showUserProfile ? (<User user={userData} key={userData.id} />) : (
                <div>
                    <h1>Users</h1>
                    <br />
                    {users.map(user => {
                        const userItemKey = "userItem" + user.id;
                        return <UserItem user={user} users={users} setUsers={setUsers} key={userItemKey} followings={followings} handleUserProfile={handleUserProfile} />
                    })}
                </div>
            )}
        </div>
    )
}

export default UserList;
