import axios from 'axios'

const groupUrl = 'http://localhost:8080/group'
const groupJoinUrl = 'http://localhost:8080/group_join'
const eventUrl = 'http://localhost:8080/event'
const eventJoinUrl = 'http://localhost:8080/event_join'


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

const postConfig = {
  mode: 'no-cors',
  headers : {
    "Authorization": `Bearer ${clientToken}`,
    'Content-Type': 'application/x-www-form-urlencoded'
  }
};

const getGroups = async data => {
    const request = await axios.get(groupUrl, config)
    return request
}

const getGroup = async groupId => {
  const request = await axios.get(groupUrl + "?id=" + groupId, config)
  return request
}

const createGroup = async data => {
    const request = await axios.post(groupUrl, data, postConfig)
    return request
}

const joinGroup = async data => {
  const request = await axios.post(groupJoinUrl, data, postConfig)
  return request
}

const joinEvent = async data => {
  const request = await axios.post(eventJoinUrl, data, postConfig)
  return request
}

const createEvent = async data => {
  const request = await axios.post(eventUrl, data, postConfig)
  console.log(data)
  return request
}

const GroupService = { 
    groups: getGroups,
    group : getGroup,
    create : createGroup,
    join : joinGroup,
    eventJoin : joinEvent,
    eventCreate : createEvent,
}

export default GroupService