import {configureStore} from '@reduxjs/toolkit';
import authReducer from './authSlice';
import attendanceReducer from './attendanceSlice';
import reportReducer from './reportSlice';
import {logout} from './authSlice';
import {setUnauthorizedHandler} from '../api/axiosInstance';

const store = configureStore({
  reducer: {
    auth: authReducer,
    attendance: attendanceReducer,
    report: reportReducer,
  },
});

// Provide a 401 handler to the Axios instance. Using a callback avoids a
// circular import between axiosInstance and authSlice.
setUnauthorizedHandler(() => store.dispatch(logout()));

export default store;
