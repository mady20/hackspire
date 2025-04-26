import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth endpoints
export const getWelcomeMessage = async () => {
  try {
    const response = await api.get('/');
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const connectWallet = async (walletAddress) => {
  try {
    const response = await api.get(`/auth/connect/${walletAddress}`);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const verifyWallet = async (walletAddress, signature) => {
  try {
    const response = await api.post('/auth/verify', { walletAddress, signature });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const completeProfile = async (profileData) => {
  try {
    const response = await api.post('/auth/complete-profile', profileData);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// Creator endpoints
export const getCreatorProfile = async (username) => {
  try {
    const response = await api.get(`/profile/${username}`);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const updateCreatorProfile = async (profileData) => {
  try {
    const response = await api.put('/profile', profileData);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getAllCreators = async (page = 1, limit = 12) => {
  try {
    const response = await api.get('/creators', { params: { page, limit } });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// Error handler helper
export const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error
    return error.response.data.message || 'An error occurred';
  } else if (error.request) {
    // Request made but no response
    return 'Unable to reach server';
  } else {
    // Request setup error
    return 'Error setting up request';
  }
};
