const Comment = ({ comment }) => {
    return (
      <div className="comment-wrapper">
        <div className="wrote">
          <img className="avatar-symbol" src={`http://localhost:8080${comment.user_avatar}`} alt="" />
          <span>{comment.user_name} wrote:</span>
        </div>
        <div className="comment-content" dangerouslySetInnerHTML={{ __html: comment.content }}></div>
        <div className="created-at">created at {comment.created_at.replace("T", " ").replace("Z", "")}</div>
        {comment.img_url === "" ? null : (
          <div className="comment-image">
            <img
              src={`http://localhost:8080${comment.img_url}`}
              alt="Comment Image"
            />
          </div>
        )}
      </div>
    );
}

//change posts to comments
const Comments = ({comments}) => {
        return (
          <div className="comments-wrapper">
            <h3>Comments:</h3>
            {comments.map(comment => {
              const commentKey = "comment" + comment.id;
              return <Comment comment={comment} key={commentKey} />
            })}
          </div>
        );
}

export default Comments
