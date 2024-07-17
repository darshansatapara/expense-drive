// src/SigninPage.js

import React, { useState } from "react";
import axios from "axios";
import "../css/SigninPage.css";

const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/signin", {
        email,
        password,
      });
      if (response.data.success) {
        const { accessToken } = response.data;
        // Save the access token to localStorage or cookies
        localStorage.setItem("accessToken", accessToken);
        // Redirect or perform further actions
        console.log("Signin successful");
      } else {
        setError(response.data.message || "Signin failed");
      }
    } catch (error) {
      setError("An error occurred during signin");
      console.error("Failed to sign in", error);
    }
  };

  return (
    <div className="signin-container">
      <div className="logo">
        M<span style={{ color: "black" }}>oney</span> E
        <span style={{ color: "black" }}>xpense</span>
      </div>
      <form className="signin-form" onSubmit={handleSubmit}>
        <div>
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={handleEmailChange}
            required
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={handlePasswordChange}
            required
          />
        </div>
        {error && <p className="error">{error}</p>}
        <button type="submit">Sign In</button>
      </form>
    </div>
  );
};

export default Signin;
