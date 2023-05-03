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

    const handleRemoveGroup = (groupId) => {
        const newNotifications = JSON.parse(JSON.stringify(notifications))

        newNotifications.group_invitations = newNotifications.group_invitations.filter(item => item.id != groupId)

        setNotifications(newNotifications)
    }

    return (
        <>
        <h3>Notifications</h3>
        <div>     
            {notifications.group_invitations && notifications.group_invitations.map(notification => 
                <Invitation group={notification} key={notification.id} handleRemoveGroup={() => handleRemoveGroup(notification.id)}/>   
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
    
export default Notifications