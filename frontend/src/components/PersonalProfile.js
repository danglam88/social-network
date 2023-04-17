import { useState, useEffect } from 'react'
import perProfileService from "../services/PerProfileService"

const PersonalProfile = () => {
    const [data, setData] = useState({
        token: "",
        id: "",
        firstName: "",
        lastName: "",
        birthDate: "",
        isPrivate: "",
        email: "",
        createdAt: "",
        avatarUrl: "",
        nickname: "",
        aboutMe: ""
    })

    useEffect(() => {
        if (document.cookie.includes("session_token")) {
            const tokens = document.cookie.split(";");
            for (let i = 0; i < tokens.length; i++) {
                if (tokens[i].includes("session_token")) {
                    setData(prevData => ({ ...prevData, token: tokens[i].split("=")[1] }))
                }
            }
        }
    }, [])

    useEffect(() => {
        if (data.token) {
            perProfileService.perprofile(data)
            .then(response => {
                setData(prevData => ({
                    ...prevData,
                    id: response.data.ID,
                    firstName: response.data.FirstName,
                    lastName: response.data.LastName,
                    birthDate: response.data.BirthDate,
                    isPrivate: response.data.IsPrivate,
                    email: response.data.Email,
                    createdAt: response.data.CreatedAt,
                    avatarUrl: response.data.AvatarUrl,
                    nickname: response.data.NickName,
                    aboutMe: response.data.AboutMe
                }))
            })
            .catch(error => console.log(error))
        }
    }, [data.token])

  return (
    <div>
        {data.id && data.firstName && data.lastName && data.birthDate && data.isPrivate && data.email && data.createdAt ?
        <div>
            User {data.email} has been logged-in successfully.
            Information is as follows:
            <ul>
                <li>ID: {data.id}</li>
                <li>First Name: {data.firstName}</li>
                <li>Last Name: {data.lastName}</li>
                <li>Birth Date: {data.birthDate}</li>
                <li>Is Private: {data.isPrivate}</li>
                <li>Email: {data.email}</li>
                <li>Created At: {data.createdAt}</li>
                <li>Avatar Url: {data.avatarUrl}</li>
                <li>Nick Name: {data.nickname}</li>
                <li>About Me: {data.aboutMe}</li>
            </ul>
            Profile page is still under-construction.
            Remove the cookie then refresh the page to see login form again.
        </div> : "Loading..."}
    </div>
  )
}

export default PersonalProfile
