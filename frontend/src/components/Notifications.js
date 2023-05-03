import React, { useState, useEffect } from 'react'
import NotificationService from "../services/NotificationService"

const Notifications = () => {
    useEffect(() => {
        NotificationService.getAll().then(response => {
            console.log(response.data)
            setNotifications(response.data)
        })
        .catch(error => console.log(error))
    }, [])

    const [notifications, setNotifications] = useState([])

    const handleRemoveGroup = (groupId, isRequest, isNotification) => {
        const newNotifications = JSON.parse(JSON.stringify(notifications))

        if (isRequest) {
            newNotifications.group_requests = newNotifications.group_requests.filter(item => item.id != groupId)
        }

        if (isNotification) {
            newNotifications.group_invitations = newNotifications.group_invitations.filter(item => item.id != groupId)
        }

        setNotifications(newNotifications)
    }

    return (
        <>
        <h3>Notifications</h3>
        <div>     
            {notifications.group_invitations && notifications.group_invitations.map(notification => 
                <Invitation group={notification} key={notification.id} handleRemoveGroup={() => handleRemoveGroup(notification.id, false, true)}/>   
            )}
            {notifications.group_requests && notifications.group_requests.map(notification => 
                <Request group={notification} key={notification.id} handleRemoveGroup={() => handleRemoveGroup(notification.id, true, false)}/>   
            )}
        </div>
        </>
    )

}

const Invitation = ({group, handleRemoveGroup}) => {

    const sendReply = (isAccepted) => {
        const data = {
            type: "invitenotification",
            group_id: group.id,
            is_accepted : isAccepted
        }
     
        NotificationService.reply(data)
          .then(response => {
            handleRemoveGroup(group.id)
          })
          .catch(error => console.log(error))
        
    }
    const accept = () => {
        sendReply(true)
    } 

    const decline = () => {
        sendReply(false)
    }

    return (
        <>
        <div>You have invitation to the group {group.name}</div>
        <button onClick={accept}>Accept</button>
        <button onClick={decline}>Decline</button>
        </>
    )
}

const Request = ({group, handleRemoveGroup}) => {

    const sendReply = (userId, isAccepted) => {
        const data = {
            type: "joinreqnotification",
            group_id: group.id,
            user_id : userId,
            is_accepted : isAccepted
        }
     
        NotificationService.reply(data)
          .then(response => {
            handleRemoveGroup(group.id)
          })
          .catch(error => console.log(error))
        
    }
    
    return (
        <>
        <div>You have request to the group {group.name}</div>

        {group.members && group.members.map(user => {
            return (
                <>
                 <div>User {user.nick_name} ({user.first_name} {user.last_name})</div>
                 <button onClick={() => sendReply(user.id, true)}>Accept</button>
                 <button onClick={() => sendReply(user.id, false)}>Decline</button>
                </>
            )
        })}
        </>
    )
}
    
export default Notifications