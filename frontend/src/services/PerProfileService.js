import axios from 'axios'

const perProfileUrl = 'http://localhost:8080/perprofile'

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

const perprofile = async data => {
    console.log(data)

    const request = await axios.post(perProfileUrl, JSON.stringify(data), config)
    return request
}

const perProfileService = { perprofile }

export default perProfileService
