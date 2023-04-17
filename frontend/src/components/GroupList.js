import { useState, useEffect } from 'react'
import groupService from "../services/GroupsService"

const ListItem = ({group}) => {

    const handleShowGroup = (event) => {
        console.log(1111111)
    } 

    const handleRequestJoin = (event) => {
        console.log(2222)
    }

    return (  
        <div className="group-wrapper">
            <h3>{group.name}</h3>
            <div>
                <div className="group-column">{group.description}</div>
                <div className="group-column group-activity-link" onClick={handleRequestJoin}>Join</div>
                <div className="group-column group-activity-link"onClick={handleShowGroup}>Go to</div>
            </div>
        </div>
    )
}

const NewGroup = () => {
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
      console.log("handle create group")
  
      const data = {
          title: title,
          description: description
      }
   
      groupService.create(data)
        .then(response => {
          console.log(response)
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

//todo set token as a params
const GroupList = () => {

    const [items, setItems] = useState([])
    const [isCreateGroup, setIsCreateGroup] = useState(false)
    //const [isDetailPage, setIsDetailPage] = useState(false)

    const handleCreateGroup = (event) => {
        setIsCreateGroup(true)
    }

    useEffect(() => {

        groupService.groups().then(response => {
            const list = []
            response.data.forEach((data) => {
                list.push(<ListItem group={data} key={data.id} handleIs/>)
            })
            setItems(list)
        })
        .catch(error => console.log(error))
    }, [])

    return (  
        <>
        <h1>Groups</h1>
        <div>
            {items}
            <div className="group-wrapper">
            {isCreateGroup ? (<NewGroup/>) : 
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
}
    
export default GroupList