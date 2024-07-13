// src/context/SignUpContext.js
import React, { createContext, useReducer } from 'react';

const initialState = {
  username: '',
  email: '',
  phone: '',
  password: '',
  profilePic: '',
  birthDate: '',
  gender: '',
  profession: '',
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_STEP1_DATA':
      return { ...state, ...action.payload };
    case 'SET_STEP2_DATA':
      return { ...state, password: action.payload.password };
    case 'SET_STEP3_DATA':
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

export const SignUpContext = createContext();

export const SignUpProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <SignUpContext.Provider value={{ state, dispatch }}>
      {children}
    </SignUpContext.Provider>
  );
};
