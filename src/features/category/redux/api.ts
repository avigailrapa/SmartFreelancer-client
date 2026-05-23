import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Category } from "../../../types/category";

export const categoryApi = createApi({
  reducerPath: "categoryApi",
  baseQuery: fetchBaseQuery({ baseUrl: "https://localhost:7233/api/" }),
  endpoints: (builder) => ({
    // ---------- GET ALL ----------
    getAllCategories: builder.query<Category[], void>({
      query: () => "Category",
    }),

    // ---------- GET BY ID ----------
    getCategoryById: builder.query<Category, number>({
      query: (id) => `Category/${id}`,
    }),
  }),
});

export const { useGetAllCategoriesQuery, useGetCategoryByIdQuery } =
  categoryApi;
