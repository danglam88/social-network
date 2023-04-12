import axios from 'axios'

const loginUrl = 'http://localhost:8080/login'

const config = {
    mode: 'no-cors',
    headers : {
      'Content-Type': 'application/x-www-form-urlencoded',
    }
  };

const login = data => {
    console.log(data)

    const request = axios.post(loginUrl, data, config)
    return request.then(response => response.data)
}

const logout = data => {
    console.log(data)
}

const loginService = { 
    login: login,
    logout: logout
}

export default loginService