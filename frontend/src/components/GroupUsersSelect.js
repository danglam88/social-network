import React, { useState, useEffect } from 'react';
import usersService from '../services/UsersService';
import groupService from '../services/GroupsService';
import WebSocketService from '../services/WebSocketService'


//Showing user info + checkbox to add user
const SelectItem = ({user, setInvitedUsers, invitedUsers}) => {

  const [isChecked, setIsChecked] = useState(false)
  const name = user.nick_name ? user.nick_name : user.last_name + user.first_name
 
  //todo checkbox can be hidden and you can add users by clicking on div  + in div can be shown extra info about user from user object(for styling)
  return (
      <li>
        {name}
        <input
          type="checkbox"
          name= {"user_" + user.id}
          value={user.id}
          onChange={()=> {
            const value = !isChecked 
            setIsChecked(value)

            const newList = invitedUsers
            if (value) {
              newList.push(user.id)
              setInvitedUsers(newList)
            } else {
              let index = newList.indexOf(user.id);
              if (index > -1) {
                newList.splice(index, 1);
                setInvitedUsers(newList)
              }
            }
          }}
          checked={isChecked}
        />
      </li>
  )
} 

//Main component, user list for inviting to the group
const GroupUsersSelect = ({buttonName, groupId}) => {

  const [isVisible, setIsVisible] = useState(false)
  const [users, setUsers] = useState([])
  const [invitedUsers, setInvitedUsers] = useState([])


  useEffect(() => {
     usersService.groupUsers(groupId)
      .then(response => {
        if (response.data) {
          setUsers(response.data)
        }
      })
      .catch(error => console.log(error))
}, [])

  const showList = () => {

    if (!isVisible) {
      usersService.groupUsers(groupId)
        .then(response => {
          if (response.data) {
            setUsers(response.data)
          }
        })
        .catch(error => console.log(error))
    }
    
    setIsVisible(!isVisible)
  }

  const handleInviteUsers = (event) => {
    event.preventDefault()
    const data = {
      group_id : groupId,
      users : invitedUsers.join(",")
    }

    groupService.join(data).then(response => {
      handleSuccessInvitation()
      setIsVisible(!isVisible)
    })
    .catch(error => console.log(error))
  }

  const handleSuccessInvitation = () => {

    invitedUsers.forEach(userId => {

        //send notification
        const payload = {
          type: "invitenotification",
          to: userId,
          message : parseInt(groupId)
        };
        WebSocketService.sendMessage(payload);
    })
    
    setInvitedUsers([])
  }

  if (users.length > 0) {
    return (
      <div>
          <button className="button-small" onClick={showList}>{buttonName}</button>
          {isVisible ? (
          <form onSubmit={handleInviteUsers}>
          <ul>
          {users.map(user =>
              <SelectItem user={user} key={user.id} setInvitedUsers={setInvitedUsers} invitedUsers={invitedUsers}/>
          )}
          </ul>
          <button type="submit">Invite</button>
          </form>) : (<></>)}
      </div>
  )}
}
    
export default GroupUsersSelect