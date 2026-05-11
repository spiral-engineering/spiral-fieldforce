import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'https://api.spiral-fieldforce.com/v1';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor – attach JWT token
axiosInstance.interceptors.request.use(
  async config => {
    const token = await AsyncStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error),
);

// Response interceptor – handle 401
axiosInstance.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 401) {
      await AsyncStorage.removeItem('authToken');
      // Lazy require to avoid circular dependency; clears Redux auth state
      // so the navigator re-renders to the Login screen.
      const store = require('../store').default;
      const {logout} = require('../store/authSlice');
      store.dispatch(logout());
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
