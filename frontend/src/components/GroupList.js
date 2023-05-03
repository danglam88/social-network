import React, { useState, useEffect } from 'react'
import groupService from "../services/GroupsService"
import Group from './Group'
import WebSocketService from '../services/WebSocketService'
import ValidateField from '../services/ValidationService'

//Subcomponent for showing info abouut each group in the list
const ListItem = ({group, handleSuccessJoinRequest, handleGoToDetail}) => {

    const handleShowGroup = (groupId) => {
        handleGoToDetail(groupId)
    }

    const handleRequestJoin = (groupId) => {
        const data = {
            group_id : groupId
        }
        groupService.join(data)
        .then(response => {
          handleSuccessJoinRequest(groupId)
        })
        .catch(error => console.log(error))
    }

    return (  
        <div className="group-wrapper">
            <h3>{group.name}</h3>
            <div>
                <div className="group-column">{group.description}</div>
                {group.is_member ?
                    (<div className="group-column group-activity-link button-small go-to" onClick={() => handleShowGroup(group.id)}>Go to</div>)
                    : group.is_requested ? 
                    (<div className="group-column group-activity-link button-small ">Requested</div>) 
                    : 
                    (<div className="group-column group-activity-link button-small join" onClick={() => handleRequestJoin(group.id)}>Join</div>)
                    }
            </div>
        </div>
    )
}

//Component for adding a new group
const NewGroup = ({handleNewGroup}) => {
    const [title, setTitle] = useState('')           
    const [description, setDescription] = useState('')
    const [errorMessage, setErrorMessage] = useState('')
  
    const handleTitleChange = (event) => {
      setTitle(event.target.value)          
    } 
    
    const handleDescriptionChange = (event) => {
        setDescription(event.target.value)
    }
  
    const handleCreateGroup = (event) => {                                                                                         
      event.preventDefault()

      let Message = ValidateField("Title", title, 1, 30);
        if ( Message !== "") {
            setErrorMessage(Message);
            return;
        }
        Message = ValidateField("Content", description, 1, 100);
        if ( Message !== "") {
            setErrorMessage("Description " + Message.slice(8));
            return;
        }
   
      const data = {
          title: title,
          description: description
      }
   
      groupService.create(data)
        .then(response => {
          handleNewGroup(response.data)
        })
        .catch(error => console.log(error))
    }
  
    return (
        <>
        <h3>Creating a new group</h3>
        <form onSubmit={handleCreateGroup}>
        <div>
            title: <input value={title} onChange={handleTitleChange}/>
        </div>
        <div>
            description: <textarea value={description} onChange={handleDescriptionChange}/>
        </div>   
        <div>
            <button type="submit">Create group</button>
        </div>
        {errorMessage && <div>{errorMessage}</div>}
        </form>
        </>
    )
}

//Main component
const GroupList = ({isGroupDetailPage, setIsGroupDetailPage}) => {

    const [items, setItems] = useState([])
    const [isCreateGroup, setIsCreateGroup] = useState(false)
    const [groupInfo, setGroupInfo] = useState({})

    const handleCreateGroup = (event) => {
        setIsCreateGroup(true)
    }

    const handleNewGroup = (data) => {
        setIsCreateGroup(false)
        const newItems = items.concat(data)

        setItems(newItems)
    }

    const handleGoToDetail = (groupId) => {

        groupService.group(groupId).then(response => {
            setGroupInfo(response.data)
            setIsGroupDetailPage(true)
        })
        .catch(error => console.log(error))
    }

    const handleSuccessJoinRequest = (groupId) => {
        const newItems = items.map(a => {return {...a}})

        newItems.forEach((data, key) => {
            if (data.id == groupId) {
                newItems[key].is_member = false
                newItems[key].is_requested = true
            }
        })

        setItems(newItems)

        //send notification
        const payload = {
            type: "joinreqnotification",
            to: parseInt(groupId),
          };
          WebSocketService.sendMessage(payload);
    }

    useEffect(() => {
        groupService.groups().then(response => {
            const list = []
            response.data.forEach((data) => {
                list.push(data)
            })
            setItems(list)
        })
        .catch(error => console.log(error))
    }, [])


    const groupsList = []
    {items.forEach((data) => {
        groupsList.push(<ListItem group={data} key={data.id} handleSuccessJoinRequest={handleSuccessJoinRequest} handleGoToDetail={handleGoToDetail}/>)
    })}

    if (items.length > 0) {
        return (
            <>
            {isGroupDetailPage ? (<Group group={groupInfo} setGroupInfo={setGroupInfo} />) : (
            <>
            <h1>Groups</h1>
                <div>
                    {groupsList}
                    <div className="group-wrapper">
                    {isCreateGroup ? (<NewGroup handleNewGroup={handleNewGroup}/>) : 
                    (
                        <>
                        <div className="group-column">If you haven't find a group you can create our own!</div>
                        <div className="group-column group-activity-link button-small create" onClick={handleCreateGroup}>Create a group</div>
                        </>
                )}
                    </div>
                </div>
            </>   
             )}
            </>    
        )
    } else {
        return (<></>)
    }
}
    
export default GroupList