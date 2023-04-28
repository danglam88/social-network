import React, { useEffect, useState } from 'react'
import commentsService from '../services/CommentsService'

const Comment = ({ comment }) => {
    return (
        <div>
            <span> {comment.UserID} </span>
            <span> {comment.UserName} </span>
            <span> {comment.Content} </span>
            <span> {comment.CreatedAt} </span>
            <span> 
            {comment.img_url === "" ? null : (
            <img
              src={`http://localhost:8080${comment.ImgUrl}`}
              alt="Comment Image"
            />
          )}
            </span>
        </div>
    )
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
        <div>
            <h3>Comments:</h3>
            <div>
                <span> Creator ID </span>
                <span> Creator Name </span>
                <span> Content </span>
                <span> Created At </span>
                <span> Image URL </span>
            </div>
            {comments && comments.map(comment =>
                <Comment comment={comment} key={comment.ID} />
            )}
        </div>
    )
}

export default Comments
