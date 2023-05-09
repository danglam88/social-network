import { useState } from 'react'
import registerService from "../services/RegisterService"
import ValidateField from '../services/ValidationService'
import loginService from '../services/LoginService'

const RegisterForm = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [password2, setPassword2] = useState('')
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [dateOfBirth, setDateOfBirth] = useState('')
    const [isPrivate, setPrivacy] = useState('public')
    const [picture, setAvatar] = useState('') //optional
    const [nickname, setNickname] = useState('') //optional
    const [aboutMe, setAboutMe] = useState('') //optional
    const [isAutoLogin, setAutoLogin] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')

        const handleEmailChange = (event) => {
            setEmail(event.target.value);
        };
        const handlePasswordChange = (event) => {
            setPassword(event.target.value);
        };
        const handlePassword2Change = (event) => {
            setPassword2(event.target.value);
        };
        const handleFirstNameChange = (event) => {
            setFirstName(event.target.value);
        };
        const handleLastNameChange = (event) => {
            setLastName(event.target.value);
        };
        const handleDateOfBirthChange = (event) => {
            setDateOfBirth(event.target.value);
        };
        const handlePrivacyChange = (event) => {
            setPrivacy(event.target.value);
        };
        const handleAvatarChange = (event) => {
            setAvatar(event.target.value);
        };
        const handleNicknameChange = (event) => {
            setNickname(event.target.value);
        };
        const handleAboutMeChange = (event) => {
            setAboutMe(event.target.value);
        };
        const handleAutoLoginChange = () => {
            setAutoLogin(!isAutoLogin);
        };

        const handleRegister = (event) => {
            event.preventDefault()
            const formData = new FormData(event.target);

            registerService.register(formData)
            .then(response => {
                if (response.status === 200) {
                    if (isAutoLogin) {
                        const loginData = {
                            email: email,
                            password: password
                        }
                        loginService.login(loginData)
                        .then(response => {
                            document.cookie = `session_token=${response.data.token}; path=/;`;
                            sessionStorage.setItem("userid", response.data.user_id);
                            sessionStorage.setItem("username", response.data.user_name);
                            window.location.reload();
                        })
                        .catch(error => {
                            console.log(error)
                        })
                    }else{
                    setErrorMessage('Registered with success!')
                    setEmail('')
                    setPassword('')
                    setPassword2('')
                    setFirstName('')
                    setLastName('')
                    setDateOfBirth('') 
                    setAvatar('')
                    setNickname('')
                    setAboutMe('')
                    setPrivacy('public')
                    setAutoLogin(false)
                  }
                } else {
                    setErrorMessage(`Registration failed with status ${response.status}.`)
                }
            })
            .catch(error => {
               setErrorMessage(error.response.data[0].Data[0].Message)
            })
        }

        return (
            <>
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
                    <input type="file" name="picture" value={picture} onChange={handleAvatarChange} placeholder=" " />
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
                <div className="input-container">
                    <select id="privacy" name="privacy" value={isPrivate} onChange={handlePrivacyChange}>
                        <option value="public">Public Account</option>
                        <option value="private">Private Account</option>
                    </select>
                </div>
                <div className="input-container">
                    <input type="checkbox" checked={isAutoLogin} onChange={handleAutoLoginChange} />
                    <label>Log in automatically after registration</label>
                </div>
                <div>
                    <button type="submit">Register</button>
                </div>
                {errorMessage && <div>{errorMessage}</div>}
            </form>
            </>
        )
}

export default RegisterForm

/*const createOrUpdateResultWrapper = () => {
    let resultWrapper = document.getElementById('result-wrapper')
    if (!resultWrapper) {
      resultWrapper = document.createElement('div')
      resultWrapper.id = 'result-wrapper'
    } else {
      resultWrapper.innerHTML = ''
    }
    return resultWrapper
  }*/
