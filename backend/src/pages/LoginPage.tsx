import axios from 'axios';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useLocation, useNavigate } from 'react-router-dom';

// Create axios instance with baseURL
const api = axios.create({
  baseURL: 'http://localhost:5000',
  withCredentials: true
});

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  useEffect(() => {
    // Check for Google OAuth token in URL
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    const userData = params.get('userData');

    if (token) {
      localStorage.setItem('token', token);
      if (userData) {
        localStorage.setItem('userData', userData);
      }
      toast.success('Login successful!');
      navigate('/dashboard');
    }
  }, [location, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError(''); // Clear error when user types
  };

  const validateForm = () => {
    if (!isLogin && !formData.username) {
      setError('Username is required');
      return false;
    }
    if (!formData.email) {
      setError('Email is required');
      return false;
    }
    if (!formData.password) {
      setError('Password is required');
      return false;
    }
    if (!isLogin && formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const response = await api.post(endpoint, formData);

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userData', JSON.stringify(response.data));
      toast.success(isLogin ? 'Login successful!' : 'Registration successful!');
      navigate('/dashboard');
    } catch (error: any) {
      setError(error.response?.data?.message || 'An error occurred');
      toast.error(error.response?.data?.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    try {
      // First check if the backend is available
      await api.get('/api/auth/health');
      // If backend is available, proceed with Google login
      window.location.href = 'http://localhost:5000/api/auth/google';
    } catch (error) {
      toast.error('Unable to connect to the server. Please try again later.');
      setIsGoogleLoading(false);
    }
  };

  // ... rest of the component code remains the same ...
}