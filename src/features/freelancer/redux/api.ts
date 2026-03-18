import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { jwtDecode } from "jwt-decode";
import type { Freelancer } from "../../../types/freelancer";
import { login } from "../../user/redux/userSlice";
import type { JwtPayload } from "../../../types/jwtPayload";
import type { AuthResponse } from "../../../types/authRespone";

const getFreelancerIdFromToken = (): number | null => {
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    const decoded = jwtDecode<JwtPayload>(token);
    return decoded.FreelancerId ? Number(decoded.FreelancerId) : null;
  } catch {
    return null;
  }
};

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
      providesTags: (result, error, id) => [{ type: "Freelancer", id }],
    }),

    // ---------- UPDATE ----------
    updateFreelancer: builder.mutation<void, Partial<Freelancer>>({
      query: (body) => ({ url: "/", method: "PUT", body }),
      async onQueryStarted(body, { dispatch, queryFulfilled }) {
        const id = getFreelancerIdFromToken();
        if (!id) return;

        const patchResult = dispatch(
          freelancerApi.util.updateQueryData(
            "getAllFreelancers",
            undefined,
            (draft) => {
              const item = draft.find((f) => f.freelancerId === id);
              if (item) Object.assign(item, body);
            },
          ),
        );
        queryFulfilled.catch(patchResult.undo);
      },
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

    // ---------- DELETE ----------
    deleteFreelancer: builder.mutation<AuthResponse, void>({
      query: () => ({ url: "/", method: "DELETE" }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        const id = getFreelancerIdFromToken();

        const patchResult = dispatch(
          freelancerApi.util.updateQueryData(
            "getAllFreelancers",
            undefined,
            (draft) => {
              return draft.filter((f) => f.freelancerId !== id);
            },
          ),
        );

        try {
          const { data } = await queryFulfilled;
          if (data.token && data.user) {
            dispatch(login({ user: data.user, token: data.token }));
          }
        } catch {
          patchResult.undo();
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
  useDeleteFreelancerMutation,
} = freelancerApi;
