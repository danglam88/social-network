import axios from 'axios'
import { config } from './LoginService'

const registerUrl = 'http://localhost:8080/register'

const register = async data => {
    console.log(data)

    const request = axios.post(registerUrl, data, config)
    return request
}

const registerService = {
    register: register
}

export default registerService
