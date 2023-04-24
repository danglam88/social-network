
import { useState } from 'react'

const Event = ({event}) => {

    const [isGoing, setIsGoing] = useState("")

    const handleChange = (event) => {
        setIsGoing(event.target.value)
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
            onChange={handleChange}
            checked={isGoing === 1}
          />
          <label htmlFor='is_going_1'>I am in!</label>
           <input
            type='radio'
            id='is_going_0'
            value='0'
            onChange={handleChange}
            checked={isGoing === 0}
          />
          <label htmlFor='is_going_0'>Not for me</label>
        </ul>
    )
}
    
export default Event