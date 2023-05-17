import React, { useState } from "react";
import postsService from "../services/PostsService";
import ValidateField from "../services/ValidationService";
import groupService from "../services/GroupsService";

//send in "groupId={nbr}" as groupId.
const PostForm = ({groupId = 0, setGroupInfo, userId, setPosts, follows}) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [privacy, setPrivacy] = useState("public");
  const [users, setUsers] = useState([]);
  const [picture, setPicture] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [showForm, setShowForm] = useState(false)

  const uploadDiv = document.getElementById("upload-post");
  if (uploadDiv) {
    uploadDiv.className = "upload";
  }

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleContentChange = (event) => {
    setContent(event.target.value);
  };

  const handlePrivacyChange = (event) => {
    setPrivacy(event.target.value);
    if (event.target.value !== "superprivate") {
      setUsers([]);
    }
  };

  const handleUsersChange = (event) => {
    setUsers(
      Array.from(event.target.selectedOptions, (option) => option.value)
    );
  };

  const handlePictureChange = (event) => {
    setPicture(event.target.files[0]);
    if (event.target.files[0] != null) {
      uploadDiv.innerHTML = `${event.target.files[0].name} attached!`;
    } else {
      uploadDiv.innerHTML = "";
    }
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
        setErrorMessage(Message);
        return;
      }
    }
    if ( privacy === "superprivate" && users.length === 0) {
      setErrorMessage("You must select at least one follower");
      return;
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
          if (response.data.Status === "error") {
            setErrorMessage(response.data.Error);
          } else {
          console.log("Post created:", response.data);

          if (!groupId) {
            postsService
              .posts("http://localhost:8080/post?creator_id=" + userId)
              .then((response) => {
                setPosts(response.data);

                setTitle("");
                setContent("");
                setPrivacy("public");
                setUsers([]);
                setPicture(null);
                setErrorMessage("");
                uploadDiv.innerHTML = "";
              })
              .catch((error) => console.log(error));
          } else {
            groupService
              .group(groupId)
              .then(response => {
                setGroupInfo(response.data)

                setTitle("");
                setContent("");
                setPicture(null);
                setErrorMessage("");
                uploadDiv.innerHTML = "";
              })
              .catch(error => console.log(error))
          }
        }
        })
        .catch((error) => setErrorMessage(error.response.data.Error));
        
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  return (
    <div className="new-post-wrapper">
      <div className="accordion" onClick={() => setShowForm(!showForm)}><h2>Create a new post</h2></div>
      <div className={showForm? 'post-comment-form panel' : 'post-comment-form panel hidden'}>
        <form onSubmit={handleSubmit} className="create-post">
          <div>
            <label htmlFor="title">Title:</label>
            <input
              type="text"
              id="title"
              name="title"
              value={title}
              onChange={handleTitleChange}
              placeholder="New post title"
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
              placeholder="New post content"
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
                {follows && follows.followers && follows.followers.length > 0 && <option value="superprivate">Choose Followers</option>}
              </select>
            </div>
          )}
          {privacy === "superprivate" && follows && follows.followers && follows.followers.length > 0 && (
            <div>
              <label htmlFor="users">Followers:</label>
              <select
                id="users"
                name="users"
                multiple
                onChange={handleUsersChange}
              >
                {follows.followers.map((follow) => {
                  const postFollowerKey = "postFollower" + follow.id;
                  return <option key={postFollowerKey} value={follow.id}>
                    {follow.nick_name
                      ? follow.nick_name
                      : follow.first_name + " " + follow.last_name}
                  </option>
                })}
              </select>
            </div>
          )}
          <div>
            <label htmlFor="picture" className="file-input-btn">
              Upload picture
            </label>
            <input
              className="file-input"
              type="file"
              id="picture"
              name="picture"
              onChange={handlePictureChange}
            />
            <div id="upload-post"></div>
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
