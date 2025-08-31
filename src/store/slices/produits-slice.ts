import { createSlice } from "@reduxjs/toolkit";
import {
  createProduit,
  updateProduit,
  fetchProduits,
  deleteProduit,
  fetchFournisseurs,
  fetchProduit,
} from "@/hooks/produits-hook";

import type { Produit } from "@/components/produits/columns";
import type { Fournisseur } from "@/features/Produits/ajouter/page";

interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

interface ProduitState {
  produits: Produit[];
  produit: Produit;
  fournisseurs: Fournisseur[];
  pagination: Pagination | null;
  loading: boolean;
  error: string | null;
}

const initialState: ProduitState = {
  produits: [],
  produit: {} as Produit,
  fournisseurs: [],
  pagination: null,
  loading: false,
  error: null,
};

const produitsSlice = createSlice({
  name: "produits",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // --- FETCH ---
    builder.addCase(fetchProduits.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchProduits.fulfilled, (state, action) => {
      state.produits = action.payload.data;
      state.pagination = action.payload.pagination;
      state.loading = false;
    });
    builder.addCase(fetchProduits.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to fetch produits.";
    });
    builder.addCase(fetchProduit.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchProduit.fulfilled, (state, action) => {
      state.produit = action.payload;
      console.log(state.produit);
      state.loading = false;
    });
    builder.addCase(fetchProduit.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to fetch produits.";
    });
    builder.addCase(fetchFournisseurs.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchFournisseurs.fulfilled, (state, action) => {
      state.fournisseurs = action.payload.data;
      console.log(state.fournisseurs);
      state.loading = false;
    });
    builder.addCase(fetchFournisseurs.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to fetch produits.";
    });

    // --- CREATE ---
    builder.addCase(createProduit.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createProduit.fulfilled, (state, action) => {
      state.produits.push(action.payload);
      state.loading = false;
    });
    builder.addCase(createProduit.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to create produit.";
    });

    // --- UPDATE ---
    builder.addCase(updateProduit.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateProduit.fulfilled, (state, action) => {
      const index = state.produits.findIndex(
        (p) => p.idProduit === action.payload.idProduit
      );
      if (index !== -1) {
        state.produits[index] = action.payload;
      }
      state.loading = false;
    });
    builder.addCase(updateProduit.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to update produit.";
    });

    // --- DELETE ---
    builder.addCase(deleteProduit.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(deleteProduit.fulfilled, (state, action) => {
      state.produits = state.produits.filter(
        (p) => p.idProduit !== action.meta.arg
      );
      state.loading = false;
    });
    builder.addCase(deleteProduit.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to delete produit.";
    });
  },
});

export default produitsSlice.reducer;
