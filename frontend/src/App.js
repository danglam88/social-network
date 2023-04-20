import React, { useState } from "react";
import axios from "axios";
import logo from "./logo.svg";
import "./App.css";
import RegisterForm from "./components/RegisterForm";
import LoginForm from "./components/LoginForm";
import PersonalProfile from "./components/PersonalProfile";
import PostForm from "./components/PostForm";

function App() {
  const [token, setToken] = useState("");
  const [userId, setUserId] = useState(0);
  const loggedInUrl = "http://localhost:8080/loggedin";
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  axios
    .post(loggedInUrl, JSON.stringify({}), config)
    .then((response) => {
      setToken(response.data.token);
      setUserId(response.data.user_id);
    })
    .catch((error) => console.log(error));

  return (
    <div className="App">
      <div className="App-body">
        {" "}
        {}
        {token !== "" ? (
          <div>
            <PersonalProfile />
            <PostForm />
          </div>
        ) : (
          <div>
            <img src={logo} className="App-logo" alt="logo" />
            <div id="div-form">
              <RegisterForm />
            </div>
            <LoginForm />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
