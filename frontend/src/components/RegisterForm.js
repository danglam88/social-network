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
    const [isPublic, setPublic] = useState(true)
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
        const handlePrivateChange = () => {
            setPrivacy("private");
            setPublic(false);
        };
        const handlePublicChange = () => {
            setPrivacy("public");
            setPublic(true);
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

            let emailMessage = ValidateField("Email", email, 5, 50);
            if ( emailMessage !== "") {
                setErrorMessage(emailMessage);
                return
            }
            let passwordMessage = ValidateField("Password", password, 8, 20);
            if ( passwordMessage !== "") {
                setErrorMessage(passwordMessage);
                return
            }
            if (password !== password2) {
                setErrorMessage("Passwords do not match");
                return
            }
            let firstNameMessage = ValidateField("First name", firstName, 2, 20);
            if ( firstNameMessage !== "") {
                setErrorMessage(firstNameMessage);
                return
            }
            let lastNameMessage = ValidateField("Last name", lastName, 2, 14);
            if ( lastNameMessage !== "") {
                setErrorMessage(lastNameMessage);
                return
            }
            let dateOfBirthMessage = ValidateField("Age", dateOfBirth, 5, 120);
            if ( dateOfBirthMessage !== "") {
                setErrorMessage(dateOfBirthMessage);
                return
            }
            let nicknameMessage = ValidateField("Nickname", nickname, 2, 14);
            if ( nicknameMessage !== "") {
                setErrorMessage(nicknameMessage);
                return
            }
            let aboutMeMessage = ValidateField("About me", aboutMe, 0, 100);
            if ( aboutMeMessage !== "") {
                setErrorMessage(aboutMeMessage);
                return
            }
            if (isPrivate !== "private" && isPrivate !== "public") {
                setErrorMessage("Account must be either private or public");
                return
            }

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
                    <label>Avatar</label>
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
                    <div className="privacy-choice">
                        <div className={`privacy ${isPublic ? 'clicked' :''}`} onClick={handlePublicChange}>Public Account</div>
                        <div className={`privacy ${!isPublic ? 'clicked' :''}`} onClick={handlePrivateChange}>Private Account</div>
                    </div>
                </div>
                <div className="input-container">
                    <div className="autologin-choice-div">
                        <div className={`autologin-choice ${isAutoLogin ? 'autologin-true' :''}`} onClick={handleAutoLoginChange}>
                            {isAutoLogin ? 'YES' : 'NO'}
                        </div>
                        <div className="autologin-info">Log in automatically after registration</div>
                    </div>
                </div>
                <div>
                    <button type="submit">Register</button>
                </div>
                {errorMessage && <div className="error register-error">{errorMessage}</div>}
            </form>
            </>
        )
}

export default RegisterForm
