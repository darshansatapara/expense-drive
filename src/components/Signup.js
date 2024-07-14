import React, { useState, useCallback } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import axios from "axios";
import Cropper from "react-easy-crop";
import { SignupProvider, useSignup } from "../context/SignUpContext";
import "../css/SignupPage.css";
import { getCroppedImg } from "../utils/cropImageUtils";

const validatePassword = (password) => {
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

const Signup = () => {
  const { state, dispatch } = useSignup();
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedArea, setCroppedArea] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profilePicture" && files && files.length > 0) {
      const reader = new FileReader();
      reader.readAsDataURL(files[0]);
      reader.onload = () => {
        dispatch({
          type: "SET_FORM_DATA",
          field: name,
          payload: reader.result,
        });
      };
    } else {
      dispatch({
        type: "SET_FORM_DATA",
        field: name,
        payload: value,
      });
    }
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
      const response = await axios.post("/api/send-otp", {
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
      const response = await axios.post("/api/verify-otp", {
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
        let croppedProfilePicture = null;
        if (state.profilePicture) {
          croppedProfilePicture = await getCroppedImg(
            state.profilePicture,
            croppedArea
          );
        }

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

        if (croppedProfilePicture) {
          formData.append("profilePicture", croppedProfilePicture);
        }

        const response = await axios.post("/api/signup", formData);
        if (response.data.success) {
          console.log("Signup successful");
        }
      } catch (error) {
        console.error("Failed to sign up", error);
      }
    }
  };

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedArea(croppedAreaPixels);
  }, []);

  return (
    <div className="signup-container">
      <div className="logo">Money Expance</div>
      {state.profilePicture && (
        <div className="profile-preview">
          <img src={state.profilePicture} alt="Profile" />
        </div>
      )}
      <form className="signup-form" onSubmit={handleSubmit}>
        <div className="input-group">
          <label>Profile Picture</label>
          <input
            type="file"
            name="profilePicture"
            accept="image/*"
            onChange={handleChange}
          />
          {state.profilePicture && (
            <Cropper
              image={state.profilePicture}
              crop={crop}
              zoom={zoom}
              aspect={1}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          )}
        </div>
        <div className="input-group">
          <label>Username</label>
          <input
            type="text"
            name="username"
            value={state.username}
            onChange={handleChange}
            required
          />
        </div>
        <div className="input-group">
          <label>Full Name</label>
          <input
            type="text"
            name="fullName"
            value={state.fullName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="input-group">
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
          <div className="input-group otp-group">
            <label>Enter OTP</label>
            <input
              type="text"
              name="otp"
              value={state.otp}
              onChange={handleChange}
              maxLength="6"
              required
            />
            <button type="button" onClick={handleVerifyOtp}>
              Verify OTP
            </button>
          </div>
        )}
        {!state.isOtpSent && (
          <button type="button" onClick={handleSendOtp}>
            Send OTP
          </button>
        )}
        <div className="input-group">
          <label>Mobile Number</label>
          <PhoneInput
            country={"in"}
            value={state.mobileNumber}
            onChange={handleMobileChange}
            required
          />
        </div>
        <div className="input-group">
          <label>Date of Birth</label>
          <input
            type="date"
            name="dateOfBirth"
            value={state.dateOfBirth}
            onChange={handleChange}
            required
            className="stylish-date-input"
          />
        </div>
        <div className="input-group">
          <label>Gender</label>
          <div className="gender-radio">
            <label>
              <input
                type="radio"
                name="gender"
                value="male"
                onChange={handleChange}
                required
              />{" "}
              Male
            </label>
            <label>
              <input
                type="radio"
                name="gender"
                value="female"
                onChange={handleChange}
                required
              />{" "}
              Female
            </label>
            <label>
              <input
                type="radio"
                name="gender"
                value="other"
                onChange={handleChange}
                required
              />{" "}
              Other
            </label>
          </div>
        </div>
        <div className="input-group">
          <label>Profession</label>
          <input
            type="text"
            name="profession"
            value={state.profession}
            onChange={handleChange}
            required
          />
        </div>
        <div className="input-group">
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
        <div className="input-group">
          <label>Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={state.confirmPassword}
            onChange={handleChange}
            required
          />
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
