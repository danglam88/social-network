import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";

const PostForm = () => {
  const initialValues = {
    title: "",
    content: "",
    picture: null,
    privacy: "public",
    users: [],
  };

  const validationSchema = Yup.object({
    title: Yup.string().required("Required"),
    content: Yup.string().required("Required"),
    picture: Yup.mixed().required("Required"),
    privacy: Yup.string()
      .oneOf(["public", "allmembers", "private"])
      .required("Required"),
    users: Yup.array().when("privacy", {
      is: "private",
      then: Yup.array().min(1, "Please select at least one user"),
    }),
  });

  const onSubmit = async (values, { setSubmitting }) => {
    // Send post data and picture file to backend API using Axios or other HTTP client
    try {
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("content", values.content);
      formData.append("picture", values.picture);
      formData.append("visibility", values.privacy);
      formData.append("allowed_followers", JSON.stringify(values.users));

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

    setSubmitting(false);
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}>
      {({ isSubmitting, setFieldValue }) => (
        <Form>
          <div>
            <label htmlFor="title">Title:</label>
            <Field type="text" id="title" name="title" />
            <ErrorMessage name="title" />
          </div>

          <div>
            <label htmlFor="content">Content:</label>
            <Field as="textarea" id="content" name="content" />
            <ErrorMessage name="content" />
          </div>

          <div>
            <label htmlFor="picture">Upload picture:</label>
            <input
              type="file"
              id="picture"
              name="picture"
              onChange={(event) => {
                setFieldValue("picture", event.currentTarget.files[0]);
              }}
            />
            <ErrorMessage name="picture" />
          </div>

          <div>
            <label htmlFor="privacy">Privacy:</label>
            <Field as="select" id="privacy" name="privacy">
              <option value="public">Public</option>
              <option value="allmembers">Members only</option>
              <option value="private">Private</option>
            </Field>
            <ErrorMessage name="privacy" />
          </div>

          {values.privacy === "private" && (
            <div>
              <label htmlFor="users">Users:</label>
              <Field as="select" id="users" name="users" multiple>
                <option value="user1">User 1</option>
                <option value="user2">User 2</option>
                <option value="user3">User 3</option>
              </Field>
              <ErrorMessage name="users" />
            </div>
          )}

          <button type="submit" disabled={isSubmitting}>
            Submit
          </button>
        </Form>
      )}
    </Formik>
  );
};

export default PostForm;
