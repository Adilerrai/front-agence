import { createSlice } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";

const getStoredUser = () => {
  try {
    const stored = localStorage.getItem("userInfo");
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error("Error parsing stored user:", error);
    return null;
  }
};

const storedUser = getStoredUser();
const storedToken = localStorage.getItem("accessToken");

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: storedUser,
    token: storedToken,
    isAuth: !!(storedUser && storedToken),
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuth = true;
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },
    logOut: (state, action) => {
      state.user = null;
      state.token = null;
      state.isAuth = false;
      localStorage.removeItem("userInfo");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("token_type");
    },
  },
});

export const { setUser, setToken, logOut } = authSlice.actions;
export default authSlice.reducer;
