import axios from 'axios'

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

const followsService = { follows }

export default followsService
