import axios from 'axios'

const loginUrl = 'http://localhost:8080/login'
const logoutUrl = 'http://localhost:8080/logout'

const clientToken = document.cookie
  .split("; ")
  .find((row) => row.startsWith("session_token="))
  ?.split("=")[1];

const postConfig = {
  mode: 'no-cors',
  headers : {
    "Authorization": `Bearer ${clientToken}`,
    'Content-Type': 'application/x-www-form-urlencoded'
  }
};

const login = async data => {
  console.log(data)

  const request = await axios.post(loginUrl, data, postConfig)
  return request
}

const logout = async data => {
  console.log(data)

  const request = await axios.post(logoutUrl, data, postConfig)
  return request
}

const loginService = { login, logout }

export default loginService
