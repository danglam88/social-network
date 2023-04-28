import React, { useEffect, useState } from 'react'
import commentsService from '../services/CommentsService'

const Comment = ({ comment }) => {
    return (
      <div className="comment-wrapper">
        <div className="wrote">{comment.UserName} wrote:</div>
        <div className="comment-content">{comment.Content}</div>
        <div className="created-at">created at {comment.CreatedAt}</div>
        <span> {comment.ImgUrl} </span>
      </div>
    );
}

//change posts to comments
const Comments = (id) => {
    const [comments, setComments] = useState([]);

    useEffect(() => {
        commentsService
          .comments("http://localhost:8080/comment?post_id=" + id.post)
          .then((response) => {
            setComments(response.data);
          })
          .catch((error) => console.log(error));
        }, []);
    
        return (
          <div className="comments-wrapper">
            {comments && (
              <>
                <h3>Comments:</h3>
                {comments.map((comment) => (
                  <Comment comment={comment} key={comment.ID} />
                ))}
              </>
            )}
          </div>
        );
}

export default Comments
