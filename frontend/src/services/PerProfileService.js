import axios from 'axios'

const perProfileUrl = 'http://localhost:8080/perprofile'

export const config = {
    headers : {
      'Content-Type': 'application/json'
    }
};

const perProfile = async data => {
    console.log(data)

    const request = await axios.post(perProfileUrl, JSON.stringify(data), config)
    return request
}

const perProfileService = { 
    perprofile: perProfile
}

export default perProfileService
