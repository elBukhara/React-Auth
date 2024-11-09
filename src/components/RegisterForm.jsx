import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import LoadingIndicator from "./LoadingIndicator";
import "../styles/AuthForm.css";

import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import api from "../api";

function RegisterForm() {
  const { login } = useContext(AuthContext);
  
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [usernameError, setUsernameError] = useState(""); // Username error state
  const [emailError, setEmailError] = useState("");       // Email error state
  const [generalError, setGeneralError] = useState("");   // General error state

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    setLoading(true);
    event.preventDefault();

    // Clear previous errors
    setUsernameError("");
    setEmailError("");
    setGeneralError("");

    try {
      const response = await api.post("/auth/register/", {
        username,
        email,
        password,
      });

      if (response.status === 201) {
        localStorage.setItem(ACCESS_TOKEN, response.data.access);
        localStorage.setItem(REFRESH_TOKEN, response.data.refresh);
        login();
        navigate("/home");
      }

    } catch (error) {
      if (error.response && error.response.data) {
        // Display specific error messages from the backend
        if (error.response.data.username) {
          setUsernameError(error.response.data.username[0]);
        }
        if (error.response.data.email) {
          setEmailError(error.response.data.email[0]);
        }
        if (!error.response.data.username && !error.response.data.email) {
          setGeneralError("Registration failed.");
        }
      } else {
        setGeneralError("An error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <h1>Register</h1>
      {generalError && <div className="alert alert-danger">{generalError}</div>}

      <input
        className="form-input"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      {emailError && <div className="alert alert-danger">{emailError}</div>}
      
      <input
        className="form-input"
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
      />
      {usernameError && <div className="alert alert-danger">{usernameError}</div>}
      
      <input
        className="form-input"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      
      {loading && <LoadingIndicator />}
      <button className="form-button" type="submit">
        Register
      </button>
      <p>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </form>
  );
}

export default RegisterForm;
