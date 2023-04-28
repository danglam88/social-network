import React, { useState } from "react";
import commentsService from '../services/CommentsService'

const CommentForm = (postId) => {
  
  const [content, setContent] = useState("");
  const [picture, setPicture] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const handleContentChange = (event) => {
    setContent(event.target.value);
  };

  const handlePictureChange = (event) => {
    setPicture(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validation
    const textRegex = /^[\x20-\x7E]+$/;
    const tagRegex = /<[^>]*>/g;
    const imageRegex = /(jpe?g|png|gif|svg)/;
    if (!content) {
      setErrorMessage("Content is required");
      return;
    }
    if (!textRegex.test(content)) {
      setErrorMessage("Content must be regular characters");
      return;
    }
    if (tagRegex.test(content)) {
      setErrorMessage("Content must not contain HTML tags");
      return;
    }
    if (picture && !imageRegex.test(picture.type)) {
      setErrorMessage(
        "Uploaded image can only have the formats: jpg, jpeg, png, gif, svg"
      );
      return;
    }

    try {
      const formData = new FormData();
      formData.append("post_id", postId.post);
      formData.append("content", content);
      if (picture) {
        formData.append("picture", picture);
      }

      commentsService.comment(formData)
        .then((response) => {
          console.log("Comment created:", response.data);
          window.location.reload();
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
          />
        </div>
        <div>
          <label htmlFor="picture" className="file-input-btn">
            Upload picture
          </label>
          <input
            type="file"
            className="file-input"
            id="picture"
            name="picture"
            onChange={handlePictureChange}
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
