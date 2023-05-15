import React, { useState, useEffect } from "react";
import perProfileService from "../services/PerProfileService";
import FollowsWrapper from "./FollowsWrapper";
import followsService from "../services/FollowsService";
import usersService from '../services/UsersService';

const PersonalInfo = ({ownId, user, type, handleUpdateFollows, follows, limitedInfo, users, setUsers, setShowUserProfile}) => {
    const [profilePrivate, setProfilePrivate] = useState(user.is_private === 1)
    const [userProfileFollowed, setUserProfileFollowed] = useState(false)
    const [userProfilePending, setUserProfilePending] = useState(false)
    const [check_pending, setCheckPending] = useState(true)
    const [updatedUser, setUpdatedUser] = useState(user)
    const [followValue, setFollowValue] = useState(false)

    useEffect(() => {
      if (type === "user") {
        followsService
          .follows('http://localhost:8080/follow?user_id=' + ownId)
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

                  if (type === "user" && !followValue && updatedUser.is_private) {
                    setShowUserProfile(false)
                  } else if (type === "user") {
                    handleUpdateFollows(updatedUser.id)
                  }
              }
          })
          .then(() => {
              setCheckPending(true)
          })
          .catch(error => console.log(error))
  }, [check_pending])

    const handleTogglePrivacy = () => {
        setProfilePrivate(!profilePrivate)

        perProfileService.privacy({})
            .then(response => {
                if (response.data.Status === "ok") {
                  handleUpdateFollows(user.id)
                }
            })
            .catch(error => console.log(error))
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
        <div className="personal-info main-wrapper">
          <div className="personal-info-column">
            {user.avatar_url &&
              <div>
                <img className="personal-avatar"
                  src={`http://localhost:8080${user.avatar_url}`}
                  alt="Avatar Image"
                />
              </div>}
            {user.about_me && !limitedInfo && <div>About Me: {user.about_me}</div>}
          </div>
          <div className="personal-info-column">
            {user.nick_name && !limitedInfo && <div>Nick Name: {user.nick_name}</div>}
            {!limitedInfo &&
            <div>
              <div>First Name: {user.first_name}</div>
              <div>Last Name: {user.last_name}</div>
              <div>Birth Date: {user.birth_date}</div>
            </div>}
            {profilePrivate ? <div>Private Profile {type === "own" && <button onClick={handleTogglePrivacy}>Change to Public</button>}</div> : <div>Public Profile {type === "own" && <button onClick={handleTogglePrivacy}>Change to Private</button>}</div>}
            {!limitedInfo &&
            <div>
              <div>Email: {user.email}</div>
              <div>Member Since: {user.created_at.replace("T", " ").replace("Z", "")}</div>
            </div>}
            {type === "user" && userProfilePending ? (
              <button className="button-small pending-users">Pending</button>
            ) : (
              type === "user" && userProfileFollowed ? (
                <button className="button-small unfollow-users" onClick={() => {toggleFollow(false)}}>Unfollow</button>
              ) : (
                type === "user" && <button className="button-small follow-users" onClick={() => {toggleFollow(true)}}>Follow</button>
              )
            )}
            {follows && !limitedInfo && (
              <div className="follow">
                {follows.followers && follows.followers.length > 0 && <FollowsWrapper userId={follows.user_id} follows={follows.followers} title="Followers" handleShowPendings={handleUpdateFollows} />}
                {follows.followings && follows.followings.length > 0 && <FollowsWrapper userId={follows.user_id} follows={follows.followings} title="Followings" handleShowPendings={handleUpdateFollows} />}
                {type === "own" && follows.pendings && follows.pendings.length > 0 && <FollowsWrapper userId={follows.user_id} follows={follows.pendings} title="Pendings" handleShowPendings={handleUpdateFollows} />}
              </div>
            )}
          </div>
        </div>
    )
}

export default PersonalInfo
