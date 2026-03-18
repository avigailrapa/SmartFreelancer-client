import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { User } from "../../../types/user";

interface UserState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

const getStoredUser = (): User | null => {
  const storedUser = localStorage.getItem("user");
  if (!storedUser) return null;
  try {
    return JSON.parse(storedUser) as User;
  } catch {
    return null;
  }
};

const initialState: UserState = {
  user: getStoredUser(),
  token: localStorage.getItem("token"),
  isAuthenticated: !!localStorage.getItem("token"),
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ user: User; token: string }>) => {
      const { user, token } = action.payload;

      state.user = user;
      state.token = token;
      state.isAuthenticated = true;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;

      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
  },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;
