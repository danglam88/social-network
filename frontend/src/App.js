import logo from "./logo.svg";
import "./App.css";
import RegisterForm from "./components/RegisterForm";
import LoginForm from "./components/LoginForm";
import PersonalProfile from "./components/PersonalProfile";
import Chat from "./components/GroupChat";
import GroupList from "./components/GroupList";
import WebSocketService from "./services/WebSocketService";
import NotificationIcon from "./components/NotificationIcon";

function App() {
  let token = "";
  let wsurl = "ws://localhost:8080/ws";

  if (document.cookie.includes("session_token")) {
    const tokens = document.cookie.split(";");
    for (let i = 0; i < tokens.length; i++) {
      if (tokens[i].includes("session_token")) {
        token = tokens[i].split("=")[1];
        break; 
      }
    }
  }

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
            <Chat />
            <GroupList />
          </div>
        ) : (
          <div>
            <img src={logo} className="App-logo" alt="logo" />
            <RegisterForm />
            <LoginForm />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;