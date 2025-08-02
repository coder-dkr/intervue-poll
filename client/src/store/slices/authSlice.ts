import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  userType: 'student' | 'teacher' | null;
  userName: string;
  userId: string;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  userType: null,
  userName: '',
  userId: '',
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUserType: (state, action: PayloadAction<'student' | 'teacher'>) => {
      state.userType = action.payload;
    },
    setUserInfo: (state, action: PayloadAction<{ name: string; id: string; userType: 'student' | 'teacher' }>) => {
      state.userName = action.payload.name;
      state.userId = action.payload.id;
      state.userType = action.payload.userType;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.userType = null;
      state.userName = '';
      state.userId = '';
      state.isAuthenticated = false;
    },
  },
});

export const { setUserType, setUserInfo, logout } = authSlice.actions;
export default authSlice.reducer;