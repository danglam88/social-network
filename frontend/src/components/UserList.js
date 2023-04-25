import React, { useState, useEffect } from 'react'
import usersService from '../services/UsersService'
import User from './User';
import followsService from "../services/FollowsService";

const UserItem = ({user, followings, handleUserProfile}) => {
    const [userProfileAccessible, setUserProfileAccessible] = useState(false)
    const [userProfileFollowed, setUserProfileFollowed] = useState(false)
    const [userProfilePending, setUserProfilePending] = useState(false)
    const [check_pending, setCheckPending] = useState(true)

    useEffect(() => {
        followsService.follow({user, check_pending})
            .then(response => {
                if (response.data.Error === "Pending") {
                    setUserProfilePending(true)
                }
            })
            .catch(error => console.log(error))

        if (!user.is_private) {
            setUserProfileAccessible(true)
        }

        followings.forEach(following => {
            if (following.id === user.id) {
                setUserProfileAccessible(true)
                setUserProfileFollowed(true)
            }
        })
    }, []);

    const handleShowUserProfile = (userId) => {
        handleUserProfile(userId)
    }

    const toggleFollow = (follow) => {
        if (!follow || !user.is_private) {
            setUserProfileFollowed(!userProfileFollowed)
        } else {
            setUserProfilePending(true)
        }

        setCheckPending(false)
        followsService.follow({user, check_pending})
            .then(response => {
                console.log(response)
            })
            .catch(error => console.log(error))
    }

    return (
        <div>
            {user.nick_name ? (
                <span onClick={() => {userProfileAccessible && handleShowUserProfile(user.id)}}>{user.nick_name}</span>
            ) : (
                <span onClick={() => {userProfileAccessible && handleShowUserProfile(user.id)}}>{user.first_name} {user.last_name}</span>
            )}

            {userProfilePending ? (
                <span> Pending...</span>
            ) : (
                userProfileFollowed ? (
                    <button onClick={() => {toggleFollow(false)}}>Unfollow</button>
                ) : (
                    <button onClick={() => {toggleFollow(true)}}>Follow</button>
                )
            )}
        </div>
    )
}

const UserList = ({users, followings}) => {
    const [userData, setUserData] = useState({})
    const [showUserProfile, setShowUserProfile] = useState(false)

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
            {showUserProfile ? (<User user={userData} />) : (
                <div>
                    <h2>User(s):</h2>
                    {users.map(user =>
                        <UserItem user={user} key={user.id} followings={followings} handleUserProfile={handleUserProfile} />
                    )}
                </div>
            )}
        </div>
    )
}

export default UserList;
