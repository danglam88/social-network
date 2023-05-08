import React, { useState, useEffect } from 'react';
import usersService from '../services/UsersService';
import User from './User';
import followsService from "../services/FollowsService";
import WebSocketService from '../services/WebSocketService';

const UserItem = ({user, users, setUsers, followings, handleUserProfile}) => {
    const [userProfileAccessible, setUserProfileAccessible] = useState(false)
    const [userProfileFollowed, setUserProfileFollowed] = useState(false)
    const [userProfilePending, setUserProfilePending] = useState(false)
    const [check_pending, setCheckPending] = useState(true)
    const [updatedUser, setUpdatedUser] = useState(user)
    const [followValue, setFollowValue] = useState(false)

    useEffect(() => {
        if (!updatedUser.is_private) {
            setUserProfileAccessible(true)
        }

        if (followings !== null) {
            followings.forEach(following => {
                if (following.id === updatedUser.id) {
                    setUserProfileAccessible(true)
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
                        if (!followValue && updatedUser.is_private) {
                            setUserProfileAccessible(false)
                        }
                    } else {
                        setUserProfilePending(true)

                        //send notification
                        const payload = {
                            type: "follownotification",
                            to: parseInt(updatedUser.id),
                        };
                        WebSocketService.sendMessage(payload);
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
                <span onClick={() => {userProfileAccessible && handleShowUserProfile(updatedUser.id)}}>{updatedUser.nick_name}</span>
            ) : (
                <span onClick={() => {userProfileAccessible && handleShowUserProfile(updatedUser.id)}}>{updatedUser.first_name} {updatedUser.last_name}</span>
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
                if (response.data.Status !== "error") {
                    setUserData(response.data)
                    setShowUserProfile(true)
                }
            })
            .catch(error => console.log(error))
    }

    return (
        <div>
            {showUserProfile ? (<User user={userData} key={userData.id} />) : (
                <div>
                    <h1>User(s):</h1>
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
