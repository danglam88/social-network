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

const posts = async (postUrl) => {
    const request = await axios.get(postUrl, config)
    return request
}

const postsService = { posts }

export default postsService
