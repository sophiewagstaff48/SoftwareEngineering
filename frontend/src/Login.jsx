import React, { useState } from "react";

const Login = ({ setActiveTab, setIsLoggedIn }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
        credentials: "include"
      });

      const data = await response.json();
      if (response.ok) {
        setIsLoggedIn(true); 
        setActiveTab("images"); 
      } else {
        console.error("Login failed:", data);
        setError(data.message);
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Login error: Something went wrong. Please try again. " + err.message);
    }
  };

  return (
    <div className="login-wrapper">
      <form className="login-form" onSubmit={handleLogin}>
        <h2 className="login-title">Login</h2>
        <input
          type="text"
          placeholder="Username"
          className="login-input"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="login-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p className="login-error">{error}</p>}
        <button type="submit" className="login-button">Log In</button>
      </form>
    </div>
  );

};

export default Login;
