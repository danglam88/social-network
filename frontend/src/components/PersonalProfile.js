import React, { useState, useEffect } from 'react'
import perProfileService from "../services/PerProfileService"
import loginService from '../services/LoginService'

const PersonalProfile = () => {
    const [data, setData] = useState({
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
        perProfileService.perprofile(data)
            .then(response => {
                setData({
                    id: response.data.id,
                    firstName: response.data.first_name,
                    lastName: response.data.last_name,
                    birthDate: response.data.birth_date,
                    isPrivate: response.data.is_private,
                    email: response.data.email,
                    createdAt: response.data.created_at,
                    avatarUrl: response.data.avatar_url,
                    nickname: response.data.nick_name,
                    aboutMe: response.data.about_me
                })
            })
            .catch(error => console.log(error))
    }, [])

    const handleLogout = (event) => {
        event.preventDefault()
        console.log("handle logout")

        loginService.logout({})
            .then(response => {
                console.log(response)

                document.cookie = "session_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                sessionStorage.removeItem("userid");
                sessionStorage.removeItem("username");
                window.location.reload();
            })
            .catch(error => console.log(error))
    }

    return (
        <div>
            {data.id && data.firstName && data.lastName && data.birthDate && data.isPrivate && data.email && data.createdAt ?
            <div>
                User {data.email} has been logged-in successfully.
                <form onSubmit={handleLogout}>
                    <button type="submit">Logout</button>
                </form>
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
            </div> : null}
        </div>
    )
}

export default PersonalProfile
