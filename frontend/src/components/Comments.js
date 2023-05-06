const Comment = ({ comment, userId }) => {
    return (
      <div className="comment-wrapper">
        <div className="wrote">
          <img className="avatar-symbol" src={`http://localhost:8080${comment.UserAvatar}`} alt=""/>
          {userId != comment.UserID ? <span>{comment.UserName} wrote:</span> : <span>you wrote:</span>}
        </div>
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
                {comments.map((comment, i) => 
                  <Comment comment={comment} key={i} userId={userId} />
                )}
              </>
            )}
          </div>
        );
}

export default Comments
