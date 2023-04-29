import React, { useState, useEffect } from "react";
import Posts from "./Posts";
import PostForm from "./PostForm";
import PersonalInfo from "./PersonalInfo";
import followsService from "../services/FollowsService";
import FollowsWrapper from "./FollowsWrapper";

const PersonalProfile = ({user, posts}) => {
  const [follows, setFollows] = useState(null);

  useEffect(() => {
    followsService
      .follows("http://localhost:8080/follow?user_id=" + user.id)
      .then((response) => {
        setFollows(response.data);
      })
      .catch((error) => console.log(error));
  }, []);

  const handleShowPendings = (userId) => {
    followsService
      .follows("http://localhost:8080/follow?user_id=" + userId)
      .then((response) => {
        setFollows(response.data);
      })
      .catch((error) => console.log(error));
  };

  return (
    <div className="personal-profile-wrapper">
      <h2>Your profile</h2>
      <PersonalInfo user={user} />
      {follows && (
        <div className="follow">
          {follows.followers && <FollowsWrapper userId={follows.user_id} follows={follows.followers} title="Follower(s):" handleShowPendings={handleShowPendings} />}
          {follows.followings && <FollowsWrapper userId={follows.user_id} follows={follows.followings} title="Following(s):" handleShowPendings={handleShowPendings} />}
          {follows.pendings && <FollowsWrapper userId={follows.user_id} follows={follows.pendings} title="Pending(s):" handleShowPendings={handleShowPendings} />}
        </div>
      )}
      <PostForm />
      {posts && <Posts posts={posts} type="you" />}
    </div>
  );
};

export default PersonalProfile;
