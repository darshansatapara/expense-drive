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

    if (name === "profilePicture" && files && files.length > 0) {
      const file = files[0];
      convertImageToBase64(file)
        .then((base64Image) => {
          setFormData((prevFormData) => ({
            ...prevFormData,
            profilePicture: base64Image,
          }));
        })
        .catch((error) => {
          console.error("Error converting image: ", error);
        });
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    }
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
        const formPayload = {
          ...formData,
          profilePicture: formData.profilePicture, // Already in base64 format
        };

        const response = await client.post("/auth/signup", formPayload);
        if (response.data.success) {
          console.log("Signup successful");
        }
      } catch (error) {
        console.error("Failed to sign up", error);
      }
    }
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

  return (
    <div className="signup-container">
      <div className="logo">
        M<span style={{ color: "black" }}>oney</span> E
        <span style={{ color: "black" }}>xpense</span>
      </div>
      {formData.profilePicture && (
        <div className="profile-preview">
          <img
            src={`data:image/jpeg;base64,${formData.profilePicture}`}
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
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Full Name</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        {formData.isOtpSent && (
          <div>
            <label>Enter OTP</label>
            <input
              type="text"
              name="otp"
              value={formData.otp}
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
            country={"us"}
            value={formData.mobileNumber}
            onChange={handleMobileChange}
            required
          />
        </div>
        <div>
          <label>Date of Birth</label>
          <input
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Gender</label>
          <select
            className="gender-dropdown"
            name="gender"
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
        <div>
          <label>Profession</label>
          <select
            name="profession"
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
        <div>
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          {formData.formErrors.password && (
            <p className="error">{formData.formErrors.password}</p>
          )}
        </div>
        <div>
          <label>Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
          {formData.formErrors.confirmPassword && (
            <p className="error">{formData.formErrors.confirmPassword}</p>
          )}
        </div>
        <button type="submit" disabled={!formData.isOtpVerified}>
          Sign Up
        </button>
        <button
          type="button"
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
      </form>
    </div>
  );
};

export default Signup;
