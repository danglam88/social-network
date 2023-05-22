import React, { useEffect, useState } from 'react'
import Comments from './Comments.js'
import CommentForm from './CommentForm.js'
import commentsService from '../services/CommentsService'

const Post = ({post}) => {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    commentsService
      .comments("http://localhost:8080/comment?post_id=" + post.id)
      .then((response) => {
        setComments(response.data);
      })
      .catch((error) => console.log(error));
  }, [post.id]);

  const NewlineText = ({text}) => {
    const newText = text.split('\r\n').map((str, id) => <p key={id}>{str}</p>);
    
    return newText;
  }

  return (
      <div className="post-wrapper">
        <div className="wrote">
          <img className="avatar-symbol" src={`http://localhost:8080${post.creator_avatar}`} alt=""/>
          <span>{post.creator_name} posted:</span>
        </div>
        <div>
          <h3>{post.title}</h3>
        </div>
        <div><NewlineText text={post.content}></NewlineText></div>
        <div className="created-at">created at {post.created_at.replace("T", " ").replace("Z", "")}</div>
        {post.img_url === "" ? null : (
          <div className="post-image">
            <img
              src={`http://localhost:8080${post.img_url}`}
              alt="Post Image"
            />
          </div>
        )}
        {comments && comments.length > 0 && <Comments comments={comments} />}
        <CommentForm postId={post.id} setComments={setComments} />
      </div>
    );
}

const Posts = ({posts}) => {
    return (
        <div className="created-posts-wrapper main-wrapper">
            {posts.map(post => {
                const postKey = "post" + post.id;
                return <Post post={post} key={postKey} />
            })}
        </div>
    )
}

export default Posts
