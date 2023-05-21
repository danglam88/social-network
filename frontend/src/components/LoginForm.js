import React, { useState } from 'react'
import loginService from "../services/LoginService"

const LoginForm = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [unauthorizedAccess, setUnauthorizedAccess] = useState(false)

  const handleEmailChange = (event) => {
    setEmail(event.target.value)
  } 
  
  const handlePasswordChange = (event) => {
    setPassword(event.target.value)
  }

  const handleLogin = (event) => {
    event.preventDefault()

    const data = { email, password }

    loginService.login(data)
      .then(response => {
        document.cookie = `session_token=${response.data.token}; path=/;`;
        sessionStorage.setItem("userid", response.data.user_id);
        sessionStorage.setItem("username", response.data.user_name);
        window.location.reload();
      })
      .catch(error => {
        console.log(error)
        setUnauthorizedAccess(true)
      })
  }

  return (
    <div>
      <form onSubmit={handleLogin}>
        <div className="input-container">
          <input type="email" id="email" value={email} onChange={handleEmailChange}/>
          <label>Email:</label>
        </div>
        <div className="input-container">
          <input type="password" id="password" value={password} onChange={handlePasswordChange}/>
          <label>Password:</label>
        </div>   
        <div className="login-button-error">
          <button type="submit">Login</button>
          {unauthorizedAccess && <div className="error login">Invalid credentials.<br/>Please login again.</div>}
        </div>
      </form>
    </div>
  );  
}

export default LoginForm
