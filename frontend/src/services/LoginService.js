import axios from 'axios'

const loginUrl = 'http://localhost:8080/login'
const logoutUrl = 'http://localhost:8080/logout'

export const config = {
  mode: 'no-cors',
  headers : {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
};

const login = async data => {
  console.log(data)

  const request = await axios.post(loginUrl, data, config)
  return request
}

const logout = async data => {
  console.log(data)

  const request = await axios.post(logoutUrl, data, config)
  return request
}

const loginService = { login, logout }

export default loginService
