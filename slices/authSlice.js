import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// // Async thunk for fetching API
// export const fetchUser = createAsyncThunk(
//   "auth/fetchUser",
//   async (credentials) => {
//     const response = await fetch(
//       "https://api-xuongmay-dev.lighttail.com/login",
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(credentials),
//       }
//     );
//     const data = await response.json();
//     return data;
//   }
// );

const authSlice = createSlice({
  name: "auth",
  initialState: null,
  reducers: {
    login: (state, action) => {
      return (state = action.payload);
    },
    logout: () => {
      return null;
    },
  },
  // extraReducers: (builder) => {
  //   builder
  //     .addCase(fetchUser.pending, (state) => {
  //       state.status = "loading";
  //     })
  //     .addCase(fetchUser.fulfilled, (state, action) => {
  //       state.status = "succeeded";
  //       state.user = action.payload;
  //     })
  //     .addCase(fetchUser.rejected, (state, action) => {
  //       state.status = "failed";
  //       state.error = action.error.message;
  //     });
  // },
});

export const { logout, login } = authSlice.actions;

export default authSlice.reducer;
