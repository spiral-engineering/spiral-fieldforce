import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axiosInstance from '../api/axiosInstance';

export const login = createAsyncThunk(
  'auth/login',
  async ({username, password}, {rejectWithValue}) => {
    try {
      const response = await axiosInstance.post('/auth/login', {
        username,
        password,
      });
      const {token, user} = response.data;
      await AsyncStorage.setItem('authToken', token);
      return {token, user};
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Login failed. Please try again.',
      );
    }
  },
);

export const logout = createAsyncThunk('auth/logout', async () => {
  await AsyncStorage.removeItem('authToken');
});

export const restoreToken = createAsyncThunk('auth/restoreToken', async () => {
  const token = await AsyncStorage.getItem('authToken');
  return token;
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: null,
    user: null,
    isLoading: false,
    isRestoringToken: true,
    error: null,
  },
  reducers: {
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(login.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(logout.fulfilled, state => {
        state.token = null;
        state.user = null;
      })
      .addCase(restoreToken.fulfilled, (state, action) => {
        state.token = action.payload;
        state.isRestoringToken = false;
      })
      .addCase(restoreToken.rejected, state => {
        state.isRestoringToken = false;
      });
  },
});

export const {clearError} = authSlice.actions;
export default authSlice.reducer;
