import { createSlice } from "@reduxjs/toolkit";
const taskDetailSlice = createSlice({
  name: "taskDetail",
  initialState: [],
  reducers: {
    storeTaskDetail: (state, action) => {
      return (state = action.payload);
    },
  },
});
export const { storeTaskDetail } = taskDetailSlice.actions;
export default taskDetailSlice.reducer;
