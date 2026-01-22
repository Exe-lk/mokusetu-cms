import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { postsService, Post, CreatePostDto, UpdatePostDto } from '@/src/services';

interface PostsState {
  posts: Post[];
  currentPost: Post | null;
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

const initialState: PostsState = {
  posts: [],
  currentPost: null,
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
};

export const fetchPosts = createAsyncThunk<
  { posts: Post[]; pagination: { page: number; limit: number; total: number; totalPages: number } },
  { page?: number; limit?: number; published?: boolean; categoryId?: string } | undefined
>(
  'posts/fetchPosts',
  async (params) => {
    const response = await postsService.getPosts(params);
    if (response.success) {
      return response.data as { posts: Post[]; pagination: { page: number; limit: number; total: number; totalPages: number } };
    }
    throw new Error(response.error || 'Failed to fetch posts');
  }
);

export const fetchPostById = createAsyncThunk<Post, string>(
  'posts/fetchPostById',
  async (id: string) => {
    const response = await postsService.getPost(id);
    if (response.success) {
      return response.data as Post;
    }
    throw new Error(response.error || 'Failed to fetch post');
  }
);

export const createPost = createAsyncThunk<Post, CreatePostDto>(
  'posts/createPost',
  async (data: CreatePostDto) => {
    const response = await postsService.createPost(data);
    if (response.success) {
      return response.data as Post;
    }
    throw new Error(response.error || 'Failed to create post');
  }
);

export const updatePost = createAsyncThunk<Post, { id: string; data: UpdatePostDto }>(
  'posts/updatePost',
  async ({ id, data }: { id: string; data: UpdatePostDto }) => {
    const response = await postsService.updatePost(id, data);
    if (response.success) {
      return response.data as Post;
    }
    throw new Error(response.error || 'Failed to update post');
  }
);

export const deletePost = createAsyncThunk<string, string>(
  'posts/deletePost',
  async (id: string) => {
    const response = await postsService.deletePost(id);
    if (response.success) {
      return id;
    }
    throw new Error(response.error || 'Failed to delete post');
  }
);

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    clearCurrentPost: (state) => {
      state.currentPost = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchPosts.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchPosts.fulfilled, (state, action) => {
      state.loading = false;
      state.posts = action.payload.posts;
      state.pagination = action.payload.pagination;
    });
    builder.addCase(fetchPosts.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Failed to fetch posts';
    });

    builder.addCase(fetchPostById.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchPostById.fulfilled, (state, action) => {
      state.loading = false;
      state.currentPost = action.payload;
    });
    builder.addCase(fetchPostById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Failed to fetch post';
    });

    builder.addCase(createPost.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createPost.fulfilled, (state, action) => {
      state.loading = false;
      state.posts.unshift(action.payload);
      state.pagination.total += 1;
    });
    builder.addCase(createPost.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Failed to create post';
    });

    builder.addCase(updatePost.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updatePost.fulfilled, (state, action) => {
      state.loading = false;
      const index = state.posts.findIndex((p) => p.id === action.payload.id);
      if (index !== -1) {
        state.posts[index] = action.payload;
      }
      if (state.currentPost?.id === action.payload.id) {
        state.currentPost = action.payload;
      }
    });
    builder.addCase(updatePost.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Failed to update post';
    });

    builder.addCase(deletePost.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(deletePost.fulfilled, (state, action) => {
      state.loading = false;
      state.posts = state.posts.filter((p) => p.id !== action.payload);
      state.pagination.total -= 1;
    });
    builder.addCase(deletePost.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Failed to delete post';
    });
  },
});

export const { clearCurrentPost, clearError } = postsSlice.actions;
export default postsSlice.reducer;
