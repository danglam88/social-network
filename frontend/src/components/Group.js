import React, { useState, useEffect } from "react"
import EventList from "./EventList"
import Posts from "./Posts"
import PostForm from "./PostForm"
import FollowsWrapper from './FollowsWrapper'
import GroupUsersSelect from "./GroupUsersSelect"
import ChatWindow from './ChatWindow'
import ChatService from '../services/ChatService'

const Group = ({group, setGroupInfo, handleGoToDetail}) => {
  const membersCount = group.members?.length === 0 ? 0 : group.members.length;
  const [chatButton, setChatButton] = useState(false);
  const [showChatWindow, setShowChatWindow] = useState(false);

  useEffect(() => {
    ChatService
      .checkChat('http://localhost:8080/checkchat?group_id=' + group.id)
      .then((response) => {
        if (response.data.Error === "Chat not found") {
          setChatButton(true);
        }
      })
      .catch((error) => console.log(error));
  }, []);

  const addChatToChatList = () => {
    setChatButton(false);
    setShowChatWindow(true);
  };

    return (  
      <>
        <h1>{group.name}</h1>
        <div className="group-desc">{group.description}</div>
        <div className="group-created-at">Group creation: {group.created_at.replace("T", " ").replace("Z", "")}</div>
        <div className="group-members">Total members: {membersCount}</div>
        {group.avatar_url &&
            <div>
              <img className="personal-avatar"
                src={`http://localhost:8080${group.avatar_url}`}
                alt="Avatar Image"
              />
            </div>}
        <ul className="group-users-buttons">
          {group.members &&
          <li>
            <FollowsWrapper userId={group.id} follows={group.members} title="Members:" handleShowPendings={handleGoToDetail} />
          </li>}
          <li>
            <GroupUsersSelect buttonName="Invite users:" groupId={group.id} groupName={group.name}/>
          </li>
        </ul>
        {group.events && <EventList list={group.events} groupId={group.id}/>}
        <PostForm groupId={group.id} setGroupInfo={setGroupInfo} />
        {group.posts && <Posts posts={group.posts} type="group" />}
        <br />
        {chatButton ? <button onClick={addChatToChatList}>Add Chat to Chat List</button> :
        showChatWindow ? (
          <div>
            <div>{group.name} is available to chat from chat list</div>
            <ChatWindow chat={{ GroupID: group.id, ChatID: 0 }} />
          </div>
        ) : (
          <div>{group.name} is available to chat from chat list</div>
        )}
      </>
  );
}

export default Group;
