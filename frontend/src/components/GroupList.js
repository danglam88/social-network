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
        .then(() => {
          handleSuccessJoinRequest(groupId)
        })
        .catch(error => console.log(error))
    }

    return (  
        <div className="group-wrapper">
            <h3><img className="avatar-symbol" src={`http://localhost:8080${group.avatar_url}`}/>{group.name}</h3>
            <div className="info-button-wrapper">
                <div className="group-column">{group.description}</div>
                {group.is_member ?
                    (<div className="small-button-wrapper"><div className="group-column group-activity-link button-small go-to" onClick={() => handleShowGroup(group.id)}>Go to</div></div>)
                    : group.is_requested ? 
                    (<div className="small-button-wrapper"><div className="group-column group-activity-link button-small requested">Requested</div></div>)
                    : group.is_invited ?
                    (<div className="small-button-wrapper"><div className="group-column group-activity-link button-small invited">Invited</div></div>)
                    : 
                    (<div className="small-button-wrapper"><div className="group-column group-activity-link button-small join" onClick={() => handleRequestJoin(group.id)}>Join</div></div>)
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
            if (Message.slice(0, 8) === "Content ") {
                setErrorMessage("Description " + Message.slice(8));
                return;
            }else {
                setErrorMessage(Message);
                return;
            }
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
        <div className="new-post-wrapper groups-wrapper">
        <h3>Create new group</h3>
        <form className='post-comment-form' onSubmit={handleCreateGroup}>
        <label>Title:</label>
        <input type='text' value={title} onChange={handleTitleChange}/>
        <br />
        <label>Description:</label> 
        <textarea value={description} onChange={handleDescriptionChange}/>
        <br />   
        <div className="login-button-error">
            <button type="submit">Create group</button>
            {errorMessage && <div className="error register-error">{errorMessage}</div>}
        </div>
        </form>
        </div>
    )
}

//Main component
const GroupList = ({items, setItems, isGroupDetailPage, setIsGroupDetailPage, availableChats,
    setAvailableChats,
    chatListVisible,setChatListVisible, }) => {
    const [isCreateGroup, setIsCreateGroup] = useState(false)
    const [groupInfo, setGroupInfo] = useState({})
    const [filter, setFilter] = useState("")
    const [initialItems, setInitialItems] = useState(items)
    const [filterMessage, setFilterMessage] = useState("")

    const handleCreateGroup = () => {
        setIsCreateGroup(true)
    }

    const handleNewGroup = (data) => {
        setIsCreateGroup(false)
        const newItems = items.concat(data)

        setItems(newItems)
        setInitialItems(newItems)
    }

    const handleGoToDetail = (groupId) => {

        groupService.group(groupId).then(response => {
            setGroupInfo(response.data)
            setIsGroupDetailPage(true)
        })
        .catch(error => console.log(error))
    }

    const handleFilter = (event) => {

        let newFilter = event.target.value.toLowerCase()
        setFilter(newFilter)

        newFilter = newFilter.trim()

        const newItems = initialItems.filter((item => newFilter.length == 0 || item.name.toLowerCase().includes(newFilter) || item.description.toLowerCase().includes(newFilter))) 

        if (newItems.length == 0) {
            setItems(initialItems)
            setFilterMessage("No groups found")
        } else {
            setItems(newItems)
            setFilterMessage("")
        } 
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
            group_id: parseInt(groupId),
          };
          WebSocketService.sendMessage(payload);
    }
    items.sort(function(a, b) {
        var nameA = a.name;
        var nameB = b.name;
        return nameA.localeCompare(nameB);
      });

    const groupsList = []
    {items.forEach((data) => {
        const groupItemKey = "groupItem" + data.id;
        groupsList.push(<ListItem group={data} key={groupItemKey} handleSuccessJoinRequest={handleSuccessJoinRequest} handleGoToDetail={handleGoToDetail}/>)
    })}

    if (items.length > 0) {
        return (
        <div>
            {isGroupDetailPage ? (<Group group={groupInfo} key={groupInfo.id} setGroupInfo={setGroupInfo} handleGoToDetail={handleGoToDetail}  availableChats={availableChats}
          setAvailableChats={setAvailableChats}
          chatListVisible={chatListVisible}
          setChatListVisible={setChatListVisible} />) : (
                 <>
            <div className="groups-wrapper">
                <h1>Groups</h1>
                <br/>
                <label className="filter-label">Search groups:</label>
                <div className="login-button-error">
                    <input type="text" value={filter} onChange={handleFilter}/>
                    {filterMessage && <div className="error filter">{filterMessage}</div>}
                </div>
            </div>
            {isCreateGroup ? (<NewGroup handleNewGroup={handleNewGroup}/>) : 
            (
                <div className='groups-wrapper'>
                    <div className="small-button-wrapper"><div className="group-column group-activity-link button-small create" onClick={handleCreateGroup}>Add new group</div></div>
                </div>
            )}
            <div className='groups-wrapper'>
                {groupsList}
            </div>
                           
        </>)}
        </div>)
    } else {
        return (<></>)
    }
}
    
export default GroupList
