import React, { useState } from "react";
import axios from "axios";
import logo from "./logo.png";
import "./App.css";
import RegisterForm from "./components/RegisterForm";
import LoginForm from "./components/LoginForm";
import PersonalProfile from "./components/PersonalProfile";

const clientToken = document.cookie
  .split("; ")
  .find((row) => row.startsWith("session_token="))
  ?.split("=")[1];

const config = {
  headers: {
    "Authorization": `Bearer ${clientToken}`,
    "Content-Type": "application/json",
  },
};

function App() {
  const [token, setToken] = useState("");
  const loggedInUrl = "http://localhost:8080/loggedin";

  axios
    .post(loggedInUrl, JSON.stringify({}), config)
    .then((response) => {
      setToken(response.data.token);
    })
    .catch((error) => console.log(error));

  return (
    <>
      {token !== "" ? (
        <PersonalProfile />
      ) : (
        <div className="App-body">
            <div><img src={logo} className="App-logo" alt="logo" /></div>
              <RegisterForm />
              <LoginForm />
        </div>
      )}
    </>
  );
}

export default App;
