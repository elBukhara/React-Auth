import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import LoadingIndicator from "./LoadingIndicator";
import "../styles/AuthForm.css";

import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import api from "../api";

function RegisterForm() {
  const { login } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    setLoading(true);
    event.preventDefault();

    try {
      const response = await api.post("/auth/register/", {
        username,
        password,
      });

      console.log(response.data);
      
      if (response.status === 201) {
        localStorage.setItem(ACCESS_TOKEN, response.data.access);
        localStorage.setItem(REFRESH_TOKEN, response.data.refresh);
        login();
        navigate("/home");
      } 

    } catch (error) {
      alert(error);
    } finally {
      setLoading(false);
    }

  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
        <h1>Register</h1>
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
            Register
        </button>
        <p>
            Already have an account? <Link to="/login">Login</Link>
        </p>
    </form>
  );
}

export default RegisterForm;