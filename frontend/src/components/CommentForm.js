import React, { useState } from "react";
import axios from "axios";

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

      const clientToken = document.cookie
        .split("; ")
        .find((row) => row.startsWith("session_token="))
        ?.split("=")[1];

      const config = {
        headers: {
          Authorization: `Bearer ${clientToken}`,
          "Content-Type": "multipart/form-data",
        },
      };

      const response = await axios.post(
        "http://localhost:8080/comment",
        formData,
        config
      );

      console.log("Comment created:", response.data);
      window.location.reload();
    } catch (error) {
      console.error("Error creating comment:", error);
    }
  };

  return (
    <div className="comment-form">
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="content">Content:</label>
          <textarea
            id="content"
            name="content"
            value={content}
            onChange={handleContentChange}
          />
        </div>
        <div>
          <label htmlFor="picture">Picture:</label>
          <input
            type="file"
            id="picture"
            name="picture"
            onChange={handlePictureChange}
          />
        </div>
        <div>
          <button type="submit">Submit</button>
        </div>
        {errorMessage && <div>{errorMessage}</div>}
      </form>
    </div>
  );
};

export default CommentForm;
