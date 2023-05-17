import React, { useState, useEffect } from "react"
import EventList from "./EventList"
import Posts from "./Posts"
import PostForm from "./PostForm"
import FollowsWrapper from './FollowsWrapper'
import GroupUsersSelect from "./GroupUsersSelect"
import ChatWindow from './ChatWindow'
import ChatService from '../services/ChatService'
import usersService from '../services/UsersService'

const Group = ({ group, setGroupInfo, handleGoToDetail }) => {
  const membersCount = group.members?.length === 0 ? 0 : group.members.length;
  const [chatButton, setChatButton] = useState(false);
  const [showChatWindow, setShowChatWindow] = useState(false);
  const [users, setUsers] = useState([]);
  const [chatCheckTrigger, setChatCheckTrigger] = useState(false);

  useEffect(() => {
    ChatService
      .checkChat('http://localhost:8080/checkchat?group_id=' + group.id)
      .then((response) => {
        if (response.data.Error === "Chat not found") {
          setChatButton(true);
        }
        else {
          setShowChatWindow(false);
        }
      })
      .catch((error) => console.log(error));

    usersService.groupUsers(group.id)
      .then(response => {
        if (response.data) {
          setUsers(response.data)
        }
      })
      .catch(error => console.log(error))
  }, [chatCheckTrigger]);

  const addChatToChatList = () => {
    setChatButton(false);
    setShowChatWindow(true);
    setChatCheckTrigger(!chatCheckTrigger);
  };

  return (
    <>
      <div className="personal-info main-wrapper">
      {group.avatar_url &&
          <div className="personal-info-column">
            <img className="personal-avatar group-avatar"
              src={`http://localhost:8080${group.avatar_url}`}
              alt="Avatar Image"
            />
          </div>}
        <div className="personal-info-column">
        <h1>{group.name}</h1>
        <div className="group-desc">{group.description}</div>
        <div className="group-created-at">Group creation: {group.created_at.replace("T", " ").replace("Z", "")}</div>
        <div className="group-members">Total members: {membersCount}</div>
        {((group.members && group.members.length > 0) || (users && users.length > 0)) &&
          <ul className="group-users-buttons">
            {group.members && group.members.length > 0 &&
              <li>
                <FollowsWrapper userId={group.id} follows={group.members} title="Members" handleShowPendings={handleGoToDetail} />
              </li>}
            {users && users.length > 0 &&
              <li>
                <GroupUsersSelect buttonName="Invite users" groupId={group.id} groupName={group.name} users={users} setUsers={setUsers} />
              </li>}
          </ul>}
        </div>
      </div>
      {chatButton ? <button onClick={addChatToChatList}>Add Chat to Chat List</button> :
        showChatWindow ? (
          <div>
            <div>Group chat for <b>{group.name}</b> has been added to the chat list</div>
            <ChatWindow chat={{ GroupID: group.id, ChatID: 0 }} />
          </div>
        ) : (
          <div>Group chat for <b>{group.name}</b> is available in the chat list</div>
        )}
      <EventList list={group.events} groupId={group.id} />
      <PostForm groupId={group.id} setGroupInfo={setGroupInfo} />
      {group.posts && <Posts posts={group.posts} type="group" />}
    </>
  );
}

export default Group;
