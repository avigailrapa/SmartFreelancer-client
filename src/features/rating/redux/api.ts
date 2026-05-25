import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Rating } from "../../../types/rating";
import type { RatingCreate } from "../../../types/ratingCreate";

export const ratingApi = createApi({
  reducerPath: "ratingApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://localhost:7233/api/",

    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    addRating: builder.mutation<Rating, RatingCreate>({
      query: (newRating) => ({
        url: "Rating",
        method: "POST",
        body: newRating,
      }),
    }),
  }),
});

export const { useAddRatingMutation } = ratingApi;
