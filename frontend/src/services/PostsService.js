import axios from 'axios'

const postUrl = "http://localhost:8080/post"

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

const postConfig = {
  headers: {
    Authorization: `Bearer ${clientToken}`,
    "Content-Type": "multipart/form-data",
  },
};

const posts = async (postUrl) => {
    const request = await axios.get(postUrl, config)
    return request
}

const post = async (data) => {
    const request = await axios.post(postUrl, data, postConfig)
    return request
}

const postsService = { posts, post }

export default postsService
