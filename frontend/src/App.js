import logo from "./logo.svg";
import "./App.css";
import RegisterForm from "./components/RegisterForm";
import LoginForm from "./components/LoginForm";
import PersonalProfile from "./components/PersonalProfile";
import Chat from "./components/GroupChat";
import GroupList from "./components/GroupList";

function App() {
  let token = "";

  if (document.cookie.includes("session_token")) {
    const tokens = document.cookie.split(";");
    for (let i = 0; i < tokens.length; i++) {
      if (tokens[i].includes("session_token")) {
        token = tokens[i].split("=")[1]
      }
    }
  }

  return (
    <div className="App">
      <header className="App-header">
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
      </header>
    </div>
  );
}

export default App;
