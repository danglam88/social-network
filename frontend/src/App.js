import logo from './logo.svg';
import './App.css';
import RegisterForm from './components/RegisterForm';
import LoginForm from './components/LoginForm';
import PersonalProfile from './components/PersonalProfile';

function App() {
  const isCookieSet = document.cookie.includes("session_token");

  return (
    <div className="App">
      <header className="App-header">
        {isCookieSet ? <PersonalProfile></PersonalProfile> :
          <div>
            <img src={logo} className="App-logo" alt="logo" />
            <RegisterForm></RegisterForm>
            <LoginForm></LoginForm>
          </div>}
      </header>
    </div>
  );
}

export default App;
