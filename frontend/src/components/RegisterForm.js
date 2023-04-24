import { useState } from 'react'
import registerService from "../services/RegisterService"

const RegisterForm = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [password2, setPassword2] = useState('')
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [dateOfBirth, setDateOfBirth] = useState('')
    const [avatar, setAvatar] = useState('') //optional
    const [nickname, setNickname] = useState('') //optional
    const [aboutMe, setAboutMe] = useState('') //optional

        const handleEmailChange = (event) => {
            setEmail(event.target.value)
        }
        const handlePasswordChange = (event) => {
            setPassword(event.target.value)
        }
        const handlePassword2Change = (event) => {
            setPassword2(event.target.value)
        }
        const handleFirstNameChange = (event) => {
            setFirstName(event.target.value)
        }
        const handleLastNameChange = (event) => {
            setLastName(event.target.value)
        }
        const handleDateOfBirthChange = (event) => {
            setDateOfBirth(event.target.value)
        }
        const handleAvatarChange = (event) => {
            setAvatar(event.target.value)
        }
        const handleNicknameChange = (event) => {
            setNickname(event.target.value)
        }
        const handleAboutMeChange = (event) => {
            setAboutMe(event.target.value)
        }

        const handleRegister = (event) => {
            event.preventDefault()
            const formData = new FormData(event.target);

            registerService.register(formData)

        }

        return (
            <form onSubmit={handleRegister}>
                <div className="input-container">
                    <input type="email" name="email" value={email} onChange={handleEmailChange} placeholder=" " required />
                    <label>Email</label>
                </div>
                <div className="input-container">
                    <input type="password" name="password" value={password} onChange={handlePasswordChange} placeholder=" " required />
                    <label>Password</label>
                </div>
                <div className="input-container">
                    <input type="password" name="password2" value={password2} onChange={handlePassword2Change} placeholder=" " required />
                    <label>Confirm Password</label>
                </div>
                <div className="input-container">
                    <input type="text" name="firstName" value={firstName} onChange={handleFirstNameChange} placeholder=" " required />
                    <label>First Name</label>
                </div>
                <div className="input-container">
                    <input type="text" name="lastName" value={lastName} onChange={handleLastNameChange} placeholder=" " required />
                    <label>Last Name</label>
                </div>
                <div className="input-container">
                    <input type="date" name="dateOfBirth" value={dateOfBirth} onChange={handleDateOfBirthChange} placeholder=" " required />
                    <label>Date of Birth</label>
                </div>
                <div className="input-container">
                    <input type="text" name="avatar" value={avatar} onChange={handleAvatarChange} placeholder=" " />
                    <label>Avatar URL</label>
                </div>
                <div className="input-container">
                    <input type="text" name="nickname" value={nickname} onChange={handleNicknameChange} placeholder=" " />
                    <label>Nickname</label>
                </div>
                <div className="input-container">
                    <input type="text" name="aboutMe" value={aboutMe} onChange={handleAboutMeChange} placeholder=" " />
                    <label>About Me</label>
                </div>
                <div>
                    <button type="submit">Register</button>
                </div>
            </form>
        )
}

export default RegisterForm
