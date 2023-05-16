import Posts from "./Posts";
import PostForm from "./PostForm";
import PersonalInfo from "./PersonalInfo";
import Notifications from "./Notifications";

const PersonalProfile = ({user, posts, setPosts, follows, handleShowPendings, notifications, setNotifications}) => {
  return (
    <div className="personal-profile-wrapper">
      <PersonalInfo user={user} type="own" handleUpdateFollows={handleShowPendings} follows={follows} />
      <PostForm userId={user.id} setPosts={setPosts} follows={follows} />
      {posts && posts.length > 0 && <Posts posts={posts} type="you" userId={user.id} />}
    </div>
  );
};

export default PersonalProfile;
