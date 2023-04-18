import axios from 'axios'

const groupUrl = 'http://localhost:8080/group'
const groupJoinUrl = 'http://localhost:8080/group_join'

const config = {
    headers : {
      'Content-Type': 'application/json'
    }
};

const postConfig = {
    mode: 'no-cors',
    headers : {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  };

const getGroups = async data => {
    const request = await axios.get(groupUrl, config)
    return request
}

const getGroup = async data => {
    console.log(data)
    const request = await axios.get(groupUrl, config)
    return request
}

const createGroup = async data => {
    const request = await axios.post(groupUrl, data, postConfig)
    return request
}

const joinGroup = async data => {
  console.log(data)
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