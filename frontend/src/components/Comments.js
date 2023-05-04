const Comment = ({ comment, userId }) => {
    return (
      <div className="comment-wrapper">
        {userId != comment.UserID ? <div className="wrote">{comment.UserName} wrote:</div> : <div className="wrote">you wrote:</div>}
        <div className="comment-content">{comment.Content}</div>
        <div className="created-at">created at {comment.CreatedAt.replace("T", " ").replace("Z", "")}</div>
        {comment.ImgUrl === "" ? null : (
          <div className="comment-image">
            <img
              src={`http://localhost:8080${comment.ImgUrl}`}
              alt="Comment Image"
            />
          </div>
        )}
      </div>
    );
}

//change posts to comments
const Comments = ({comments, userId}) => {
        return (
          <div className="comments-wrapper">
            {comments && (
              <>
                <h3>Comments:</h3>
                {comments.map((comment) => (
                  <Comment comment={comment} key={comment.ID} userId={userId} />
                ))}
              </>
            )}
          </div>
        );
}

export default Comments
