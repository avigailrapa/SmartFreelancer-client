import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Proposal } from "../../../types/proposal";

export const proposalApi = createApi({
  reducerPath: "proposalApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://localhost:7233/api/Proposal",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) headers.set("authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ["Proposal"],
  endpoints: (builder) => ({
    // ---------- GET PROPOSALS FOR JOB (CLIENT) ----------
    getProposalsForJob: builder.query<Proposal[], number>({
      query: (jobId) => `/job/${jobId}`,
      providesTags: (_result, _error, jobId) => [
        { type: "Proposal", id: `job-${jobId}` },
        { type: "Proposal", id: "LIST" },
      ],
    }),

    // ---------- GET MY PROPOSALS (FREELANCER) ----------
    getMyProposals: builder.query<Proposal[], void>({
      query: () => "/my-proposals",
      providesTags: ["Proposal"],
    }),

    // ---------- SUBMIT PROPOSAL ----------
    submitProposal: builder.mutation<
      Proposal,
      {
        jobId: number;
        hourlyRate: number;
        estimatedHours: number;
        totalEstimatedPrice: number;
        message: string;
      }
    >({
      query: (proposal) => ({
        url: "/send",
        method: "POST",
        body: proposal,
      }),
      invalidatesTags: (result) => [
        { type: "Proposal", id: `job-${result?.jobId}` },
        { type: "Proposal", id: "LIST" },
      ],
    }),

    // ---------- ACCEPT PROPOSAL ----------
    acceptProposal: builder.mutation<Proposal, number>({
      query: (proposalId) => ({
        url: `/${proposalId}/approve`,
        method: "POST",
      }),
      invalidatesTags: (result) => [
        { type: "Proposal", id: `job-${result?.jobId}` },
        { type: "Proposal", id: "LIST" },
      ],
    }),

    // ---------- REJECT PROPOSAL ----------
    rejectProposal: builder.mutation<Proposal, number>({
      query: (proposalId) => ({
        url: `/${proposalId}/reject`,
        method: "POST",
      }),
      invalidatesTags: (result) => [
        { type: "Proposal", id: `job-${result?.jobId}` },
        { type: "Proposal", id: "LIST" },
      ],
    }),

    // ---------- DELETE PROPOSAL ----------
    deleteProposal: builder.mutation<void, number>({
      query: (proposalId) => ({
        url: `/${proposalId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Proposal"],
    }),
  }),
});

export const {
  useGetProposalsForJobQuery,
  useGetMyProposalsQuery,
  useSubmitProposalMutation,
  useAcceptProposalMutation,
  useRejectProposalMutation,
  useDeleteProposalMutation,
} = proposalApi;
