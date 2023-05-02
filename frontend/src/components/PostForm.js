import React, { useState, useEffect } from "react";
import followsService from "../services/FollowsService";
import postsService from "../services/PostsService";
import ValidateField from "../services/ValidationService";

//send in "groupId={nbr}" as groupId.
const PostForm = ({groupId = 0}) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [privacy, setPrivacy] = useState("public");
  const [users, setUsers] = useState([]);
  const [picture, setPicture] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [follows, setFollows] = useState(null);

  const followUrl = "http://localhost:8080/follow?user_id=0";

  useEffect(() => {
    if (groupId === undefined) {
      followsService.follows(followUrl).then((response) => {
        setFollows(response.data);
      });
    }
  }, [groupId]);

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
    let Message = ValidateField("Title", title, 1, 30);
    if ( Message !== "") {
      setErrorMessage(Message);
      return;
    }
    Message = ValidateField("Content", content, 1, 3000);
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

    // Send post data and picture file to backend API using Axios or other HTTP client
    try {
      const formData = new FormData();
      formData.append("group_id", groupId);
      formData.append("title", title);
      formData.append("content", content);
      formData.append("visibility", privacy);
      formData.append("allowed_followers", users.join(","));
      if (picture) {
        formData.append("picture", picture);
      }

      postsService.post(formData)
        .then((response) => {
          console.log("Post created:", response.data);
          window.location.reload();
        })
        .catch((error) => console.log(error));
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  return (
    <div className="new-post-wrapper">
      <h2>Create a post</h2>
      <div className="post-comment-form">
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="title">Title:</label>
            <input
              type="text"
              id="title"
              name="title"
              value={title}
              onChange={handleTitleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="content">Content:</label>
            <textarea
              id="content"
              name="content"
              value={content}
              onChange={handleContentChange}
              required
            />
          </div>
          {!groupId && (
            <div>
              <label htmlFor="privacy">Privacy:</label>
              <select
                id="privacy"
                name="privacy"
                value={privacy}
                onChange={handlePrivacyChange}
              >
                <option value="public">Public</option>
                <option value="allfollowers">Followers Only</option>
                {follows && follows.followers && <option value="superprivate">Choose Followers</option>}
              </select>
            </div>
          )}
          {privacy === "superprivate" && follows && follows.followers && (
            <div>
              <label htmlFor="users">Followers:</label>
              <select
                id="users"
                name="users"
                multiple
                onChange={handleUsersChange}
              >
                {follows.followers.map((follow) => (
                  <option key={follow.id} value={follow.id}>
                    {follow.nick_name
                      ? follow.nick_name
                      : follow.first_name + " " + follow.last_name}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div>
            <label htmlFor="picture" >
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
            <button type="submit">Publish</button>
          </div>
          {errorMessage && <div>{errorMessage}</div>}
        </form>
      </div>
    </div>
  );
};

export default PostForm;
