import React, { useState, useEffect } from 'react';
import usersService from '../services/UsersService';
import User from './User';
import followsService from "../services/FollowsService";

const UserItem = ({ownId, user, handleUserProfile}) => {
    const [userProfileFollowed, setUserProfileFollowed] = useState(false)
    const [userProfilePending, setUserProfilePending] = useState(false)
    const [check_pending, setCheckPending] = useState(true)
    const [updatedUser, setUpdatedUser] = useState(user)
    const [followValue, setFollowValue] = useState(false)
    const [privacyImage, setPrivacyImage] = useState("http://localhost:8080/upload/public.png")
    const [privacyText, setPrivacyText] = useState("Public")

    useEffect(() => {
        if (updatedUser.is_private) {
            setPrivacyImage("http://localhost:8080/upload/private.png")
            setPrivacyText("Private")
        }

        followsService
            .follows("http://localhost:8080/follow?user_id=" + ownId)
            .then((response) => {
                if (response.data && response.data.followings) {
                    response.data.followings.forEach(following => {
                        if (following.id === updatedUser.id) {
                            setUserProfileFollowed(true)
                        }
                    })
                }
            })
            .catch((error) => console.log(error));
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
            .user(updatedUser.id)
            .then((response) => {
                setUpdatedUser(response.data);
            })
            .then(() => {
                setCheckPending(false)
            })
            .catch((error) => console.log(error));
    }

    return (
        <div className="user-item">
            {updatedUser.nick_name ? (
                <div className="user-profile-name" onClick={() => {handleShowUserProfile(updatedUser.id)}}>
                    <img className="avatar-symbol" src={`http://localhost:8080${updatedUser.avatar_url}`} />
                    <div>{updatedUser.nick_name} <img className="avatar-symbol" src={privacyImage} alt={privacyText} /></div>
                </div>
            ) : (
                <div className="user-profile-name" onClick={() => {handleShowUserProfile(updatedUser.id)}}>
                    <img className="avatar-symbol" src={`http://localhost:8080${updatedUser.avatar_url}`} />
                    <div>{updatedUser.first_name} {updatedUser.last_name} <img className="avatar-symbol" src={privacyImage} alt={privacyText} /></div>
                </div>
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

const UserList = ({ownId, users, showUserProfile, setShowUserProfile}) => {
    const [userData, setUserData] = useState({})
    const [filter, setFilter] = useState("")
    const [items, setItems] = useState(users)
    const [initialItems, setInitialItems] = useState(users)
    const [filterMessage, setFilterMessage] = useState("")

    const handleUserProfile = (userId) => {
        usersService.user(userId)
            .then(response => {
                setUserData(response.data)
                setShowUserProfile(true)
            })
            .catch(error => console.log(error))
    }

    const handleFilter = (event) => {

        let newFilter = event.target.value.toLowerCase()
        setFilter(newFilter)

        newFilter = newFilter.trim()

        const newItems = users.filter((item => newFilter.length == 0 || item.nick_name.toLowerCase().includes(newFilter) || item.first_name.toLowerCase().includes(newFilter) || item.last_name.toLowerCase().includes(newFilter))) 

        if (newItems.length == 0) {
            setItems(initialItems)
            setFilterMessage("No users found")
        } else {
            setItems(newItems)
            setFilterMessage("")
        } 
    }

    return (
        <>
            {showUserProfile ? (<User ownId={ownId} user={userData} key={userData.id} />) : (
                <div className="user-list">
                    <h1>Users</h1>
                    <br />
                    <label className='filter-label'>Search an user:</label>
                    <input type="text" value={filter} onChange={handleFilter}/>
                    <div className={filterMessage.length > 0 ? 'error filter' : 'hidden'}>{filterMessage}</div>
                    <div className='user-list-list'>
                    {items.map(user => {
                        const userItemKey = "userItem" + user.id;
                        return <UserItem ownId={ownId} user={user} key={userItemKey} handleUserProfile={handleUserProfile} />
                    })}
                    </div>
                </div>
            )}
        </>
    )
}

export default UserList;
