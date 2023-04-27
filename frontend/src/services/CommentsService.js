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

const comments = async (commentUrl) => {
    const request = await axios.get(commentUrl, config)
    return request
}

const commentsService = { comments }

export default commentsService
