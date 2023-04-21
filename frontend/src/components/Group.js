import Posts from "./Posts"

const Group = ({group}) => {

  const membersCount = group.members.length

  console.log(group.members)
  console.log(membersCount)
    return (  
        <>
        <h1>{group.name}</h1>
        <ul>
          <li>Description : {group.description}</li>
          <li>Created at : {group.created_at}</li>
          <li>Members : {membersCount}</li>
        </ul>

        <Posts posts ={group.posts}/>
        </>
      )
}
    
export default Group