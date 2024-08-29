import {useState} from "react";
import PropTypes from "prop-types";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import styles from "./Auth.module.css";
const AuthForm = ({
  isLogin,
  username,
  setUsername,
  password,
  setPassword,
  handleSubmit,
  message,
}) => (
  <form onSubmit={handleSubmit}>
    <h1>{isLogin ? "Sign In" : "Create Account"}</h1>
    <span>
      {isLogin
        ? "Login With Username & Password"
        : "Register with Username & Password"}
    </span>
    <input
      type="text"
      placeholder="Username"
      value={username}
      onChange={(e) => setUsername(e.target.value)}
    />
    <input
      type="password"
      placeholder="Password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
    />
    {message && <div className={styles.message}>{message}</div>}

    <button type="submit">{isLogin ? "Sign In" : "Sign Up"}</button>
  </form>
);

AuthForm.propTypes = {
  isLogin: PropTypes.bool.isRequired,
  username: PropTypes.string.isRequired,
  setUsername: PropTypes.func.isRequired,
  password: PropTypes.string.isRequired,
  setPassword: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  message: PropTypes.string.isRequired,
};

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const handleSwitch = () => {
    setIsLogin(!isLogin);
    setMessage("");
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = isLogin
      ? "http://localhost:5000/login"
      : "http://localhost:5000/register";

    try {
      const response = await axios.post(url, {username, password});

      if (response.status === 200 || response.status === 201) {
        setMessage(
          isLogin ? "Login successful" : "User registered successfully"
        );

        navigate("/game");
      }
    } catch (error) {
      setMessage(error.response.data);
    }
  };

  return (
    <div className={styles.background}>
      <div
        className={`${styles.container} ${
          !isLogin ? styles.rightPanelActive : ""
        }`}
        id="container"
      >
        <div className={`${styles.formContainer} ${styles.signUp}`}>
          <AuthForm
            isLogin={false}
            username={username}
            setUsername={setUsername}
            password={password}
            setPassword={setPassword}
            handleSubmit={handleSubmit}
            message={message}
          />
        </div>
        <div className={`${styles.formContainer} ${styles.signIn}`}>
          <AuthForm
            isLogin={true}
            username={username}
            setUsername={setUsername}
            password={password}
            setPassword={setPassword}
            handleSubmit={handleSubmit}
            message={message}
          />
        </div>

        <div className={styles.toggleContainer}>
          <div className={styles.toggle}>
            <div className={`${styles.togglePanel} ${styles.toggleLeft}`}>
              <h1>Login yap here!</h1>
              <p>yapyapyapyap</p>
              <button className={styles.hidden} onClick={() => handleSwitch()}>
                Sign In
              </button>
            </div>
            <div className={`${styles.togglePanel} ${styles.toggleRight}`}>
              <h1>Register yap here!</h1>
              <p>yapyapyapyap</p>
              <button className={styles.hidden} onClick={() => handleSwitch()}>
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
