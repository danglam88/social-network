import EventList from "./EventList"
import Posts from "./Posts"
import PostForm from "./PostForm"
import FollowsWrapper from './FollowsWrapper'
import GroupUsersSelect from "./GroupUsersSelect"
import ChatWindow from './ChatWindow';
import React, { useState } from "react";

const Group = ({group, setGroupInfo}) => {
  const membersCount = group.members?.length === 0 ? 0 : group.members.length
  const [showChatWindow, setShowChatWindow] = useState(false);

  const openChatWindow = () => {
    setShowChatWindow(true);
  };

  const closeChatWindow = () => {
    setShowChatWindow(false);
  };

    return (  
        <>
        <h1>{group.name}</h1>
        <ul>
          <li>Description : {group.description}</li>
          <li>Created at : {group.created_at}</li>
          <li>Members : {membersCount}</li>
          <FollowsWrapper follows={group.members} title="Member(s):" handleShowPendings= {() => {}} />
          <GroupUsersSelect buttonName="Invite users" groupId={group.id}/>
        </ul>
        <EventList list={group.events} groupId={group.id}/>
        <PostForm groupId={group.id} setGroupInfo={setGroupInfo} />
        <Posts posts={group.posts} type="group" />
        <button onClick={openChatWindow}>Open Chat</button>
      {showChatWindow && (
         <div
        className="chat-window-modal"
        onClick={closeChatWindow}
        onKeyDown={(e) => {
          if (e.key === 'esc') {
            closeChatWindow();
          }
        }}
      tabIndex="0"
      >
    <ChatWindow chat={{ GroupID: group.id, ChatID: 0 }} onClose={closeChatWindow} />

  </div>
)}
        </>
    );
}

export default Group;