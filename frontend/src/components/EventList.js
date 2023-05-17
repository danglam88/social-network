import React, { useState } from 'react'

import Event from "./Event"
import groupService from "../services/GroupsService"
import WebSocketService from '../services/WebSocketService'
import ValidateField from '../services/ValidationService'


const NewEvent = ({groupId, handleNewEvent}) => {
    const [title, setTitle] = useState('')           
    const [description, setDescription] = useState('')
    const [occurDate, setOccurDate] = useState('')
    const [errorMessage, setErrorMessage] = useState('')
  
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

      let message = ValidateField("Title", title, 1, 30);
        if ( message !== "") {
            setErrorMessage(message);
            return
        }

        message = ValidateField("Content", description, 1, 100);
        if ( message !== "") {
            setErrorMessage("Description " + message.slice(8));
            return
        }

        
        message = occurDate
        if (new Date(occurDate) <= new Date()) {
            setErrorMessage("Time must be in the future");
            return
        }

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
            setErrorMessage("")
            handleNewEvent(groupId, response.data)
        })
        .catch(error => console.log(error))
    }
  
    return (
        <div className="create-event-wrapper">
            <div className="create-event">
            <h2>Create a new event</h2>
            <form onSubmit={handleCreateEvent}>
                <div>
                    <label>Title:</label><input value={title} onChange={handleTitleChange} required />
                </div>
                <br />
                <div className="event-desc">
                    <label>Description:</label><textarea value={description} onChange={handleDescriptionChange} required />
                </div>
                <br />
                <div>
                    <label>Occur date:</label><input type="datetime-local" name="dateOfBirth" value={occurDate} onChange={handleOccurDateChange} placeholder=" " required />
                </div>
                <br />
                <div>
                    <button type="submit">Create event</button>
                </div>
                {errorMessage && <div>{errorMessage}</div>}
            </form>
            </div>
        </div>
    )
}

const EventList = ({list, groupId}) => {

    const [eventList, setList] = useState(list)    

    const events = []

    const handleNewEvent = (groupId, newEvent) => {

            //send notification
            const payload = {
                type: "eventnotification",
                to: parseInt(groupId),
                //send message with event name
                message: newEvent.name
            };
            WebSocketService.sendMessage(payload);

            const newList = eventList ? [...eventList, newEvent] : [newEvent]
            setList(newList)
    }

    if (eventList !== null) {
        eventList.forEach((event) => {
            events.push(<Event event={event} key={event.id}/>)
        })
    }
   
    return (
        <>
            {events.length > 0 && 
            <div className="events-wrapper">
                <h2>Events:</h2>
                <div className="group-events">
                    {events}
                </div>
            </div>
            }
            <NewEvent groupId={groupId} handleNewEvent={handleNewEvent} />
        </>
    )
}
    
export default EventList