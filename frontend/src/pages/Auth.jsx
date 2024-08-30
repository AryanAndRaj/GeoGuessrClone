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
  setConfirmPassword,
  confirmPassword,
  handleSubmit,
  message,
}) => {
  return (
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
      {!isLogin && (
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      )}
      {message && <div className={styles.message}>{message}</div>}
      <button type="submit">{isLogin ? "Sign In" : "Sign Up"}</button>
    </form>
  );
};

AuthForm.propTypes = {
  isLogin: PropTypes.bool.isRequired,
  username: PropTypes.string.isRequired,
  setUsername: PropTypes.func.isRequired,
  password: PropTypes.string.isRequired,
  setPassword: PropTypes.func.isRequired,
  confirmPassword: PropTypes.string,
  setConfirmPassword: PropTypes.func,
  handleSubmit: PropTypes.func.isRequired,
  message: PropTypes.string.isRequired,
  handleGuestNavigate: PropTypes.func.isRequired,
};

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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

    if (!isLogin && password !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }
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
            confirmPassword={confirmPassword}
            setConfirmPassword={setConfirmPassword}
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
              <h1>Login here!</h1>
              <p>
                Login to see your scores and access the multiplayer leaderboard!
              </p>
              <button className={styles.hidden} onClick={() => handleSwitch()}>
                Sign In
              </button>
              <p className={styles.or}>or</p>
              <button
                className={styles.guestButton}
                onClick={() => navigate("/game")}
              >
                Continue as guest
              </button>
            </div>
            <div className={`${styles.togglePanel} ${styles.toggleRight}`}>
              <h1>Register here!</h1>
              <p>
                Registering allows you to save scores to the global leaderboard!
              </p>
              <button className={styles.hidden} onClick={() => handleSwitch()}>
                Sign Up
              </button>
              <p className={styles.or}>or</p>
              <button
                className={styles.guestButton}
                onClick={() => navigate("/game")}
              >
                Continue as guest
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
