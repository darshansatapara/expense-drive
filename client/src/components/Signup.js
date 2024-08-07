import React, { useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import "../css/SignupPage.css";
import client from "../axios";

const validatePassword = (password) => {
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

const convertImageToBase64 = (imageFile) => {
  return new Promise((resolve, reject) => {
    if (!imageFile || !(imageFile instanceof Blob)) {
      reject("No valid image selected.");
    }

    const reader = new FileReader();
    reader.readAsDataURL(imageFile);
    reader.onload = () => {
      resolve(reader.result.split(",")[1]);
    };
    reader.onerror = (error) => {
      reject("Error converting image to base64: " + error);
    };
  });
};

const Signup = () => {
  const [formData, setFormData] = useState({
    profilePicture: null,
    username: "",
    fullName: "",
    email: "",
    mobileNumber: "",
    dateOfBirth: "",
    gender: "",
    profession: "",
    password: "",
    confirmPassword: "",
    otp: "",
    isOtpSent: false,
    isOtpVerified: false,
    formErrors: {},
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: files ? files[0] : value,
    }));
  };

  const handleMobileChange = (value) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      mobileNumber: value,
    }));
  };

  const handleSendOtp = async () => {
    try {
      const response = await client.post("/auth/send-otp", {
        email: formData.email,
      });
      if (response.data.success) {
        setFormData((prevFormData) => ({
          ...prevFormData,
          isOtpSent: true,
        }));
      }
    } catch (error) {
      console.error("Failed to send OTP", error);
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const response = await client.post("/auth/verify-otp", {
        email: formData.email,
        otp: formData.otp,
      });
      if (response.data.success) {
        console.log("verified");
        setFormData((prevFormData) => ({
          ...prevFormData,
          isOtpVerified: true,
        }));
      }
    } catch (error) {
      console.error("Failed to verify OTP", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formErrors = {};
    if (!validatePassword(formData.password)) {
      formErrors.password =
        "Password must be at least 8 characters long, contain one uppercase letter, one lowercase letter, one number, and one special character.";
    }
    if (formData.password !== formData.confirmPassword) {
      formErrors.confirmPassword = "Passwords do not match.";
    }
    setFormData((prevFormData) => ({
      ...prevFormData,
      formErrors,
    }));

    if (Object.keys(formErrors).length === 0 && formData.isOtpVerified) {
      try {
        if (formData.profilePicture) {
          const imageBase64 = await convertImageToBase64(
            formData.profilePicture
          );
          formData.profilePicture = imageBase64;
        }

        const formPayload = new FormData();
        for (const key in formData) {
          if (
            formData[key] &&
            key !== "formErrors" &&
            key !== "isOtpSent" &&
            key !== "isOtpVerified"
          ) {
            formPayload.append(key, formData[key]);
          }
        }

        const response = await client.post("/auth/signup", formPayload);
        if (response.data.success) {
          console.log("Signup successful");
        }
      } catch (error) {
        console.error("Failed to sign up", error);
      }
    }
  };

  return (
    <div id="signup-container">
      <div id="welcome-note">
        <h2 id="welcome-title">Welcome to Money Expense!</h2>
        <p id="welcome-text">Please fill out the form to sign up.</p>
      </div>
      <div id="form-container">
        <form id="signup-form" onSubmit={handleSubmit}>
          <div id="form-logo">
            <span style={{ color: "black" }}>Money</span>
            <span style={{ color: "black" }}> Expense</span>
          </div>
          <div id="profile-section">
            {formData.profilePicture && (
              <div id="profile-preview">
                <img
                  src={URL.createObjectURL(formData.profilePicture)}
                  alt="Profile"
                  id="profile-image"
                />
              </div>
            )}
            <label id="profile-picture-label">Profile Picture</label>
            <input
              type="file"
              name="profilePicture"
              accept="image/*"
              id="profile-picture-input"
              onChange={handleChange}
            />
          </div>
          <div id="username-section">
            <label id="username-label">Username</label>
            <input
              type="text"
              name="username"
              id="username-input"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          <div id="fullname-section">
            <label id="fullname-label">Full Name</label>
            <input
              type="text"
              name="fullName"
              id="fullname-input"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </div>
          <div id="email-section">
            <label id="email-label">Email</label>
            <input
              type="email"
              name="email"
              id="email-input"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div id="mobile-section">
            <label id="mobile-label">Mobile Number</label>
            <PhoneInput
              className="phone-input"
              country={"us"}
              value={formData.mobileNumber}
              onChange={handleMobileChange}
              required
            />
          </div>
          <div id="dob-section">
            <label id="dob-label">Date of Birth</label>
            <input
              type="date"
              name="dateOfBirth"
              id="dob-input"
              value={formData.dateOfBirth}
              onChange={handleChange}
              required
            />
          </div>
          <div id="gender-section">
            <label id="gender-label">Gender</label>
            <select
              className="gender-dropdown"
              name="gender"
              id="gender-input"
              value={formData.gender}
              onChange={handleChange}
              required
            >
              <option value="" disabled>
                Select your gender
              </option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div id="profession-section">
            <label id="profession-label">Profession</label>
            <select
              name="profession"
              id="profession-input"
              value={formData.profession}
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
          <div id="password-section">
            <label id="password-label">Password</label>
            <input
              type="password"
              name="password"
              id="password-input"
              value={formData.password}
              onChange={handleChange}
              required
            />
            {formData.formErrors.password && (
              <p className="error">{formData.formErrors.password}</p>
            )}
          </div>
          <div id="confirm-password-section">
            <label id="confirm-password-label">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              id="confirm-password-input"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
            {formData.formErrors.confirmPassword && (
              <p className="error">{formData.formErrors.confirmPassword}</p>
            )}
          </div>
          <div id="otp-section" className="verify-otp">
            <div className="otp-input">
              <input
                type="number"
                name="otp"
                id="otp-input"
                value={formData.otp}
                placeholder="Enter OTP"
                onChange={handleChange}
              />
            </div>
            <button
              type="button"
              id="send-otp-button"
              onClick={handleSendOtp}
              style={{
                backgroundColor: formData.isOtpSent ? "grey" : "blue",
                cursor: formData.isOtpSent ? "not-allowed" : "pointer",
              }}
              disabled={formData.isOtpSent}
            >
              {formData.isOtpSent ? "Resend OTP" : "Send OTP"}
            </button>

            <button
              type="button"
              id="verify-otp-button"
              onClick={handleVerifyOtp}
            >
              Verify
            </button>
          </div>
          <div id="button-row" className="button-row">
            <button
              type="button"
              id="clear-button"
              className="clear-button"
              onClick={() =>
                setFormData({
                  profilePicture: null,
                  username: "",
                  fullName: "",
                  email: "",
                  mobileNumber: "",
                  dateOfBirth: "",
                  gender: "",
                  profession: "",
                  password: "",
                  confirmPassword: "",
                  otp: "",
                  isOtpSent: false,
                  isOtpVerified: false,
                  formErrors: {},
                })
              }
            >
              Clear Form
            </button>
            <button
              type="submit"
              id="signup-button"
              className="signup-button"
              disabled={!formData.isOtpVerified}
              style={{
                backgroundColor: formData.isOtpVerified ? "green" : "red",
                cursor: formData.isOtpVerified ? "pointer" : "not-allowed",
              }}
            >
              Sign Up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
