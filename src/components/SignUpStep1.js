// src/components/SignUpStep1.js
import React, { useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import { SignUpContext } from "../context/SignUpContext";

const SignUpStep1 = () => {
  const { state, dispatch } = useContext(SignUpContext);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
  });
  const history = useHistory();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch({ type: "SET_STEP1_DATA", payload: formData });
    history.push("/signup-step2");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="username"
        placeholder="Username"
        value={formData.username}
        onChange={handleChange}
        required
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        required
      />
      <input
        type="tel"
        name="phone"
        placeholder="Phone Number"
        value={formData.phone}
        onChange={handleChange}
        required
      />
      <button type="submit">Next</button>
    </form>
  );
};

export default SignUpStep1;
