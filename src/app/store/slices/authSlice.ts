import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AUTH_STORAGE_KEY } from '../../config/auth';
import type { AuthUser } from '../../lib/auth';

export type User = AuthUser;

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
}

function loadPersistedAuth(): AuthState {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) {
      return { user: null, isAuthenticated: false, loading: false };
    }
    const parsed = JSON.parse(raw) as AuthState;
    if (parsed.isAuthenticated && parsed.user?.role && parsed.user.email) {
      return { ...parsed, loading: false };
    }
  } catch {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }
  return { user: null, isAuthenticated: false, loading: false };
}

function persistAuth(state: AuthState) {
  if (state.isAuthenticated && state.user) {
    localStorage.setItem(
      AUTH_STORAGE_KEY,
      JSON.stringify({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        loading: false,
      }),
    );
  } else {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }
}

const initialState: AuthState = loadPersistedAuth();

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.loading = false;
      persistAuth(state);
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      persistAuth(state);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { loginSuccess, logout, setLoading } = authSlice.actions;
export default authSlice.reducer;

