import React, { useState } from 'react';
import Posts from "./Posts";
import PostForm from "./PostForm";
import PersonalInfo from "./PersonalInfo";

const PersonalProfile = ({user, posts, setPosts, follows, handleShowPendings, profilePrivate, setProfilePrivate}) => {
  return (
    <div className="personal-profile-wrapper">
      <PersonalInfo updatedUser={user} profilePrivate={profilePrivate} setProfilePrivate={setProfilePrivate} type="own" handleUpdateFollows={handleShowPendings} follows={follows} />
      <PostForm userId={user.id} setPosts={setPosts} follows={follows} />
      {posts && posts.length > 0 && <Posts posts={posts} />}
    </div>
  );
};

export default PersonalProfile;
