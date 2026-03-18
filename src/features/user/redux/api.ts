import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { login, logout } from "./userSlice";

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

  // ---------- LOGIN ----------
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "/Auth/login",
        method: "POST",
        body: credentials,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;

          const token = data.Token || data.token;
          const user = data.User || data.user;

          if (token && user) {
            localStorage.setItem("token", token);

            dispatch(login({ user, token }));
            console.log("Login successful, token saved!");
          }
        } catch (err) {
          console.error("Login transformation failed:", err);
        }
      },
    }),
    // ---------- REGISTER ----------
    register: builder.mutation({
      query: (userData) => ({
        url: "/Auth/register",
        method: "POST",
        body: userData,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
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

    // ---------- DELETE ----------
    deleteAccount: builder.mutation({
      query: () => ({ url: "/Auth/delete", method: "DELETE" }),
      invalidatesTags: ["User"],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(logout());
        } catch (err) {
          console.error("Delete account failed:", err);
        }
      },
    }),

    // ---------- UPDATE ----------
    updateUser: builder.mutation({
      query: ({ userData }) => ({
        url: `/User`,
        method: "PUT",
        body: userData,
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useDeleteAccountMutation,
  useUpdateUserMutation,
} = userApi;
