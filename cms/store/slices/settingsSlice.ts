import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { settingsService, CreateSettingDto } from '@/services';

interface SettingsState {
  settings: Record<string, any>;
  loading: boolean;
  error: string | null;
}

const initialState: SettingsState = {
  settings: {},
  loading: false,
  error: null,
};

export const fetchSettings = createAsyncThunk(
  'settings/fetchSettings',
  async () => {
    const response = await settingsService.getSettings();
    if (response.success) {
      return response.data;
    }
    throw new Error(response.error || 'Failed to fetch settings');
  }
);

export const updateSetting = createAsyncThunk(
  'settings/updateSetting',
  async (data: CreateSettingDto) => {
    const response = await settingsService.setSetting(data);
    if (response.success) {
      return { key: data.key, value: data.value };
    }
    throw new Error(response.error || 'Failed to update setting');
  }
);

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchSettings.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchSettings.fulfilled, (state, action) => {
      state.loading = false;
      state.settings = action.payload as Record<string, any>;
    });
    builder.addCase(fetchSettings.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Failed to fetch settings';
    });

    builder.addCase(updateSetting.fulfilled, (state, action) => {
      state.settings[action.payload.key] = action.payload.value;
    });
  },
});

export const { clearError } = settingsSlice.actions;
export default settingsSlice.reducer;
