import React, { useState } from "react";
import commentsService from "../services/CommentsService";
import ValidateField from "../services/ValidationService";

const CommentForm = ({ postId, setComments }) => {
  const [content, setContent] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [picture, setCommentPicture] = useState(null);

  const uploadDiv = document.getElementById(`upload-comment${postId}`);
  if (uploadDiv) {
    uploadDiv.className = "upload";
  }

  const handleContentChange = (event) => {
    setContent(event.target.value);
  };

  const handleCommentPictureChange = (event) => {
    setCommentPicture(event.target.files[0]);
    if (event.target.files[0] != null) {
      uploadDiv.innerHTML = `${event.target.files[0].name} attached!`;
    } else {
      uploadDiv.innerHTML = "";
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validation
    let Message = ValidateField("Content", content, 1, 1000);
    if (Message !== "" && content.length > 0) {
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

    if (content.length === 0 && picture === null) {
      setErrorMessage("You must write something or attach a picture!");
      return;
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
                uploadDiv.innerHTML = "";
              })
              .catch((error) => console.log(error));
          }
        })
        .catch((error) => setErrorMessage(error.response.data.Error));
    } catch (error) {
      console.error("Error creating comment:", error);
    }
  };

  return (
    <div className="post-comment-form">
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="content">Create comment:</label>
          <textarea
            id="content"
            name="content"
            value={content}
            onChange={handleContentChange}
          />
        </div>
        <div>
          <label htmlFor={`comment${postId}`} className="file-input-btn">
              Upload picture
            </label>
            <input
              className="file-input"
              type="file"
              id={`comment${postId}`}
              name="commentPicture"
              onChange={handleCommentPictureChange}
            />
            <div id={`upload-comment${postId}`}></div>
        </div>
        <div>
          <button type="submit">Reply</button>
        </div>
        {errorMessage && <div className="error register-error">{errorMessage}</div>}
      </form>
    </div>
  );
};

export default CommentForm;
