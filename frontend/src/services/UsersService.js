import axios from 'axios'
import config from './PerProfileService'

const usersUrl = 'http://localhost:8080/allusers'

const users = async () => {
    const request = await axios.get(usersUrl, config)
    return request
}

const usersService = { users }

export default usersService
