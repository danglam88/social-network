import axios from 'axios'

const groupUrl = 'http://localhost:8080/group'
const groupJoinUrl = 'http://localhost:8080/group_join'

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
  console.log(groupId)
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

const GroupService = { 
    groups: getGroups,
    group : getGroup,
    create : createGroup,
    join : joinGroup
}

export default GroupService