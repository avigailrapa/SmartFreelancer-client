import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Job } from "../../../types/job";

export const matchingApi = createApi({
  reducerPath: "matchingApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://localhost:7233/api/Matching",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) headers.set("authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ["Matching"],
  endpoints: (builder) => ({
    getOptimalJobs: builder.query<Job[], void>({
      query: () => "/optimal-jobs",
      providesTags: ["Matching"],
    }),
  }),
});

export const { useGetOptimalJobsQuery } = matchingApi;
