import React, { useState } from 'react';
import axios from 'axios';
import logo from "./logo.svg";
import "./App.css";
import RegisterForm from "./components/RegisterForm";
import LoginForm from "./components/LoginForm";
import PersonalProfile from "./components/PersonalProfile";
import Chat from "./components/Chat";
import GroupList from "./components/GroupList";
import WebSocketService from "./services/WebSocketService";
import NotificationIcon from "./components/NotificationIcon";

function App() {
  const [token, setToken] = useState('');
  const [userId, setUserId] = useState(0);
  const loggedInUrl = 'http://localhost:8080/loggedin';
  const config = {
    headers : {
      'Content-Type': 'application/json'
    }
  };

  let wsurl = "ws://localhost:8080/ws";

  axios.post(loggedInUrl, JSON.stringify({}), config)
    .then(response => {
      setToken(response.data.token)
      setUserId(response.data.user_id)
    })
    .catch(error => console.log(error));

  if (token !== "") {
    // changed condition to check if token is not empty
    WebSocketService.connect(wsurl);
  }

  return (
    <div className="App">
      {token !== "" && ( 
        <header className="App-header">
          <div>
            <NotificationIcon />
          </div>
        </header>
      )}

      <div className="App-body"> {}
        {token !== "" ? (
          <div>
            <PersonalProfile />
            <Chat userId={userId} />
            <GroupList />
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