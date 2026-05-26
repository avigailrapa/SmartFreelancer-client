import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Freelancer } from "../../../types/freelancer";
import { login } from "../../user/redux/userSlice";
import type { AuthResponse } from "../../../types/authRespone";

export interface UpdateAvailability {
  availableHours: number;
  availableUntil: string;
}

export const freelancerApi = createApi({
  reducerPath: "freelancerApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://localhost:7233/api/Freelancer",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) headers.set("authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ["Freelancer"],
  endpoints: (builder) => ({
    // ---------- GET ALL ----------
    getAllFreelancers: builder.query<Freelancer[], void>({
      query: () => "/",
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ freelancerId: id }) => ({
                type: "Freelancer" as const,
                id,
              })),
              { type: "Freelancer", id: "LIST" },
            ]
          : [{ type: "Freelancer", id: "LIST" }],
    }),

    // ---------- GET BY ID ----------
    getFreelancerById: builder.query<Freelancer, number>({
      query: (id) => `/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Freelancer", id }],
    }),

    // ---------- UPDATE ----------
    updateFreelancer: builder.mutation<Freelancer, Partial<Freelancer>>({
      query: (body) => ({
        url: "/",
        method: "PUT",
        body,
      }),
      invalidatesTags: (result) => [
        { type: "Freelancer", id: result?.freelancerId },
        { type: "Freelancer", id: "LIST" },
      ],
    }),

    // ---------- BECOME FREELANCER----------
    becomeFreelancer: builder.mutation<AuthResponse, FormData>({
      query: (formData) => ({
        url: "/become-freelancer",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: [{ type: "Freelancer", id: "LIST" }],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data.token && data.user) {
            dispatch(login({ user: data.user, token: data.token }));
          }
        } catch (err) {
          console.error(err);
        }
      },
    }),

  
  }),
});

export const {
  useGetAllFreelancersQuery,
  useGetFreelancerByIdQuery,
  useBecomeFreelancerMutation,
  useUpdateFreelancerMutation,
} = freelancerApi;
