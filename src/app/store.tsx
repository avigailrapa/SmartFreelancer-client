import { configureStore } from "@reduxjs/toolkit";
import  userSlice  from "../features/user/redux/userSlice";
import { userApi } from "../features/user/redux/api";
import { freelancerApi } from "../features/freelancer/redux/api";
export const store = configureStore({
  reducer: {
    [userApi.reducerPath]:userApi.reducer,
    user:userSlice,
    [freelancerApi.reducerPath]: freelancerApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(userApi.middleware, freelancerApi.middleware),
});


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

