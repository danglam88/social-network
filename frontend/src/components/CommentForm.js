import React, { useState, useEffect } from "react";
import commentsService from "../services/CommentsService";
import ValidateField from "../services/ValidationService";

const CommentForm = ({ postId, setComments }) => {
  const [content, setContent] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleContentChange = (event) => {
    setContent(event.target.value);
  };

  let [picture, setCommentPicture] = useState(null);

  const handleCommentPictureChange = (event) => {
    setCommentPicture(event.target.files[0]);
  };

  useEffect(() => {
    // Add your logic here
  }, [picture]);
  

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validation
    let Message = ValidateField("Content", content, 1, 1000);
    if (Message !== "") {
      setErrorMessage(Message);
      return;
    }

    if (picture !== null && picture !== undefined) {
      Message = ValidateField("Picture", picture);
      if (Message !== "") {
        setCommentPicture(null);
        setErrorMessage(Message);
        return;
      }
    }

    try {
      const formData = new FormData();

      formData.append("post_id", postId);
      formData.append("content", content);
      if (picture) {
        formData.append("picture", picture);
      }


      commentsService
        .comment(formData)
        .then((response) => {
          if (response.data.Status === "error") {
            setErrorMessage(response.data.Error);
          } else {
            commentsService
              .comments("http://localhost:8080/comment?post_id=" + postId)
              .then((response) => {
                setComments(response.data);

                setContent("");
                setCommentPicture(null);
                setErrorMessage("");
              })
              .catch((error) => console.log(error));
          }
        })
        .catch((error) => console.log(error));
    } catch (error) {
      console.error("Error creating comment:", error);
    }
  };

  return (
    <div className="post-comment-form">
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="content">Create a comment:</label>
          <textarea
            id="content"
            name="content"
            value={content}
            onChange={handleContentChange}
            required
          />
        </div>
        <div>
          <label htmlFor={`comment${postId}`} className="file-input-btn">
              Upload pictures!
            </label>
            <input
              className="file-input"
              type="file"
              id={`comment${postId}`}
              name="commentPicture"
              onChange={handleCommentPictureChange}
            />
        </div>
        <div>
          <button type="submit">Reply</button>
        </div>
        {errorMessage && <div>{errorMessage}</div>}
      </form>
    </div>
  );
};

export default CommentForm;
