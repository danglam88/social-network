import Posts from "./Posts";
import PostForm from "./PostForm";
import PersonalInfo from "./PersonalInfo";
import FollowsWrapper from "./FollowsWrapper";
import Notifications from "./Notifications";

const PersonalProfile = ({user, posts, setPosts, follows, handleShowPendings}) => {
  return (
    <div className="personal-profile-wrapper">
      <h2>Your profile</h2>
      <PersonalInfo user={user} type="own" handleUpdateFollows={handleShowPendings} />
      {follows && (
        <div className="follow">
          {follows.followers && <FollowsWrapper userId={follows.user_id} follows={follows.followers} title="Followers:" handleShowPendings={handleShowPendings} />}
          {follows.followings && <FollowsWrapper userId={follows.user_id} follows={follows.followings} title="Followings:" handleShowPendings={handleShowPendings} />}
          {follows.pendings && <FollowsWrapper userId={follows.user_id} follows={follows.pendings} title="Pendings:" handleShowPendings={handleShowPendings} />}
        </div>
      )}
      <Notifications />
      <PostForm userId={user.id} setPosts={setPosts} follows={follows} />
      {posts && <Posts posts={posts} type="you" userId={user.id} />}
    </div>
  );
};

export default PersonalProfile;
