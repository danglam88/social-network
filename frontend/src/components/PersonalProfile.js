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
          {follows.followers && <FollowsWrapper userId={follows.user_id} follows={follows.followers} title="Follower(s):" handleShowPendings={handleShowPendings} />}
          {follows.followings && <FollowsWrapper userId={follows.user_id} follows={follows.followings} title="Following(s):" handleShowPendings={handleShowPendings} />}
          {follows.pendings && <FollowsWrapper userId={follows.user_id} follows={follows.pendings} title="Pending(s):" handleShowPendings={handleShowPendings} />}
        </div>
      )}
      <Notifications />
      <PostForm userId={user.id} setPosts={setPosts} />
      {posts && <Posts posts={posts} type="you" userId={user.id} />}
    </div>
  );
};

export default PersonalProfile;
