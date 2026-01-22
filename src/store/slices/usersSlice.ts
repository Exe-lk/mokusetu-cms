import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { usersService, User, CreateUserDto, UpdateUserDto } from '@/src/services';

interface UsersState {
  users: User[];
  currentUser: User | null;
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

const initialState: UsersState = {
  users: [],
  currentUser: null,
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
};

export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (params?: { page?: number; limit?: number }) => {
    const response = await usersService.getUsers(params?.page, params?.limit);
    if (response.success) {
      return response.data;
    }
    throw new Error(response.error || 'Failed to fetch users');
  }
);

export const fetchUserById = createAsyncThunk(
  'users/fetchUserById',
  async (id: string) => {
    const response = await usersService.getUser(id);
    if (response.success) {
      return response.data;
    }
    throw new Error(response.error || 'Failed to fetch user');
  }
);

export const createUser = createAsyncThunk(
  'users/createUser',
  async (data: CreateUserDto) => {
    const response = await usersService.createUser(data);
    if (response.success) {
      return response.data;
    }
    throw new Error(response.error || 'Failed to create user');
  }
);

export const updateUser = createAsyncThunk(
  'users/updateUser',
  async ({ id, data }: { id: string; data: UpdateUserDto }) => {
    const response = await usersService.updateUser(id, data);
    if (response.success) {
      return response.data;
    }
    throw new Error(response.error || 'Failed to update user');
  }
);

export const deleteUser = createAsyncThunk(
  'users/deleteUser',
  async (id: string) => {
    const response = await usersService.deleteUser(id);
    if (response.success) {
      return id;
    }
    throw new Error(response.error || 'Failed to delete user');
  }
);

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    clearCurrentUser: (state) => {
      state.currentUser = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchUsers.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchUsers.fulfilled, (state, action) => {
      state.loading = false;
      state.users = (action.payload as any)?.users || [];
      if ((action.payload as any)?.pagination) {
        state.pagination = (action.payload as any).pagination;
      }
    });
    builder.addCase(fetchUsers.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Failed to fetch users';
    });

    builder.addCase(fetchUserById.fulfilled, (state, action) => {
      state.currentUser = action.payload as User;
    });

    builder.addCase(createUser.fulfilled, (state, action) => {
      state.users.unshift(action.payload as User);
      state.pagination.total += 1;
    });

    builder.addCase(updateUser.fulfilled, (state, action) => {
      const index = state.users.findIndex((u) => u.id === (action.payload as User).id);
      if (index !== -1) {
        state.users[index] = action.payload as User;
      }
    });

    builder.addCase(deleteUser.fulfilled, (state, action) => {
      state.users = state.users.filter((u) => u.id !== action.payload);
      state.pagination.total -= 1;
    });
  },
});

export const { clearCurrentUser, clearError } = usersSlice.actions;
export default usersSlice.reducer;
