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
    console.log("handle login")

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
      {unauthorizedAccess ? <div>Invalid credentials. Please login again.</div> : null}
      <form onSubmit={handleLogin}>
        <div className="input-container">
          <input type="email" id="email" value={email} onChange={handleEmailChange}/>
          <label>Email:</label>
        </div>
        <div className="input-container">
          <input type="password" id="password" value={password} onChange={handlePasswordChange}/>
          <label>Password:</label>
        </div>   
        <div>
          <button type="submit">Login</button>
        </div>
      </form>
    </div>
  );  
}

export default LoginForm
