import React, { useState, useEffect } from 'react'

import Event from "./Event"
import groupService from "../services/GroupsService"
import WebSocketService from '../services/WebSocketService'


const NewEvent = ({groupId, handleNewEvent}) => {
    const [title, setTitle] = useState('')           
    const [description, setDescription] = useState('')
    const [occurDate, setOccurDate] = useState('')
  
    const handleTitleChange = (event) => {
      setTitle(event.target.value)          
    } 
    
    const handleDescriptionChange = (event) => {
        setDescription(event.target.value)
    }

    const handleOccurDateChange = (event) => {
        setOccurDate(event.target.value)
    }
  
    const handleCreateEvent = (event) => {                                                                                         
      event.preventDefault()
   
      const data = {
          title: title,
          description: description,
          group_id : groupId,
          occur_date : occurDate
      }
   
      groupService.eventCreate(data)
        .then(response => {
            setTitle("")
            setDescription("")
            setOccurDate("")
            handleNewEvent(groupId, response.data)
        })
        .catch(error => console.log(error))
    }
  
    return (
        <>
        <h3>Creating a new event</h3>
        <form onSubmit={handleCreateEvent}>
        <div>
            title: <input value={title} onChange={handleTitleChange} required/>
        </div>
        <div>
            description: <textarea value={description} onChange={handleDescriptionChange} required/>
        </div>   
        <div>
            occur date <input type="datetime-local" name="dateOfBirth" value={occurDate} onChange={handleOccurDateChange} placeholder=" " required />
        </div>
        <div>
            <button type="submit">Create event</button>
        </div>
        </form>
        </>
    )
}

const EventList = ({list, groupId}) => {

    const [eventList, setList] = useState(list)    

    const events = []

    const handleNewEvent = (groupId, newEvent) => {

            console.log("handleNewEvent")

            //send notification
            const payload = {
                type: "eventnotification",
                to: parseInt(groupId),
            };
            WebSocketService.sendMessage(payload);

            const newList = eventList.concat(newEvent)
            setList(newList)
    }

    if (eventList !== null) {
        eventList.forEach((event) => {
            events.push(<Event event={event} key={event.id}/>)
        })
    }
   
    return (
        <>
            <h2>Events</h2>
            {events}
            <NewEvent groupId={groupId} handleNewEvent={handleNewEvent}/>
        </>
    )
}
    
export default EventList