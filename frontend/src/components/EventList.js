
import Event from "./Event"

const EventList = ({list}) => {

    const events = []

    if (list !== null) {
        list.forEach((event) => {
            events.push(<Event event={event} key={event.id}/>)
        })
    }
   
    return (  
        <>
            <h2>Events</h2>
            {events}
        </>
    )
}
    
export default EventList