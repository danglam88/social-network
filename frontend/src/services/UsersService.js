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

const usersUrl = 'http://localhost:8080/allusers'
const userUrl = 'http://localhost:8080/user'

const users = async () => {
    const request = await axios.get(usersUrl, config)
    return request
}

const user = async (userId) => {
    const request = await axios.get(`${userUrl}?user_id=${userId}`, config)
    return request
}

const usersService = { users, user }

export default usersService
