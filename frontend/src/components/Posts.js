import Comments from './Comments.js'
import CommentForm from './CommentForm.js'

const Post = ({ post }) => {

    return (
      <div className="post-wrapper">
        <div className="wrote">you posted:</div>
        <div>
          <h3>{post.title}</h3>
        </div>
        <div>{post.content}</div>
        <div className="created-at">created at {post.created_at}</div>
        {post.img_url === "" ? null : (
          <div className="post-image">
            <img
              src={`http://localhost:8080${post.img_url}`}
              alt="Post Image"
            />
          </div>
        )}
        <Comments post={post.id} />
        <CommentForm post={post.id} />
      </div>
    );
}

const Posts = ({posts}) => {
    return (
        <div className="created-posts-wrapper">
            <h2>Your created posts:</h2>
            {posts && posts.map(post =>
                <Post post={post} key={post.id} />
            )}
        </div>
    )
}

export default Posts
