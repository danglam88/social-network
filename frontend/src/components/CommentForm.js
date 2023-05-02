import React, { useState } from "react";
import commentsService from '../services/CommentsService'
import ValidateField from "../services/ValidationService";

const CommentForm = ({postId, setComments}) => {
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
    let Message = ValidateField("Content", content, 1, 1000);
    if ( Message !== "") {
      setErrorMessage(Message);
      return;
    }

    if ( picture !== null && picture !== undefined) {
      Message = ValidateField("Picture", picture);
      if ( Message !== "") {
        setPicture(null);
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

      commentsService.comment(formData)
        .then((response) => {
          console.log("Comment created:", response.data);
          //window.location.reload();

          commentsService
            .comments("http://localhost:8080/comment?post_id=" + postId)
            .then((response) => {
              setComments(response.data);

              setContent("");
              setPicture(null);
              setErrorMessage("");
            })
            .catch((error) => console.log(error));
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
          <label htmlFor="picture">
            Upload picture
          </label>
          <input
            type="file"
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
