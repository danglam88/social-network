import React, { useState, useEffect } from "react";
import axios from "axios";
import followsService from "../services/FollowsService";

//send in "groupId={nbr}" as groupId.
const PostForm = (groupId) => {
  const group_id = groupId.groupId;
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [privacy, setPrivacy] = useState("public");
  const [users, setUsers] = useState([]);
  const [picture, setPicture] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [follows, setFollows] = useState(null);

  const followUrl = "http://localhost:8080/follow?user_id=0";

  useEffect(() => {
    if (!groupId.hasOwnProperty("groupId")) {
      followsService.follows(followUrl).then((response) => {
        setFollows(response.data);
      });
    }
  }, []);

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleContentChange = (event) => {
    setContent(event.target.value);
  };

  const handlePrivacyChange = (event) => {
    setPrivacy(event.target.value);
  };

  const handleUsersChange = (event) => {
    setUsers(
      Array.from(event.target.selectedOptions, (option) => option.value)
    );
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
    if (!title || !content) {
      setErrorMessage("Title and content are required");
      return;
    }
    if (!textRegex.test(title) || !textRegex.test(content)) {
      setErrorMessage("Title and content must be regular characters");
      return;
    }
    if (tagRegex.test(title) || tagRegex.test(content)) {
      setErrorMessage("Title and content must not contain HTML tags");
      return;
    }
    if (picture && !imageRegex.test(picture.type)) {
      setErrorMessage(
        "Uploaded image can only have the formats: jpg, jpeg, png, gif, svg"
      );
      return;
    }
    // Send post data and picture file to backend API using Axios or other HTTP client
    try {
      const formData = new FormData();
      formData.append("group_id", group_id);
      formData.append("title", title);
      formData.append("content", content);
      formData.append("visibility", privacy);
      formData.append("allowed_followers", users.join(","));
      if (picture) {
        formData.append("picture", picture);
      }

      const response = await axios.post(
        "http://localhost:8080/post",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Post created:", response.data);
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  return (
  <div>
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="title">Title:</label>
        <input
          type="text"
          id="title"
          name="title"
          value={title}
          onChange={handleTitleChange}
        />
      </div>
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
        <label htmlFor="privacy">Privacy:</label>
        <select
          id="privacy"
          name="privacy"
          value={privacy}
          onChange={handlePrivacyChange}>
          <option value="public">Public</option>
          <option value="allfollowers">Followers Only</option>
          <option value="superprivate">Choose Followers</option>
        </select>
      </div>
      {privacy === "superprivate" && (
        <div>
          <label htmlFor="users">Users:</label>
          <select id="users" name="users" multiple onChange={handleUsersChange}>
            <option value="user1">User 1</option>
            <option value="user2">User 2</option>
            <option value="user3">User 3</option>
          </select>
        </div>
      )}
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

export default PostForm;
