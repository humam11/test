import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { login as apiLogin, logout as apiLogout } from "../services/api";
import { safeJSONParse } from "../services/utilis";

export const login = createAsyncThunk("auth/login", async (credentials) => {
  const response = await apiLogin(credentials);
  const { token, user } = response.data;
  return { token, user };
});

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await apiLogout();
      localStorage.removeItem("token");
      return {};
    } catch (error) {
      if (error.response && error.response.status === 401) {
        localStorage.removeItem("token");
        return {};
      }
      return rejectWithValue(error.message);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    token:
      typeof localStorage !== "undefined"
        ? localStorage.getItem("token")
        : null,
    user:
      typeof localStorage !== "undefined"
        ? safeJSONParse(localStorage.getItem("user"))
        : null,
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.token = action.payload.token;
        state.user = action.payload.user;
        localStorage.setItem("token", action.payload.token);
        console.log(
          "User saved to localStorage on login:",
          JSON.stringify(action.payload.user)
        );
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(logout.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Logout failed";
      })
      .addCase(logout.fulfilled, (state) => {
        state.token = null;
        state.status = "idle";
      });
  },
});

export default authSlice.reducer;
