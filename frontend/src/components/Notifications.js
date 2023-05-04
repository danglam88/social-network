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
            {notifications.group_invitations && notifications.group_invitations.map(notification => {
                const inviteKey = "invite" + notification.id;
                return <Invitation group={notification} key={inviteKey} handleRemoveGroup={() => handleRemoveGroup(notification.id, false, true)}/>
            })}
            {notifications.group_requests && notifications.group_requests.map(notification => {
                const requestKey = "request" + notification.id;
                return <Request group={notification} key={requestKey} handleRemoveGroup={() => handleRemoveGroup(notification.id, true, false)}/>
            })}
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
        <div>You have an invitation to join the group {group.name}</div>
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
        <div>The group {group.name} has a joining request from</div>

        {group.members && group.members.map(user => {
            const requestUserKey = "requestUser" + user.id;
            return (
                <div key={requestUserKey}>
                    {user.nick_name ? <div>{user.nick_name}</div> : <div>{user.first_name} {user.last_name}</div>}
                    <button onClick={() => sendReply(user.id, true)}>Accept</button>
                    <button onClick={() => sendReply(user.id, false)}>Decline</button>
                </div>
            )})}
        </>
    )
}
    
export default Notifications