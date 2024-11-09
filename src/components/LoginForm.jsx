import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import LoadingIndicator from "./LoadingIndicator";
import "../styles/AuthForm.css";

import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import api from "../api";

function LoginForm() {
  const { login } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); // Error message state

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    setLoading(true);
    event.preventDefault();

    // Clear any previous error messages
    setErrorMessage("");

    try {
      const response = await api.post("/auth/login/", {
        username,
        password,
      });

      if (response.status === 200) {
        localStorage.setItem(ACCESS_TOKEN, response.data.access);
        localStorage.setItem(REFRESH_TOKEN, response.data.refresh);
        login();
        navigate("/home");
      }

    } catch (error) {
      if (error.response && error.response.status === 401) {
        setErrorMessage("Invalid username or password.");
      } else {
        setErrorMessage("An error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <h1>Login</h1>
      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
      <input
        className="form-input"
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
      />
      <input
        className="form-input"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      {loading && <LoadingIndicator />}
      <button className="form-button" type="submit">
        Login
      </button>
      <p>
        Don't have an account yet? <Link to="/register">Register</Link>
      </p>
    </form>
  );
}

export default LoginForm;
