// src/components/SignUpStep3.js
import React, { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { SignUpContext } from '../context/SignUpContext';

const SignUpStep3 = () => {
  const { state, dispatch } = useContext(SignUpContext);
  const [formData, setFormData] = useState({
    profilePic: '',
    birthDate: '',
    gender: 'male',
    profession: 'employee',
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
    dispatch({ type: 'SET_STEP3_DATA', payload: formData });
    // Send the final data to the server
    axios.post('/api/signup', { ...state, ...formData })
      .then(response => {
        if (response.data.success) {
          history.push('/dashboard');
        } else {
          alert('Error signing up');
        }
      })
      .catch(error => {
        console.error(error);
        alert('Error signing up');
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="file"
        name="profilePic"
        onChange={(e) => setFormData({ ...formData, profilePic: e.target.files[0] })}
        required
      />
      <input
        type="date"
        name="birthDate"
        value={formData.birthDate}
        onChange={handleChange}
        required
      />
      <select name="gender" value={formData.gender} onChange={handleChange} required>
        <option value="male">Male</option>
        <option value="female">Female</option>
        <option value="other">Other</option>
      </select>
      <select name="profession" value={formData.profession} onChange={handleChange} required>
        {formData.gender === 'male' && (
          <>
            <option value="employee">Employee</option>
            <option value="student">Student</option>
            <option value="houseWorker">House Worker</option>
          </>
        )}
        {formData.gender === 'female' && (
          <>
            <option value="employee">Employee</option>
            <option value="student">Student</option>
            <option value="houseWife">House Wife</option>
          </>
        )}
        {formData.gender === 'other' && (
          <>
            <option value="employee">Employee</option>
            <option value="student">Student</option>
          </>
        )}
      </select>
      <button type="submit">Sign Up</button>
    </form>
  );
};

export default SignUpStep3;
