import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { login, logout } from "./userSlice";
import type { User } from "../../../types/user";
// import type { RootState } from "../../../app/store";

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
      query: (credentials) => ({
        url: "/Auth/login",
        method: "POST",
        body: credentials,
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;

          console.log("Success! Server returned:", data);

          const token = data?.token || data?.Token;
          const user = data?.user || data?.User;

          if (token && user) {
            localStorage.setItem("token", token);
            dispatch(login({ user, token }));
            console.log("User logged in and state updated.");
          }
        } catch (err) {
          // כאן אנחנו מדפיסים את השגיאה המדויקת מהשרת
          const errorData = (err as Record<string, unknown>)?.error?.data;
          console.error("--- LOGIN ERROR ---");
          console.log(
            "Status Code:",
            (err as Record<string, unknown>)?.error?.status,
          );
          console.log(
            "Error Detail:",
            errorData?.detail || errorData?.Message || "Unknown error",
          );
          console.log("Full Error Object:", err);
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
        url: "/User", // הוספת לוכסן בתחילת הנתיב
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
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useDeleteAccountMutation,
  useUpdateUserMutation,
  useGetUserByIdQuery,
} = userApi;
