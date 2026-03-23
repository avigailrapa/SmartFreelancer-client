import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { User } from "../../../types/user";

interface UserState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isSellingMode: boolean;
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
  isSellingMode: localStorage.getItem("isSellingMode") === "true",
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
      state.isSellingMode = !!user.freelancerId;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("isSellingMode", state.isSellingMode.toString());
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.isSellingMode = false;

      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("isSellingMode");
    },
    toggleMode: (state) => {
      state.isSellingMode = !state.isSellingMode;
      localStorage.setItem("isSellingMode", state.isSellingMode.toString());
    },
  },
});

export const { login, logout, toggleMode } = userSlice.actions;
export default userSlice.reducer;
