// src/components/SignUpStep2.js
import React, { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { SignUpContext } from '../context/SignUpContext';
import axios from 'axios';

const SignUpStep2 = () => {
  const { state, dispatch } = useContext(SignUpContext);
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    try {
      const response = await axios.post('/api/verify-otp', { email: state.email, otp });
      if (response.data.success) {
        dispatch({ type: 'SET_STEP2_DATA', payload: { password } });
        history.push('/signup-step3');
      } else {
        alert('Invalid OTP');
      }
    } catch (error) {
      console.error(error);
      alert('Error verifying OTP');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="otp"
        placeholder="OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        required
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <input
        type="password"
        name="confirmPassword"
        placeholder="Confirm Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
      />
      <button type="submit">Next</button>
    </form>
  );
};

export default SignUpStep2;
