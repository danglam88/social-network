import React, { useState } from 'react';
import usersService from '../services/UsersService';
import groupService from '../services/GroupsService';
import WebSocketService from '../services/WebSocketService'

//Showing user info + checkbox to add user
const SelectItem = ({user, setInvitedUsers, invitedUsers}) => {

  const [isChecked, setIsChecked] = useState(false)
  const name = user.nick_name ? user.nick_name : user.first_name + " " + user.last_name
 
  //todo checkbox can be hidden and you can add users by clicking on div  + in div can be shown extra info about user from user object(for styling)
  return (
      <li>
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
        {name}
      </li>
  )
} 

//Main component, user list for inviting to the group
const GroupUsersSelect = ({buttonName, groupId, groupName, users, setUsers}) => {

  const [isVisible, setIsVisible] = useState(false)
  const [invitedUsers, setInvitedUsers] = useState([])

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
    usersService.groupUsers(groupId)
      .then(response => {
        if (response.data) {
          setUsers(response.data)
        } else {
          setUsers([])
        }
      })
      .catch(error => console.log(error))

    invitedUsers.forEach(userId => {

        //send notification
        const payload = {
          type: "invitenotification",
          to: userId,
          group_id: groupId,
          message : groupName
        };
        WebSocketService.sendMessage(payload);
    })
    
    setInvitedUsers([])
  }

  users.sort(function(a, b) {
    var nameA = a.nick_name || a.first_name + " " + a.last_name;
    var nameB = b.nick_name || b.first_name + " " + b.last_name;
    return nameA.localeCompare(nameB);
  });

  return (
        <div className="follow-options-menu">
          <button className="button-small" onClick={showList}>{buttonName}</button>
          {isVisible &&
          <form className='follow-options invite' onSubmit={handleInviteUsers}>
            <ul>
            {users.map(user => {
              const inviteUserKey = "inviteUser" + user.id;
              return <SelectItem user={user} key={inviteUserKey} setInvitedUsers={setInvitedUsers} invitedUsers={invitedUsers}/>
            })}
            </ul>
            <button type="submit">Invite</button>
          </form>}
        </div>
  )
}
    
export default GroupUsersSelect
