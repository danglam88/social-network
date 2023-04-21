import axios from 'axios'
import config from './LoginService'

const registerUrl = 'http://localhost:8080/register'

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
    data[key] = value
  }

  axios
    .post(registerUrl, data, config)
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
      if (error.response.data[0].Data) {
        error.response.data[0].Data.forEach(error => {
          const errorDiv = document.createElement('div')
          errorDiv.textContent = error.Message
          resultWrapper.appendChild(errorDiv)
        })
      } else {
        resultWrapper.textContent = error.message
      }
      form.appendChild(resultWrapper)
    })
}

const registerService = { register }

export default registerService
