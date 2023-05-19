import axios from 'axios'

const commentUrl = "http://localhost:8080/comment"

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

const comments = async (commentUrl) => {
    const request = await axios.get(commentUrl, config)
    return request
}

const comment = async (data) => {
    const request = await axios.post(commentUrl, data, postConfig)
    return request
}

const commentsService = { comments, comment }

export default commentsService
