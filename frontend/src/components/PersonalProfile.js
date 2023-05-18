import React, { useState } from 'react';
import Posts from "./Posts";
import PostForm from "./PostForm";
import PersonalInfo from "./PersonalInfo";

const PersonalProfile = ({user, posts, setPosts, follows, handleShowPendings}) => {
  const [profilePrivate, setProfilePrivate] = useState(user.is_private === 1);

  return (
    <div className="personal-profile-wrapper">
      <PersonalInfo updatedUser={user} profilePrivate={profilePrivate} setProfilePrivate={setProfilePrivate} type="own" handleUpdateFollows={handleShowPendings} follows={follows} />
      <PostForm userId={user.id} setPosts={setPosts} follows={follows} />
      {posts && posts.length > 0 && <Posts posts={posts} type="you" userId={user.id} />}
    </div>
  );
};

export default PersonalProfile;
