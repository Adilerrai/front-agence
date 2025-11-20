import { apiSlice } from "../apiSlice";

export const produitApi = apiSlice.injectEndpoints({
  tagTypes: ["produits"],
  endpoints: (builder) => ({
    // Récupérer tous les produits
    getAllProduits: builder.query({
      query: () => ({
        url: "api/v1/produit/all",
        method: "GET",
      }),
      providesTags: ["produits"],
    }),
    
    // Récupérer un produit par ID
    getProduitById: builder.query({
      query: (id) => ({
        url: `api/v1/produit/get/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "produits", id }],
    }),
    
    // Créer un nouveau produit
    createProduit: builder.mutation({
      query: (produit) => ({
        url: "api/v1/produit/add",
        method: "POST",
        body: produit,
      }),
      invalidatesTags: ["produits"],
    }),
    
    // Mettre à jour un produit
    updateProduit: builder.mutation({
      query: (produit) => ({
        url: "api/v1/produit/update",
        method: "POST",
        body: produit,
      }),
      invalidatesTags: ["produits"],
    }),
    
    // Supprimer un produit
    deleteProduit: builder.mutation({
      query: (id) => ({
        url: `api/v1/produit/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["produits"],
    }),
  }),
});

export const {
  useGetAllProduitsQuery,
  useGetProduitByIdQuery,
  useCreateProduitMutation,
  useUpdateProduitMutation,
  useDeleteProduitMutation,
} = produitApi;
