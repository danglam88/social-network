import React, { useState } from "react";
import perProfileService from "../services/PerProfileService";

const PersonalInfo = ({user, type, handleUpdateFollows}) => {
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
        <div className="personal-info">
          <div>First Name: {user.first_name}</div>
          <div>Last Name: {user.last_name}</div>
          <div>Birth Date: {user.birth_date}</div>
          {profilePrivate ? <div>Private Profile {type === "own" && <button onClick={handleTogglePrivacy}>Change to Public</button>}</div> : <div>Public Profile {type === "own" && <button onClick={handleTogglePrivacy}>Change to Private</button>}</div>}
          <div>Email: {user.email}</div>
          <div>Member Since: {user.created_at}</div>
          {user.avatar_url &&
            <div>
              Avatar:
              <img
                src={`http://localhost:8080${user.avatar_url}`}
                alt="Avatar Image"
              />
            </div>}
          {user.nick_name && <div>Nick Name: {user.nick_name}</div>}
          {user.about_me && <div>About Me: {user.about_me}</div>}
        </div>
    )
}

export default PersonalInfo
