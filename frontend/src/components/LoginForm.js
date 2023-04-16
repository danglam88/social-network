import { useState } from 'react'
import loginService from "../services/LoginService"

const LoginForm = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleEmailChange = (event) => {
    setEmail(event.target.value)
  } 
  
  const handlePasswordChange = (event) => {
    setPassword(event.target.value)
  }

  const handleLogin = (event) => {
    event.preventDefault()
    console.log("handle login")

    const data = {
        email: email,
        password: password
    }
 
    loginService.login(data)
      .then(response => {
        document.cookie = `session_token=${response.data.Token}; path=/;`;
        sessionStorage.setItem("userid", response.data.UserId);
        sessionStorage.setItem("username", response.data.Username);
        window.location.href = "/perprofile";
      })
      .catch(error => console.log(error))
  }

  return (
    <form onSubmit={handleLogin}>
    <div>
    email: <input value={email} onChange={handleEmailChange}/>
    </div>
    <div>
    password: <input type="password" value={password} onChange={handlePasswordChange}/>
    </div>   
    <div>
      <button type="submit">Login</button>
    </div>
  </form>
  )
}

export default LoginForm
