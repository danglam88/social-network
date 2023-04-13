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
            console.log("handle register")

            const data = {
                email: email,
                password: password,
                password2: password2,
                firstName: firstName,
                lastName: lastName,
                dateOfBirth: dateOfBirth,
                avatar: avatar,
                nickname: nickname,
                aboutMe: aboutMe
            }

            registerService.register(data).then(response => console.log(response))
        }

        return (
            <form onSubmit={handleRegister}>
                <div>
                    email: <input value={email} onChange={handleEmailChange} />
                </div>
                <div>
                    password: <input type="password" value={password} onChange={handlePasswordChange} />
                </div>
                <div>
                    password2: <input type="password" value={password2} onChange={handlePassword2Change} />
                </div>
                <div>
                    firstName: <input value={firstName} onChange={handleFirstNameChange} />
                </div>
                <div>
                    lastName: <input value={lastName} onChange={handleLastNameChange} />
                </div>
                <div>
                    dateOfBirth: <input value={dateOfBirth} onChange={handleDateOfBirthChange} />
                </div>
                <div>
                    avatar: <input value={avatar} onChange={handleAvatarChange} />
                </div>
                <div>
                    nickname: <input value={nickname} onChange={handleNicknameChange} />
                </div>
                <div>
                    aboutMe: <input value={aboutMe} onChange={handleAboutMeChange} />
                </div>
                <div>
                    <button type="submit">Register</button>
                </div>
            </form>
        )
    }

    export default RegisterForm

    



