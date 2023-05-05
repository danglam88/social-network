const Comment = ({ comment, userId }) => {
    console.log("1 comment", comment, "userid ", userId)
    return (
      <div className="comment-wrapper">
        <img className="avatar-symbol" src={`http://localhost:8080${comment.UserAvatar}`} alt=""/>
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
                {comments.map((comment) => {
                    const commentKey = "comment" + comment.ID;
                  return <Comment comment={comment} key={commentKey} userId={userId} />
                })}
              </>
            )}
          </div>
        );
}

export default Comments
