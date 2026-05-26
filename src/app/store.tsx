import { configureStore } from "@reduxjs/toolkit";
import userSlice from "../features/user/redux/userSlice";
import { userApi } from "../features/user/redux/api";
import { freelancerApi } from "../features/freelancer/redux/api";
import { jobApi } from "../features/job/redux/api";
import { categoryApi } from "../features/category/redux/api";
import { matchingApi } from "../features/matching/redux/api";
import { proposalApi } from "../features/proposal/redux/api";
import { ratingApi } from "../features/rating/redux/api";
export const store = configureStore({
  reducer: {
    [userApi.reducerPath]: userApi.reducer,
    user: userSlice,
    [freelancerApi.reducerPath]: freelancerApi.reducer,
    [jobApi.reducerPath]: jobApi.reducer,
    [categoryApi.reducerPath]: categoryApi.reducer,
    [matchingApi.reducerPath]: matchingApi.reducer,
    [proposalApi.reducerPath]: proposalApi.reducer,
    [ratingApi.reducerPath]: ratingApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      userApi.middleware,
      freelancerApi.middleware,
      jobApi.middleware,
      categoryApi.middleware,
      matchingApi.middleware,
      proposalApi.middleware,
      ratingApi.middleware,
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
