import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { aboutService, AboutPage, UpdateAboutPageDto } from '@/src/services/about.service';

interface AboutState {
  aboutPage: AboutPage | null;
  loading: boolean;
  error: string | null;
}

const initialState: AboutState = {
  aboutPage: null,
  loading: false,
  error: null,
};

export const fetchAboutPage = createAsyncThunk<AboutPage, void>(
  'about/fetchAboutPage',
  async () => {
    const response = await aboutService.getAboutPage();
    if (response.success) {
      return response.data as AboutPage;
    }
    throw new Error(response.error || 'Failed to fetch about page');
  }
);

export const updateAboutPage = createAsyncThunk<AboutPage, UpdateAboutPageDto>(
  'about/updateAboutPage',
  async (data: UpdateAboutPageDto) => {
    const response = await aboutService.updateAboutPage(data);
    if (response.success) {
      return response.data as AboutPage;
    }
    throw new Error(response.error || 'Failed to update about page');
  }
);

export const initializeAboutPage = createAsyncThunk<AboutPage, void>(
  'about/initializeAboutPage',
  async () => {
    const response = await aboutService.initializeAboutPage();
    if (response.success) {
      return response.data as AboutPage;
    }
    throw new Error(response.error || 'Failed to initialize about page');
  }
);

const aboutSlice = createSlice({
  name: 'about',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAboutPage.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchAboutPage.fulfilled, (state, action) => {
      state.loading = false;
      state.aboutPage = action.payload;
    });
    builder.addCase(fetchAboutPage.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Failed to fetch about page';
    });

    builder.addCase(updateAboutPage.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateAboutPage.fulfilled, (state, action) => {
      state.loading = false;
      state.aboutPage = action.payload;
    });
    builder.addCase(updateAboutPage.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Failed to update about page';
    });

    builder.addCase(initializeAboutPage.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(initializeAboutPage.fulfilled, (state, action) => {
      state.loading = false;
      state.aboutPage = action.payload;
    });
    builder.addCase(initializeAboutPage.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Failed to initialize about page';
    });
  },
});

export const { clearError } = aboutSlice.actions;
export default aboutSlice.reducer;
