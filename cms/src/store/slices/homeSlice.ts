import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { homeService, HomePage, UpdateHomePageDto } from '@/src/services/home.services';

interface HomeState {
  home: HomePage | null;
  loading: boolean;
  error: string | null;
}

const initialState: HomeState = {
  home: null,
  loading: false,
  error: null,
};

export const fetchHomePage = createAsyncThunk<HomePage, void>(
  'home/fetchHomePage',
  async () => {
    const response = await homeService.getHomePage();
    if (response.success) {
      return response.data as HomePage;
    }
    throw new Error(response.error || 'Failed to fetch home page');
  }
);

export const updateHomePage = createAsyncThunk<HomePage, UpdateHomePageDto>(
  'home/updateHomePage',
  async (data: UpdateHomePageDto) => {
    const response = await homeService.updateHomePage(data);
    if (response.success) {
      return response.data as HomePage;
    }
    throw new Error(response.error || 'Failed to update home page');
  }
);

const homeSlice = createSlice({
  name: 'home',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchHomePage.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchHomePage.fulfilled, (state, action) => {
      state.loading = false;
      state.home = action.payload;
    });
    builder.addCase(fetchHomePage.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Failed to fetch home page';
    });

    builder.addCase(updateHomePage.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateHomePage.fulfilled, (state, action) => {
      state.loading = false;
      state.home = action.payload;
    });
    builder.addCase(updateHomePage.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Failed to update home page';
    });
  },
});

export const { clearError } = homeSlice.actions;
export default homeSlice.reducer;

