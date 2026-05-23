import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { login } from "./userSlice";
import type { User } from "../../../types/user";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://localhost:7233/api",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["User"],

  endpoints: (builder) => ({
    // ---------- LOGIN ----------
    login: builder.mutation({
      query: ({ asFreelancer = false, ...credentials }) => ({
        url: `/Auth/login?asFreelancer=${asFreelancer}`,
        method: "POST",
        body: credentials,
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          const token = data?.token || data?.Token;
          const user = data?.user || data?.User;

          if (token && user) {
            localStorage.setItem("token", token);
            dispatch(login({ user, token }));
          }
        } catch (err) {
          console.log("Login error:", err);
        }
      },
    }),

    // ---------- GET BY ID ----------
    getUserById: builder.query({
      query: (id) => `/User/${id}`,
      providesTags: ["User"],
    }),

    // ---------- UPDATE ----------
    updateUser: builder.mutation<User, Partial<User>>({
      query: (userPayload) => ({
        url: "/User",
        method: "PUT",
        body: userPayload,
      }),
      invalidatesTags: ["User"],
    }),

    // ---------- REGISTER ----------
    register: builder.mutation({
      query: (userData) => ({
        url: "/Auth/register",
        method: "POST",
        body: userData,
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data.Token && data.User) {
            dispatch(login({ user: data.User, token: data.Token }));
          }
        } catch (err) {
          console.error("Registration failed:", err);
        }
      },
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useUpdateUserMutation,
  useGetUserByIdQuery,
} = userApi;
