import React, { useState } from "react";
import axios from "axios";
import logo from "./logo.png";
import "./App.css";
import RegisterForm from "./components/RegisterForm";
import LoginForm from "./components/LoginForm";
import PersonalProfile from "./components/PersonalProfile";

function App() {
  const [token, setToken] = useState("");
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
    })
    .catch((error) => console.log(error));

  return (
    <div className="App">
      <div className="App-body">
        {token !== "" ? (
          <PersonalProfile />
        ) : (
          <div>
            <img src={logo} className="App-logo" alt="logo" />
            <div id="div-form">
              <RegisterForm />
              <LoginForm />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
