import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axiosInstance from '../api/axiosInstance';

export const checkIn = createAsyncThunk(
  'attendance/checkIn',
  async (_, {rejectWithValue}) => {
    try {
      const timestamp = new Date().toISOString();
      const response = await axiosInstance.post('/attendance/checkin', {
        timestamp,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Check-in failed.',
      );
    }
  },
);

export const checkOut = createAsyncThunk(
  'attendance/checkOut',
  async (_, {rejectWithValue}) => {
    try {
      const timestamp = new Date().toISOString();
      const response = await axiosInstance.post('/attendance/checkout', {
        timestamp,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Check-out failed.',
      );
    }
  },
);

export const fetchAttendanceHistory = createAsyncThunk(
  'attendance/fetchHistory',
  async (_, {rejectWithValue}) => {
    try {
      const response = await axiosInstance.get('/attendance/history');
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch attendance history.',
      );
    }
  },
);

const attendanceSlice = createSlice({
  name: 'attendance',
  initialState: {
    todayRecord: null,
    history: [],
    isLoading: false,
    error: null,
  },
  reducers: {
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(checkIn.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(checkIn.fulfilled, (state, action) => {
        state.isLoading = false;
        state.todayRecord = action.payload;
      })
      .addCase(checkIn.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(checkOut.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(checkOut.fulfilled, (state, action) => {
        state.isLoading = false;
        state.todayRecord = action.payload;
      })
      .addCase(checkOut.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchAttendanceHistory.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAttendanceHistory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.history = action.payload;
        // Populate todayRecord from history so HomeScreen shows today's status
        // even before a check-in/check-out action is dispatched.
        const todayStr = new Date().toISOString().slice(0, 10);
        const todayEntry = action.payload.find(record => {
          const recordDate = (record.checkIn || record.date || '').slice(0, 10);
          return recordDate === todayStr;
        });
        if (todayEntry !== undefined) {
          state.todayRecord = todayEntry;
        }
      })
      .addCase(fetchAttendanceHistory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const {clearError} = attendanceSlice.actions;
export default attendanceSlice.reducer;
