import Comments from './Comments.js'
import CommentForm from './CommentForm.js'

const Post = ({post, type, userId}) => {
    return (
      <div className="post-wrapper">
        <div className="wrote">
          {type === "you" || type !== "group" ? <span>{type} posted:</span> : userId !== post.creator_id ? <span>{post.creator_name} posted:</span> : <span>you posted:</span>}
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
        <Comments postId={post.id} userId={userId} />
        <CommentForm postId={post.id} />
      </div>
    );
}

const Posts = ({posts, type, userId}) => {
    return (
        <div className="created-posts-wrapper">
            {type === "you" ? <h2>Your created posts:</h2> :
              type === "group" ? (
                <h2>Group's created posts:</h2>
              ) : (
                <h2>{type}'s created posts:</h2>
              )
            }
            {posts && posts.map(post =>
                <Post post={post} key={post.id} type={type} userId={userId} />
            )}
        </div>
    )
}

export default Posts
