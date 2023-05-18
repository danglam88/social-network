import React, { useState, useEffect } from "react";
import perProfileService from "../services/PerProfileService";
import FollowsWrapper from "./FollowsWrapper";
import followsService from "../services/FollowsService";
import usersService from '../services/UsersService';
import postsService from '../services/PostsService';
import ChatService from '../services/ChatService';

const PersonalInfo = ({ownId, user, type, handleUpdateFollows, follows, setPosts, setChatNotAllowed}) => {
    const [userProfileFollowed, setUserProfileFollowed] = useState(false)
    const [userProfilePending, setUserProfilePending] = useState(false)
    const [check_pending, setCheckPending] = useState(true)
    const [updatedUser, setUpdatedUser] = useState(user)
    const [followValue, setFollowValue] = useState(false)
    const [exclusive, setExclusive] = useState(false)
    const [profilePrivate, setProfilePrivate] = useState(updatedUser.is_private === 1)

    const privacyIconPath = 'http://localhost:8080/upload/'

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
      if (type === "user") {
        followsService
          .checkfollow('http://localhost:8080/checkfollow?user_id=' + updatedUser.id)
          .then((response) => {
            if (response.data.Error === "Yes") {
              setExclusive(true)
            }
          })
          .catch((error) => console.log(error));

        if (updatedUser.is_private === 1) {
          setProfilePrivate(true)
        } else {
          setProfilePrivate(false)
        }
      }
    }, [updatedUser])

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

                  if (type === "user") {
                    postsService
                      .posts('http://localhost:8080/visible?creator_id=' + updatedUser.id)
                      .then((response) => {
                        setPosts(response.data);
                      })
                      .catch((error) => console.log(error));

                    ChatService
                      .checkChat('http://localhost:8080/checkchat?user_id=' + updatedUser.id)
                      .then((response) => {
                        if (response.data.Error === "Chat not allowed") {
                          setChatNotAllowed(true);
                        }
                      })
                      .catch((error) => console.log(error));

                    if (!followValue && updatedUser.is_private) {
                      setExclusive(true)
                    } else {
                      handleUpdateFollows(updatedUser.id)
                    }
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
                  handleUpdateFollows(updatedUser.id)
                }
            })
            .catch(error => console.log(error))
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
      <div className="personal-info main-wrapper">
        <div className="personal-info-column">
          {updatedUser.avatar_url && (
            <div>
              <img
                className="personal-avatar"
                src={`http://localhost:8080${updatedUser.avatar_url}`}
                alt="Avatar Image"
              />
            </div>
          )}
          {updatedUser.about_me && !exclusive && <div>About Me: {updatedUser.about_me}</div>}
        </div>
        <div className="personal-info-column">
          {updatedUser.nick_name && !exclusive && (
            <div>Nick Name: {updatedUser.nick_name}</div>
          )}
          {!exclusive && (
            <div>
              <div>First Name: {updatedUser.first_name}</div>
              <div>Last Name: {updatedUser.last_name}</div>
              <div>Birth Date: {updatedUser.birth_date}</div>
            </div>
          )}
          {profilePrivate ? (
            <div>
              <img className="avatar-symbol" src={`${privacyIconPath}private.png`} />
              Private Profile{" "}
              {type === "own" && (
                <button className='privacy' onClick={handleTogglePrivacy}>
                  <img
                    className="avatar-symbol privacy-icon"
                    src={`${privacyIconPath}public.png`}
                  ></img>
                  Change to Public
                </button>
              )}
            </div>
          ) : (
            <div>
              <img className="avatar-symbol" src={`${privacyIconPath}public.png`} />
              Public Profile{" "}
              {type === "own" && (
                <button className='privacy' onClick={handleTogglePrivacy}>
                  <img
                    className="avatar-symbol privacy-icon"
                    src={`${privacyIconPath}private.png`}
                  ></img>Change to Private</button>
              )}
            </div>
          )}
          {!exclusive && (
            <div>
              <div>Email: {updatedUser.email}</div>
              <div>
                Member Since:{" "}
                {updatedUser.created_at.replace("T", " ").replace("Z", "")}
              </div>
            </div>
          )}
          {type === "user" && userProfilePending ? (
            <button className="button-small pending-users">Pending</button>
          ) : type === "user" && userProfileFollowed ? (
            <button
              className="button-small unfollow-users"
              onClick={() => {
                toggleFollow(false);
              }}
            >
              Unfollow
            </button>
          ) : (
            type === "user" && (
              <button
                className="button-small follow-users"
                onClick={() => {
                  toggleFollow(true);
                }}
              >
                Follow
              </button>
            )
          )}
          {follows && !exclusive && (
            <div className="follow">
              {follows.followers && follows.followers.length > 0 && (
                <FollowsWrapper
                  userId={follows.user_id}
                  follows={follows.followers}
                  title="Followers"
                  handleShowPendings={handleUpdateFollows}
                />
              )}
              {follows.followings && follows.followings.length > 0 && (
                <FollowsWrapper
                  userId={follows.user_id}
                  follows={follows.followings}
                  title="Followings"
                  handleShowPendings={handleUpdateFollows}
                />
              )}
            </div>
          )}
        </div>
      </div>
    );
}

export default PersonalInfo
