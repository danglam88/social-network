
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

    return (
        <ul>
            <li>name :{event.name}</li>
            <li>creator :{event.creator_id}</li>
            <li>description :{event.description}</li>
            <li>occur time :{event.occur_time}</li>
            <input
            type='radio'
            id='is_going_1'
            value='1'
            onChange={() => handleChange(1, event.id)}
            checked={isGoing === 1}
          />
          <label htmlFor='is_going_1'>I am in! ({votes.votedYes} members)</label>
           <input
            type='radio'
            id='is_going_0'
            value='0'
            onChange={() => handleChange(0, event.id)}
            checked={isGoing === 0}
          />
          <label htmlFor='is_going_0'>Not for me ({votes.votedNo} members)</label>
        </ul>
    )
}
    
export default Event