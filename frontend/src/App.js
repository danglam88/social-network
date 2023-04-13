import logo from './logo.svg';
import './App.css';
import RegisterForm from './components/RegisterForm';
import LoginForm from './components/LoginForm'

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <RegisterForm></RegisterForm>
        <LoginForm></LoginForm>
        
      </header>
    </div>
  );
}

export default App;
