import { createSlice } from "@reduxjs/toolkit";
const taskSlice = createSlice({
  name: "task",
  initialState: [],
  reducers: {
    storeTask: (state, action) => {
      return (state = action.payload);
    },
  },
});
export const { storeTask } = taskSlice.actions;
export default taskSlice.reducer;
