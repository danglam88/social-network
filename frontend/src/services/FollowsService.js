import axios from 'axios'

const followPostUrl = 'http://localhost:8080/follow'
const pendingUrl = 'http://localhost:8080/pending'

const clientToken = document.cookie
  .split("; ")
  .find((row) => row.startsWith("session_token="))
  ?.split("=")[1];

const config = {
  headers: {
    "Authorization": `Bearer ${clientToken}`,
    "Content-Type": "application/json",
  },
};

const checkfollow = async (checkUrl) => {
    const request = await axios.get(checkUrl, config)
    return request
}

const follows = async (followUrl) => {
    const request = await axios.get(followUrl, config)
    return request
}

const follow = async (data) => {
    const request = await axios.post(followPostUrl, data, config)
    return request
}

const pending = async (data) => {
    const request = await axios.post(pendingUrl, data, config)
    return request
}

const followsService = { follows, follow, pending, checkfollow }

export default followsService
