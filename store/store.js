import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../slices/authSlice";
import taskReducer from "../slices/taskSlice";
import taskDetailReducer from "../slices/taskDetailSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    task: taskReducer,
    taskDetail: taskDetailReducer,
  },
});
export default store;
