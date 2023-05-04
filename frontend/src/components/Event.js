import { useState } from 'react'
import groupService from "../services/GroupsService"

const Event = ({event}) => {

    const [isGoing, setIsGoing] = useState(event.user_vote)
    const [votes, setVotes] = useState({
      votedYes : event.voted_yes, 
      votedNo : event.voted_no,
    })

    const handleChange = (value, eventId) => {

        setIsGoing(value)

        const data = {
            event_id : eventId,
            is_going : value
        }
        
        groupService.eventJoin(data)
        .then(response => {
          setVotes({
            votedYes : response.data.voted_yes, 
            votedNo : response.data.voted_no,
          })
        })
        .catch(error => console.log(error))
    }

    const isInPast = new Date(event.occur_time) <= new Date()

    return (
        <ul>
            <li><h3>{event.name}, by {event.creator_name}</h3></li>
            <li>{event.description}</li>
            <div className="event-info">
              <li>Event time: {event.occur_time}</li>
            </div>
            {isInPast ? (
            <div className="radio-wrapper">
              <span>I am in! ({votes.votedYes} members)</span>
              <span>Not for me ({votes.votedNo} members)</span>
            </div>
            ) 
            : (
                  <div className="radio-wrapper">
                  <div className="radio">
                    <label>
                      <input
                      type='radio'
                      id='is_going_1'
                      value='1'
                      onChange={() => handleChange(1, event.id)}
                      checked={isGoing === 1}
                      />
                    I am in! ({votes.votedYes} members)
                    <span></span></label>
                  </div>
                  <div className="radio">
                    <label>
                      <input
                      type='radio'
                      id='is_going_0'
                      value='0'
                      onChange={() => handleChange(0, event.id)}
                      checked={isGoing === 0}
                      />
                    Not for me ({votes.votedNo} members)
                    <span></span></label>
                </div>
              </div>
            )}
  
           {/* <input
            type='radio'
            id='is_going_0'
            value='0'
            onChange={() => handleChange(0, event.id)}
            checked={isGoing === 0}
          />
          <label htmlFor='is_going_0'>Not for me ({votes.votedNo} members)</label> */}
        </ul>
    )
}
    
export default Event