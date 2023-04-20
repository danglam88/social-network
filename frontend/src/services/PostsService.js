import axios from 'axios'
import config from './PerProfileService'

const posts = async (postUrl) => {
    const request = await axios.get(postUrl, config)
    return request
}

const postsService = { posts }

export default postsService
