import EventList from "./EventList"
import Posts from "./Posts"
import PostForm from "./PostForm"

const Group = ({group}) => {

  const membersCount = group.members?.length === 0 ? 0 : group.members.length

    return (  
        <>
        <h1>{group.name}</h1>
        <ul>
          <li>Description : {group.description}</li>
          <li>Created at : {group.created_at}</li>
          <li>Members : {membersCount}</li>
        </ul>
        <EventList list={group.events} groupId={group.id}/>
        <PostForm groupId={group.id}/>
        <Posts posts ={group.posts}/>
        </>
      )
}
    
export default Group