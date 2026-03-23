import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Job } from "../../../types/job";

export const jobApi = createApi({
  reducerPath: "jobApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://localhost:7233/api/Job",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) headers.set("authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ["Job"],
  endpoints: (builder) => ({
    // ---------- GET ALL ----------
    getAllJobs: builder.query<Job[], void>({
      query: () => "/",
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ jobId: id }) => ({ type: "Job" as const, id })),
              { type: "Job", id: "LIST" },
            ]
          : [{ type: "Job", id: "LIST" }],
    }),

    // ---------- GET OPEN JOBS ----------
    getOpenJobs: builder.query<Job[], void>({
      query: () => "/open",
      providesTags: ["Job"],
    }),

    // ---------- GET BY ID ----------
    getJobById: builder.query<Job, number>({
      query: (id) => `/${id}`,
      providesTags: (result, error, id) => [{ type: "Job", id }],
    }),

    // ---------- ADD ----------
    createJob: builder.mutation<Job, Partial<Job>>({
      query: (newJob) => ({
        url: "/",
        method: "POST",
        body: newJob,
      }),
      invalidatesTags: [{ type: "Job", id: "LIST" }],
    }),

    // ---------- UPDATE ----------
    updateJob: builder.mutation<Job, { id: number; job: Partial<Job> }>({
      query: ({ id, job }) => ({
        url: `/${id}`,
        method: "PUT",
        body: job,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Job", id }],
    }),

    // ---------- DELETE ----------
    deleteJob: builder.mutation<void, number>({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Job", id: "LIST" }],
    }),
  }),
});

export const {
  useGetAllJobsQuery,
  useGetOpenJobsQuery,
  useGetJobByIdQuery,
  useCreateJobMutation,
  useUpdateJobMutation,
  useDeleteJobMutation,
} = jobApi;
