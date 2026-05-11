import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axiosInstance from '../api/axiosInstance';

export const submitReport = createAsyncThunk(
  'report/submit',
  async ({title, description, photoUri}, {rejectWithValue}) => {
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      if (photoUri) {
        const filename = photoUri.split('/').pop();
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : 'image/jpeg';
        formData.append('photo', {uri: photoUri, name: filename, type});
      }
      const response = await axiosInstance.post('/reports', formData, {
        headers: {'Content-Type': 'multipart/form-data'},
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to submit report.',
      );
    }
  },
);

export const fetchReports = createAsyncThunk(
  'report/fetchAll',
  async (_, {rejectWithValue}) => {
    try {
      const response = await axiosInstance.get('/reports');
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch reports.',
      );
    }
  },
);

const reportSlice = createSlice({
  name: 'report',
  initialState: {
    reports: [],
    isLoading: false,
    isSubmitting: false,
    error: null,
    submitSuccess: false,
  },
  reducers: {
    clearError(state) {
      state.error = null;
    },
    resetSubmitSuccess(state) {
      state.submitSuccess = false;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(submitReport.pending, state => {
        state.isSubmitting = true;
        state.error = null;
        state.submitSuccess = false;
      })
      .addCase(submitReport.fulfilled, (state, action) => {
        state.isSubmitting = false;
        state.submitSuccess = true;
        state.reports.unshift(action.payload);
      })
      .addCase(submitReport.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload;
      })
      .addCase(fetchReports.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchReports.fulfilled, (state, action) => {
        state.isLoading = false;
        state.reports = action.payload;
      })
      .addCase(fetchReports.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const {clearError, resetSubmitSuccess} = reportSlice.actions;
export default reportSlice.reducer;
