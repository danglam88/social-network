import axios from 'axios'

const loginUrl = 'http://localhost:8080/login'

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

const loginService = { 
    login: login
}

export default loginService
