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

const users = async () => {
    const request = await axios.get(usersUrl, config)
    return request
}

const usersService = { users }

export default usersService
