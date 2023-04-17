import axios from 'axios'

const groupUrl = 'http://localhost:8080/group'

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
    console.log(data)

    const request = await axios.get(groupUrl, config)
    return request
}

const getGroup = async data => {
    console.log(data)

    const request = await axios.get(groupUrl, config)

    console.log(request)
    return request
}

const createGroup = async data => {
    console.log(data)

    const request = await axios.post(groupUrl, data, postConfig)

    console.log(request)
    return request
}

const GroupService = { 
    groups: getGroups,
    group : getGroup,
    create : createGroup 
}

export default GroupService