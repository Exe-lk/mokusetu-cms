import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { tagsService, Tag, CreateTagDto } from '@/src/services';

interface TagsState {
  tags: Tag[];
  loading: boolean;
  error: string | null;
}

const initialState: TagsState = {
  tags: [],
  loading: false,
  error: null,
};

export const fetchTags = createAsyncThunk(
  'tags/fetchTags',
  async () => {
    const response = await tagsService.getTags();
    if (response.success) {
      return response.data;
    }
    throw new Error(response.error || 'Failed to fetch tags');
  }
);

export const createTag = createAsyncThunk(
  'tags/createTag',
  async (data: CreateTagDto) => {
    const response = await tagsService.createTag(data);
    if (response.success) {
      return response.data;
    }
    throw new Error(response.error || 'Failed to create tag');
  }
);

const tagsSlice = createSlice({
  name: 'tags',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchTags.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchTags.fulfilled, (state, action) => {
      state.loading = false;
      const payload = action.payload as { tags: Tag[] };
      state.tags = payload.tags || [];
    });
    builder.addCase(fetchTags.rejected, (state, action) => {
      state.loading = false;
      state.error = (action.error && action.error.message) ? action.error.message : 'Failed to fetch tags';
    });

    builder.addCase(createTag.fulfilled, (state, action) => {
      state.tags.push(action.payload as Tag);
    });
  },
});

export const { clearError } = tagsSlice.actions;
export default tagsSlice.reducer;
