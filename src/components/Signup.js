// src/SignupPage.js

import React from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { SignupProvider, useSignup } from "../context/SignupContext";
import "../css/SignupPage.css";
import client from "../axios";

const validatePassword = (password) => {
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

const Signup = () => {
  const { state, dispatch } = useSignup();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    dispatch({
      type: "SET_FORM_DATA",
      field: name,
      payload: files ? files[0] : value,
    });
  };

  const handleMobileChange = (value) => {
    dispatch({
      type: "SET_FORM_DATA",
      field: "mobileNumber",
      payload: value,
    });
  };

  const handleSendOtp = async () => {
    try {
      const response = await client.post("/api/auth/send-otp", {
        email: state.email,
      });
      if (response.data.success) {
        dispatch({ type: "SET_OTP_SENT", payload: true });
      }
    } catch (error) {
      console.error("Failed to send OTP", error);
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const response = await client.post("/api/auth/verify-otp", {
        email: state.email,
        otp: state.otp,
      });
      if (response.data.success) {
        dispatch({ type: "SET_OTP_VERIFIED", payload: true });
      }
    } catch (error) {
      console.error("Failed to verify OTP", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formErrors = {};
    if (!validatePassword(state.password)) {
      formErrors.password =
        "Password must be at least 8 characters long, contain one uppercase letter, one lowercase letter, one number, and one special character.";
    }
    if (state.password !== state.confirmPassword) {
      formErrors.confirmPassword = "Passwords do not match.";
    }
    dispatch({ type: "SET_FORM_ERRORS", payload: formErrors });

    if (Object.keys(formErrors).length === 0 && state.isOtpVerified) {
      try {
        const formData = new FormData();
        for (const key in state) {
          if (
            state[key] &&
            key !== "formErrors" &&
            key !== "isOtpSent" &&
            key !== "isOtpVerified"
          ) {
            formData.append(key, state[key]);
          }
        }

        const response = await client.post("/api/auth/signup", formData);
        if (response.data.success) {
          console.log("Signup successful");
        }
      } catch (error) {
        console.error("Failed to sign up", error);
      }
    }
  };

  return (
    <div className="signup-container">
      <div className="logo">
        M<span style={{ color: "black" }}>oney</span> E
        <span style={{ color: "black" }}>xpense</span>
      </div>
      {state.profilePicture && (
        <div className="profile-preview">
          <img
            src={URL.createObjectURL(state.profilePicture)}
            alt="Profile"
            className="profile-image"
          />
        </div>
      )}
      <form className="signup-form" onSubmit={handleSubmit}>
        <div>
          <label>Profile Picture</label>
          <input
            type="file"
            name="profilePicture"
            accept="image/*"
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Username</label>
          <input
            type="text"
            name="username"
            value={state.username}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Full Name</label>
          <input
            type="text"
            name="fullName"
            value={state.fullName}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={state.email}
            onChange={handleChange}
            required
          />
        </div>
        {state.isOtpSent && (
          <div>
            <label>Enter OTP</label>
            <input
              type="text"
              name="otp"
              value={state.otp}
              onChange={handleChange}
              required
            />
            <button type="button" onClick={handleVerifyOtp}>
              Verify OTP
            </button>
          </div>
        )}
        <div className="mobile-input">
          <label>Mobile Number</label>
          <PhoneInput
            className="PhoneInput"
            country={"us"}
            value={state.mobileNumber}
            onChange={handleMobileChange}
            required
          />
        </div>
        <div>
          <label>Date of Birth</label>
          <input
            type="date"
            name="dateOfBirth"
            value={state.dateOfBirth}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Gender</label>
          <select
            className="gender-dropdown"
            name="gender"
            onChange={handleChange}
            required
          >
            <option value="" disabled selected>
              Select your gender
            </option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label>Profession</label>
          <select
            name="profession"
            value={state.profession}
            onChange={handleChange}
            required
          >
            <option value="">Select Profession</option>
            <option value="student">Student</option>
            <option value="developer">Developer</option>
            <option value="designer">Designer</option>
            <option value="manager">Manager</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={state.password}
            onChange={handleChange}
            required
          />
          {state.formErrors.password && (
            <p className="error">{state.formErrors.password}</p>
          )}
        </div>
        <div>
          <label>Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={state.confirmPassword}
            onChange={handleChange}
            required
          />
          <div className="verify-otp">
            <button
              type="button"
              onClick={handleSendOtp}
              disabled={state.isOtpSent}
            >
              Send OTP
            </button>
            <div className="otp-input">
              <input type="number" placeholder="Enter OTP" />
              <button type="button" onClick={handleVerifyOtp}>
                Verify
              </button>
            </div>
          </div>

          {state.formErrors.confirmPassword && (
            <p className="error">{state.formErrors.confirmPassword}</p>
          )}
        </div>
        <button type="submit" disabled={!state.isOtpVerified}>
          Sign Up
        </button>
        <button type="button" onClick={() => dispatch({ type: "CLEAR_FORM" })}>
          Clear Form
        </button>
      </form>
    </div>
  );
};

const SignupPage = () => (
  <SignupProvider>
    <Signup />
  </SignupProvider>
);

export default SignupPage;
