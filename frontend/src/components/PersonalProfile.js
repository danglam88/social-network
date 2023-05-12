import Posts from "./Posts";
import PostForm from "./PostForm";
import PersonalInfo from "./PersonalInfo";
import Notifications from "./Notifications";

const PersonalProfile = ({user, posts, setPosts, follows, handleShowPendings, notifications, setNotifications}) => {
  return (
    <div className="personal-profile-wrapper">
      <PersonalInfo user={user} type="own" handleUpdateFollows={handleShowPendings} follows={follows} />
      <Notifications notifications={notifications} setNotifications={setNotifications} />
      <PostForm userId={user.id} setPosts={setPosts} follows={follows} />
      {posts && <Posts posts={posts} type="you" userId={user.id} />}
    </div>
  );
};

export default PersonalProfile;
