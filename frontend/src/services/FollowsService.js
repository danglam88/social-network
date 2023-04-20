import axios from 'axios'
import config from './PerProfileService'

const follows = async (followUrl) => {
    const request = await axios.get(followUrl, config)
    return request
}

const followsService = { follows }

export default followsService
