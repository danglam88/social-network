import Comments from './Comments.js'
import CommentForm from './CommentForm.js'

const Post = ({ post }) => {
    console.log(post)
    return (
      <div>
        <span> {post.creator_id} </span>
        <span> {post.creator_name} </span>
        <span> {post.group_id} </span>
        <span> {post.visibility} </span>
        <span> {post.title} </span>
        <span> {post.content} </span>
        <span> {post.created_at} </span>
        <span> test2 </span>
        <span>
          {post.img_url === "" ? null : (
            <img
              src={`http://localhost:8080${post.img_url}`}
              alt="Post Image"
            />
          )}
        </span>
        <Comments post={post.id} />
        <CommentForm post={post.id} />
      </div>
    );
}

const Posts = ({posts}) => {
    return (
        <div>
            <h3>Created Posts:</h3>
            <div>
                <span> Creator ID </span>
                <span> Creator Name </span>
                <span> Group ID </span>
                <span> Visibility </span>
                <span> Title </span>
                <span> Content </span>
                <span> Created At </span>
                <span> Image URL </span>
            </div>
            {posts && posts.map(post =>
                <Post post={post} key={post.id} />
            )}
        </div>
    )
}

export default Posts
