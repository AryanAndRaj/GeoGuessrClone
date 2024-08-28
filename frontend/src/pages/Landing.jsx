import { useNavigate } from "react-router-dom";

const Landing = () => {

  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/login');
  }

  const handleRegister = () => {
    navigate('/register');
  }

  const handleGuest = () => {
    navigate('/game');
  }

  return (
    <div>
      <h1>Hello World</h1>
      <button onClick={(handleLogin)}>Login</button>
      <button onClick={(handleRegister)}>Register</button>
      <button onClick={(handleGuest)}>Play As Guest</button>
    </div>
  );
};

export default Landing;
