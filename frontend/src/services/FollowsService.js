import axios from 'axios'

const followPostUrl = 'http://localhost:8080/follow'

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

const follows = async (followUrl) => {
    const request = await axios.get(followUrl, config)
    return request
}

const follow = async (data) => {
    const request = await axios.post(followPostUrl, data, config)
    return request
}

const followsService = { follows, follow }

export default followsService
