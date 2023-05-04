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

    useEffect(() => {
        if (!user.is_private) {
            setUserProfileAccessible(true)
        }

        if (followings !== null) {
            followings.forEach(following => {
                if (following.id === user.id) {
                    setUserProfileAccessible(true)
                    setUserProfileFollowed(true)
                }
            })
        }
    }, [])

    useEffect(() => {
        followsService.follow({user, check_pending})
            .then(response => {
                if (response.data.Error === "Pending") {
                    setUserProfilePending(true)
                }
            })
            .catch(error => console.log(error))
    }, [check_pending])

    const handleShowUserProfile = (userId) => {
        handleUserProfile(userId)
    }

    const toggleFollow = (follow) => {
        usersService
            .users()
            .then((response) => {
                setUsers(response.data);
            })
            .then(() => {
                user = users.find(u => u.id === user.id)
            })
            .then(() => {
                setCheckPending(false)

                if (!follow || !user.is_private) {
                    setUserProfileFollowed(!userProfileFollowed)
                    if (!follow && user.is_private) {
                        setUserProfileAccessible(false)
                    }
                } else {
                    setUserProfilePending(true)

                    //send notification
                    const payload = {
                        type: "follownotification",
                        to: parseInt(user.id),
                    };
                    WebSocketService.sendMessage(payload);
                }
            })
            .catch((error) => console.log(error));
    }

    return (
        <div>
            {user.nick_name ? (
                <span onClick={() => {userProfileAccessible && handleShowUserProfile(user.id)}}>{user.nick_name}</span>
            ) : (
                <span onClick={() => {userProfileAccessible && handleShowUserProfile(user.id)}}>{user.first_name} {user.last_name}</span>
            )}

            {userProfilePending ? (
                <span className='button-small pending-users'>Pending</span>
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
