import React, { useState } from "react";
import perProfileService from "../services/PerProfileService";
import FollowsWrapper from "./FollowsWrapper";

const PersonalInfo = ({user, type, handleUpdateFollows, follows, limitedInfo}) => {
    const [profilePrivate, setProfilePrivate] = useState(user.is_private === 1)

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
            {follows && !limitedInfo && (
              <div className="follow">
                {follows.followers && follows.followers.length > 0 && <FollowsWrapper userId={follows.user_id} follows={follows.followers} title="Followers" handleShowPendings={handleUpdateFollows} />}
                {follows.followings && follows.followings.length > 0 && <FollowsWrapper userId={follows.user_id} follows={follows.followings} title="Followings" handleShowPendings={handleUpdateFollows} />}
                {follows.pendings && follows.pendings.length > 0 && <FollowsWrapper userId={follows.user_id} follows={follows.pendings} title="Pendings" handleShowPendings={handleUpdateFollows} />}
              </div>
            )}
          </div>
        </div>
    )
}

export default PersonalInfo
