import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authService, AuthUser, LoginDto, RegisterDto } from '@/services/auth.service';

interface AuthState {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}
  
const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
  isAuthenticated: false,
};

export const login = createAsyncThunk(
  'auth/login',
  async (credentials: LoginDto) => {
    const response = await authService.login(credentials);
    if (response.success) {
      const userData = (response.data as any).user;
      const sessionData = (response.data as any).session;
      authService.storeUser(userData, sessionData);
      return userData;
    }
    throw new Error(response.error || 'Login failed');
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (data: RegisterDto) => {
    const response = await authService.register(data);
    if (response.success) {
      const userData = (response.data as any).user;
      return userData;
    }
    throw new Error(response.error || 'Registration failed');
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      authService.logout();
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    loadStoredUser: (state) => {
      const user = authService.getStoredUser();
      if (user) {
        state.user = user;
        state.isAuthenticated = true;
      }
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(login.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(login.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload;
      state.isAuthenticated = true;
      state.error = null;
    });
    builder.addCase(login.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Login failed';
      state.isAuthenticated = false;
    });

    builder.addCase(register.fulfilled, (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    });
  },
});

export const { logout, loadStoredUser, clearError } = authSlice.actions;
export default authSlice.reducer;
