import axios from 'axios'

const loginUrl = 'http://localhost:8080/login'

const config = {
    mode: 'no-cors',
    headers : {
      'Content-Type': 'application/x-www-form-urlencoded',
    }
  };

const login = async data => {
    console.log(data)

    const request = await axios.post(loginUrl, data, config)
    return request.then(response => response.data).catch(error => console.log(error))
}

const logout = data => {
    console.log(data)
}

const loginService = { 
    login: login,
    logout: logout
}

export default loginService
