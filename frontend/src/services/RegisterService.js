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

const createOrUpdateResultWrapper = () => {
  let resultWrapper = document.getElementById('result-wrapper')
  if (!resultWrapper) {
    resultWrapper = document.createElement('div')
    resultWrapper.id = 'result-wrapper'
  } else {
    resultWrapper.innerHTML = ''
  }
  return resultWrapper
}

const register = async formData => {
  const form = document.getElementById('div-form')
  const data = {}

  for (const [key, value] of formData.entries()) {
    console.log(key, value)
    data[key] = value
  }

  axios
    .post(registerUrl, data, postConfig)
    .then(response => {
        if (response.status == 200){
            const resultWrapper = createOrUpdateResultWrapper()
            resultWrapper.textContent = 'Registered with success!'
            form.appendChild(resultWrapper)
        } else {
            const resultWrapper = createOrUpdateResultWrapper()
            resultWrapper.textContent = `Registration failed with status ${response.status}.`
            form.appendChild(resultWrapper)
        }
    })
    .catch(error => {
      const resultWrapper = createOrUpdateResultWrapper()
      if (error.response && error.response.data[0].Data) {
        error.response.data[0].Data.forEach(error => {
          const errorDiv = document.createElement('div')
          errorDiv.textContent = error.Message
          resultWrapper.appendChild(errorDiv)
        })
      } else {
        resultWrapper.textContent = error.message
      }
      if (form) {
        form.appendChild(resultWrapper)
      }
    })
}

const registerService = { register }

export default registerService
