import React, { useState } from 'react'
import usersService from '../services/UsersService'
import User from './User'

const UserItem = ({user, handleUserProfile}) => {
    const handleShowUserProfile = (userId) => {
        handleUserProfile(userId)
    }

    return (
        <div>
            {user.nick_name ? (
                <span onClick={() => handleShowUserProfile(user.id)}>{user.nick_name}</span>
            ) : (
                <span onClick={() => handleShowUserProfile(user.id)}>{user.first_name} {user.last_name}</span>
            )}
        </div>
    )
}

const UserList = ({users}) => {
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
                        <UserItem user={user} key={user.id} handleUserProfile={handleUserProfile} />
                    )}
                </div>
            )}
        </div>
    )
}

export default UserList;
