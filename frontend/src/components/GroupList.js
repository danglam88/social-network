import { useState, useEffect } from 'react'
import groupService from "../services/GroupsService"

const ListItem = ({group, handleSuccessJoinRequest}) => {

    const handleShowGroup = (event) => {
        console.log(1111111)
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
                {!group.is_member ? 
                    (<div className="group-column group-activity-link" onClick={() => handleRequestJoin(group.id)}>Join</div>) : (
                        <div className="group-column group-activity-link">Member</div>
                    )}
                <div className="group-column group-activity-link"onClick={handleShowGroup}>Go to</div>
            </div>
        </div>
    )
}

const NewGroup = ({handleNewGroup}) => {
    const [title, setTitle] = useState('')           
    const [description, setDescription] = useState('')
  
    const handleTitleChange = (event) => {
      setTitle(event.target.value)          
    } 
    
    const handleDescriptionChange = (event) => {
        setDescription(event.target.value)
    }
  
    const handleCreateGroup = (event) => {                                                                                         
      event.preventDefault()
   
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
        </form>
        </>
    )
}

const GroupList = () => {

    const [items, setItems] = useState([])
    const [isCreateGroup, setIsCreateGroup] = useState(false)
    //const [isDetailPage, setIsDetailPage] = useState(false)

    const handleCreateGroup = (event) => {
        setIsCreateGroup(true)
    }

    const handleNewGroup = (data) => {
        setIsCreateGroup(false)
        const newItems = items.concat(data)

        setItems(newItems)
    }

    const handleSuccessJoinRequest = (groupId) => {
        const newItems = items.map(a => {return {...a}})

        newItems.forEach((data, key) => {
            if (data.id == groupId) {
                newItems[key].is_member = true
            }
        })

        setItems(newItems)
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
        groupsList.push(<ListItem group={data} key={data.id} handleSuccessJoinRequest={handleSuccessJoinRequest}/>)
    })}

    if (items.length > 0) {
        return (
            <>
            <h1>Groups</h1>
            <div>
                {groupsList}
                <div className="group-wrapper">
                {isCreateGroup ? (<NewGroup handleNewGroup={handleNewGroup}/>) : 
                (
                    <>
                    <div className="group-column">If you haven't find a group you can create our own!</div>
                    <div className="group-column group-activity-link" onClick={handleCreateGroup}>Create a group</div>
                    </>
               )}
                </div>
            </div>
            </>
        )
    } else {
        return (<></>)
    }
}
    
export default GroupList