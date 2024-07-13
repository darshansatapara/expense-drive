// src/context/SignupContext.js

import React, { createContext, useReducer, useContext } from "react";

const SignupContext = createContext();

const initialState = {
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
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_FORM_DATA":
      return { ...state, [action.field]: action.payload };
    case "SET_OTP_SENT":
      return { ...state, isOtpSent: action.payload };
    case "SET_OTP_VERIFIED":
      return { ...state, isOtpVerified: action.payload };
    case "SET_FORM_ERRORS":
      return { ...state, formErrors: action.payload };
    case "CLEAR_FORM":
      return initialState;
    default:
      return state;
  }
};

const SignupProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <SignupContext.Provider value={{ state, dispatch }}>
      {children}
    </SignupContext.Provider>
  );
};

const useSignup = () => {
  return useContext(SignupContext);
};

export { SignupProvider, useSignup };
