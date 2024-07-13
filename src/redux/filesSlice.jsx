import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getFiles as apiGetFiles,
  uploadFile as apiUploadFile,
  deleteFile as apiDeleteFile,
} from "../services/api";

export const fetchFiles = createAsyncThunk("files/fetchFiles", async () => {
  const response = await apiGetFiles();
  return response.data.files;
});

export const deleteFile = createAsyncThunk(
  "files/deleteFile",
  async (id, { dispatch }) => {
    await apiDeleteFile(id);
    dispatch(fetchFiles());
    return id;
  }
);

export const uploadFile = createAsyncThunk(
  "files/uploadFile",
  async (file, { rejectWithValue, dispatch }) => {
    try {
      const formData = new FormData();
      formData.append("files[]", file);
      const response = await apiUploadFile(formData);

      console.log("upload error:", response);

      if (response.data && response.data.status === "ok") {
        dispatch(fetchFiles());
        return { name: file.name, url: response.data.url };
      } else {
        console.error(response);
        return rejectWithValue("format error");
      }
    } catch (error) {
      console.error("upload error:", error);
      return rejectWithValue(error.message || "error");
    }
  }
);

const filesSlice = createSlice({
  name: "files",
  initialState: {
    files: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFiles.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchFiles.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.files = action.payload;
        state.error = null;
      })
      .addCase(fetchFiles.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(uploadFile.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.files.push(action.payload);
        state.error = null;
      })
      .addCase(uploadFile.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      })
      .addCase(deleteFile.fulfilled, (state) => {
        state.status = "succeeded";
        state.error = null;
      });
  },
});

export default filesSlice.reducer;
