import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import filesReducer from "./filesSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    files: filesReducer,
  },
});

export default store;
