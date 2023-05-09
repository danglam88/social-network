import axios from 'axios'

const eventsUrl = 'http://localhost:8080/event_update'

const clientToken = document.cookie
  .split("; ")
  .find((row) => row.startsWith("session_token="))
  ?.split("=")[1];

const config = {
  mode: 'no-cors',
  headers : {
    "Authorization": `Bearer ${clientToken}`,
    'Content-Type': 'application/x-www-form-urlencoded'
  }
};

const event = async data => {
    const request = await axios.post(eventsUrl, data, config)
    return request
}

const eventsService = { event }

export default eventsService
