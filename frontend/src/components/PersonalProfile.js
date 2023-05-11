import Posts from "./Posts";
import PostForm from "./PostForm";
import PersonalInfo from "./PersonalInfo";
import FollowsWrapper from "./FollowsWrapper";
import Notifications from "./Notifications";

const PersonalProfile = ({user, posts, setPosts, follows, handleShowPendings, notifications, setNotifications}) => {
  return (
    <div className="personal-profile-wrapper">
      <h2>Your profile</h2>
      <PersonalInfo user={user} type="own" handleUpdateFollows={handleShowPendings} />
      {follows && (
        <div className="follow">
          {follows.followers && follows.followers.length > 0 && <FollowsWrapper userId={follows.user_id} follows={follows.followers} title="Followers" handleShowPendings={handleShowPendings} />}
          {follows.followings && follows.followings.length > 0 && <FollowsWrapper userId={follows.user_id} follows={follows.followings} title="Followings" handleShowPendings={handleShowPendings} />}
          {follows.pendings && follows.pendings.length > 0 && <FollowsWrapper userId={follows.user_id} follows={follows.pendings} title="Pendings" handleShowPendings={handleShowPendings} />}
        </div>
      )}
      <Notifications notifications={notifications} setNotifications={setNotifications} />
      <PostForm userId={user.id} setPosts={setPosts} follows={follows} />
      {posts && <Posts posts={posts} type="you" userId={user.id} />}
    </div>
  );
};

export default PersonalProfile;
