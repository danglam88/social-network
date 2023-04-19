import axios from 'axios'
import { config } from './LoginService'

const registerUrl = 'http://localhost:8080/register'

const register = async formData => {
    const form = document.getElementById('div-form'); // temporary solution
    const data = {}

    for (const [key, value] of formData.entries()) {
        data[key] = value;
    }

    axios.post(registerUrl, data, config)
    .then(response => {
        // show  result
        // console.log(response.data)
        // console.log("responseeee")
    })
    // temporary showing errors
    .catch(error => {
        let errorWrapper = document.getElementById('error-wrapper');
        if (!errorWrapper){
            errorWrapper = document.createElement('div')
            errorWrapper.id = "error-wrapper"
        } else {
            errorWrapper.innerHTML = ""
        }
        error.response.data[0].Data.forEach(error => {
            const errorDiv = document.createElement('div')
            errorDiv.textContent = error.Message
            errorWrapper.appendChild(errorDiv)
        });
        form.appendChild(errorWrapper)
    })
}

const registerService = {
    register: register
}

export default registerService
