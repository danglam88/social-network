import axios from 'axios'

const registerUrl = 'http://localhost:8080/register'

const clientToken = document.cookie
  .split("; ")
  .find((row) => row.startsWith("session_token="))
  ?.split("=")[1];

const postConfig = {
  mode: 'no-cors',
  headers : {
    "Authorization": `Bearer ${clientToken}`,
    'Content-Type': 'multipart/form-data'
  }
};

const register = async formData => {
  console.log(formData)
  const data = {}

  for (const [key, value] of formData.entries()) {
    console.log(key, value)
    data[key] = value
  }

  const request = await axios.post(registerUrl, data, postConfig)
  console.log(request)
  return request
}

const registerService = { register }

export default registerService
