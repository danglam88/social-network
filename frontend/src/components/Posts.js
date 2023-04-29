import Comments from './Comments.js'
import CommentForm from './CommentForm.js'

const Post = ({post, type}) => {
    return (
      <div className="post-wrapper">
        <div className="wrote">
          {type === "you" ? <span>{type} posted:</span> :
            <span>{post.creator_name} posted:</span>
          }
        </div>
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

const Posts = ({posts, type}) => {
    return (
        <div className="created-posts-wrapper">
            {type === "you" ? <h2>Your created posts:</h2> :
              type === "group" ? (
                <h2>Group's created posts:</h2>
              ) : (
                <h2>Created posts:</h2>
              )
            }
            {posts && posts.map(post =>
                <Post post={post} key={post.id} type={type} />
            )}
        </div>
    )
}

export default Posts
