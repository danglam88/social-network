import React, { useEffect, useState } from 'react'
import commentsService from '../services/CommentsService'

const Comment = ({ comment }) => {
    return (
        <tr>
            <td>{comment.UserID}</td>
            <td>{comment.UserName}</td>
            <td>{comment.Content}</td>
            <td>{comment.CreatedAt}</td>
            <td>{comment.ImgUrl}</td>
        </tr>
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
            <table>
                <thead>
                    <tr>
                        <th>Creator ID</th>
                        <th>Creator Name</th>
                        <th>Content</th>
                        <th>Created At</th>
                        <th>Image URL</th>
                    </tr>
                </thead>
                <tbody>
                    {comments && comments.map(comment =>
                        <Comment comment={comment} key={comment.ID} />
                    )}
                </tbody>
            </table>
        </div>
    )
}

export default Comments
