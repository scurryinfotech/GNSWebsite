import React, { useState } from 'react';
import Login from './Login';
import Signup from './Signup';
import axios from 'axios';
import { toast } from 'react-toastify';

const AuthContainer = ({ onAuthSuccess }) => {
  const [currentView, setCurrentView] = useState('login');
  const [authError, setAuthError] = useState('');

  //  LOGIN part 
  const handleLogin = async (loginData) => {
  try {
    setAuthError('');

    // Build payload matching UserModel (case-sensitive)
    const payload = {
      loginame: loginData.email,      
      Password: loginData.password
    };

    const response = await axios.post(
      'https://localhost:7104/api/Order/Login',
      payload
    );

    if (response.data.success) {
      toast.success('Login successful!');
      onAuthSuccess({
        user: response.data.user,
        token: response.data.token,
        type: 'login',
      });
    } else {
      throw new Error(response.data.message || 'Login failed');
    }
  } catch (error) {
    setAuthError(error.response?.data?.message || error.message);
    throw error;
  }
};

  // ------------------ SIGNUP ------------------
  const handleSignup = async (signupData) => {
    

    try {
      setAuthError('');

      // Build payload matching UserModel
      const payload = {
        loginame: signupData.email,   // required
        password: signupData.password,   // required
        name: signupData.name,           // required
        // createdDate: new Date().toISOString(), // backend requires DateTime
        // isActive: true,                  // default to active
      };
      const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bmlxdWVfbmFtZSI6IkdyaWxsX05fU2hha2VzIiwibmJmIjoxNzU5MTMyMzY3LCJleHAiOjE3NjY5MDgzNjcsImlhdCI6MTc1OTEzMjM2N30.ko8YPHfApg0uN0k3kUTLcJXpZp-2s-6TiRHpsiab42Q"
      const response = await axios.post(
        'https://localhost:7104/api/Order/AddUser',
        payload,
        {
        headers: {
          Authorization: `Bearer ${token}`  // send token here
        }
      }
      );

      if (response.data.success) {
        toast.success('Signup successful!');
     setTimeout(() => {
        onAuthSuccess({
      user: response.data.user,
      token: response.data.token,
      type: 'signup',
    });
   }, 2000); 
      } else {
        throw new Error(response.data.message || 'Signup failed');
      }
    } catch (error) {
      setAuthError(error.response?.data?.message || error.message);
      throw error;
    }
  };

  // ------------------ SWITCH VIEWS ------------------
  const handleSwitchToSignup = () => {
    setCurrentView('signup');
    setAuthError('');
  };

  const handleSwitchToLogin = () => {
    setCurrentView('login');
    setAuthError('');
  };

  return (
    <div>
      {currentView === 'login' ? (
        <Login
          onSwitchToSignup={handleSwitchToSignup}
          onLogin={handleLogin}
          authError={authError}
        />
      ) : (
        <Signup
          onSwitchToLogin={handleSwitchToLogin}
          onSignup={handleSignup}
          authError={authError}
        />
      )}
    </div>
  );
};

export default AuthContainer;
