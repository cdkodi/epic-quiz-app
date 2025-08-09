/**
 * Epic Redux Slice - Manages epic library state
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Epic } from '../../types/api';
import apiService from '../../services/api';

export interface EpicState {
  epics: Epic[];
  selectedEpic: Epic | null;
  loading: boolean;
  error: string | null;
}

const initialState: EpicState = {
  epics: [],
  selectedEpic: null,
  loading: false,
  error: null,
};

// Async thunks
export const fetchEpics = createAsyncThunk(
  'epic/fetchEpics',
  async (_, { rejectWithValue }) => {
    const response = await apiService.getEpics();
    if (!response.success) {
      return rejectWithValue(response.error || 'Failed to fetch epics');
    }
    return response.data!;
  }
);

export const fetchEpicById = createAsyncThunk(
  'epic/fetchEpicById',
  async (epicId: string, { rejectWithValue }) => {
    const response = await apiService.getEpicById(epicId);
    if (!response.success) {
      return rejectWithValue(response.error || 'Failed to fetch epic');
    }
    return response.data!;
  }
);

const epicSlice = createSlice({
  name: 'epic',
  initialState,
  reducers: {
    selectEpic: (state, action: PayloadAction<Epic>) => {
      state.selectedEpic = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch epics
      .addCase(fetchEpics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEpics.fulfilled, (state, action) => {
        state.loading = false;
        state.epics = action.payload;
      })
      .addCase(fetchEpics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch single epic
      .addCase(fetchEpicById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEpicById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedEpic = action.payload;
      })
      .addCase(fetchEpicById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { selectEpic, clearError } = epicSlice.actions;
export default epicSlice.reducer;