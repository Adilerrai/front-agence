import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "/", // Use local mock server for development
    prepareHeaders: (headers, { getState }) => {
      // Ajouter le token d'authentification si disponible
      const token = getState()?.auth?.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['produits', 'users', 'pointsVente'],
  endpoints: (builder) => ({}),
});
