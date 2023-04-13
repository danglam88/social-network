import axios from 'axios'

const registerUrl = 'http://localhost:8080/register'

const config = {
    mode: 'no-cors',
    headers : {
      'Content-Type': 'application/x-www-form-urlencoded',
    }
  };

const register = async data => {
    console.log(data)

    const request = axios.post(registerUrl, data, config)
    return request.then(response => response.data)
}

const registerService = {
    register: register
}

export default registerService
