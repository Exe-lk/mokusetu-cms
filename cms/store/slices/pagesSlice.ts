import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { pagesService, Page, CreatePageDto, UpdatePageDto } from '@/services';

interface PagesState {
  pages: Page[];
  currentPage: Page | null;
  loading: boolean;
  error: string | null;
}

const initialState: PagesState = {
  pages: [],
  currentPage: null,
  loading: false,
  error: null,
};

export const fetchPages = createAsyncThunk(
  'pages/fetchPages',
  async (published?: boolean) => {
    const response = await pagesService.getPages(published);
    if (response.success) {
      return response.data;
    }
    throw new Error(response.error || 'Failed to fetch pages');
  }
);

export const fetchPageById = createAsyncThunk(
  'pages/fetchPageById',
  async (id: string) => {
    const response = await pagesService.getPage(id);
    if (response.success) {
      return response.data;
    }
    throw new Error(response.error || 'Failed to fetch page');
  }
);

export const createPage = createAsyncThunk(
  'pages/createPage',
  async (data: CreatePageDto) => {
    const response = await pagesService.createPage(data);
    if (response.success) {
      return response.data;
    }
    throw new Error(response.error || 'Failed to create page');
  }
);

export const updatePage = createAsyncThunk(
  'pages/updatePage',
  async ({ id, data }: { id: string; data: UpdatePageDto }) => {
    const response = await pagesService.updatePage(id, data);
    if (response.success) {
      return response.data;
    }
    throw new Error(response.error || 'Failed to update page');
  }
);

export const deletePage = createAsyncThunk(
  'pages/deletePage',
  async (id: string) => {
    const response = await pagesService.deletePage(id);
    if (response.success) {
      return id;
    }
    throw new Error(response.error || 'Failed to delete page');
  }
);

const pagesSlice = createSlice({
  name: 'pages',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchPages.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchPages.fulfilled, (state, action) => {
      state.loading = false;
      state.pages = (action.payload as any)?.pages || [];
    });
    builder.addCase(fetchPages.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Failed to fetch pages';
    });

    builder.addCase(createPage.fulfilled, (state, action) => {
      state.pages.push(action.payload as Page);
    });

    builder.addCase(updatePage.fulfilled, (state, action) => {
      const index = state.pages.findIndex((p) => p.id === (action.payload as Page).id);
      if (index !== -1) {
        state.pages[index] = action.payload as Page;
      }
    });

    builder.addCase(deletePage.fulfilled, (state, action) => {
      state.pages = state.pages.filter((p) => p.id !== action.payload);
    });
  },
});

export const { clearError } = pagesSlice.actions;
export default pagesSlice.reducer;

