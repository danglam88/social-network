import React, { useEffect, useState } from 'react'
import Comments from './Comments.js'
import CommentForm from './CommentForm.js'
import commentsService from '../services/CommentsService'

const Post = ({post, type, userId}) => {
  console.log("Post:", post)
  const [comments, setComments] = useState([]);

  useEffect(() => {
    commentsService
      .comments("http://localhost:8080/comment?post_id=" + post.id)
      .then((response) => {
        setComments(response.data);
      })
      .catch((error) => console.log(error));
  }, []);

  return (
      <div className="post-wrapper">
        <div className="wrote">
          <img className="avatar-symbol" src={`http://localhost:8080${post.creator_avatar}`} alt=""/>
          {type === "you" || type !== "group" ? <span>{type} posted:</span> : userId != post.creator_id ? <span>{post.creator_name} posted:</span> : <span>you posted:</span>}
        </div>
        <div>
          <h3>{post.title}</h3>
        </div>
        <div>{post.content}</div>
        <div className="created-at">created at {post.created_at.replace("T", " ").replace("Z", "")}</div>
        {post.img_url === "" ? null : (
          <div className="post-image">
            <img
              src={`http://localhost:8080${post.img_url}`}
              alt="Post Image"
            />
          </div>
        )}
        <Comments comments={comments} userId={userId} />
        <CommentForm postId={post.id} setComments={setComments} />
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
            {posts && posts.map(post => {
                const postKey = "post" + post.id;
                return <Post post={post} key={postKey} type={type} userId={userId} />
            })}
        </div>
    )
}

export default Posts
