import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/api/axios";

export interface ProduitFormValues {
  nom: string;
  description: string;
  prix: number;
  stock: number;
  remise: number;
  marque: string;
  categorie: string;
  images: File[];
  fournisseurs: number[];
}

export interface EditProduitFormValues {
  nom: string;
  description: string;
  prix: number;
  stock: number;
  remise: number;
  marque: string;
  categorie: string;
  images: File[];
  keepImages: string[];
  fournisseurs: number[];
}

export const createProduit = createAsyncThunk(
  "produits/create",
  async (produit: ProduitFormValues, { rejectWithValue }) => {
    try {
      const formData = new FormData();

      // Add text fields
      formData.append("nom", produit.nom);
      formData.append("description", produit.description);
      formData.append("prix", produit.prix.toString());
      formData.append("stock", produit.stock.toString());
      formData.append("remise", produit.remise.toString());
      formData.append("marque", produit.marque);
      formData.append("categorie", produit.categorie);

      // Add images
      produit.images.forEach((image, index) => {
        formData.append(`images`, image);
      });

      // Add suppliers as JSON array
      formData.append("fournisseurs", JSON.stringify(produit.fournisseurs));

      const response = await api.post("/produits", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data;
    } catch (err: any) {
      return rejectWithValue({
        status: err?.response?.status ?? 500,
        message:
          err?.response?.data?.message ?? "Une erreur inconnue est survenue.",
      });
    }
  }
);

export const updateProduit = createAsyncThunk(
  "produits/update",
  async (
    { id, data }: { id: string; data: EditProduitFormValues },
    { rejectWithValue }
  ) => {
    try {
      const formData = new FormData();

      // Add text fields
      formData.append("nom", data.nom);
      formData.append("description", data.description);
      formData.append("prix", data.prix.toString());
      formData.append("stock", data.stock.toString());
      formData.append("remise", data.remise.toString());
      formData.append("marque", data.marque);
      formData.append("categorie", data.categorie);

      // Add new images
      data.images.forEach((image) => {
        formData.append(`images`, image);
      });

      // Add kept images as JSON array
      formData.append("keepImages", JSON.stringify(data.keepImages));

      // Add suppliers as JSON array
      formData.append("fournisseurs", JSON.stringify(data.fournisseurs));

      const response = await api.put(`/produits/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(response);
      return response.data;
    } catch (err: any) {
      return rejectWithValue({
        status: err?.response?.status ?? 500,
        message:
          err?.response?.data?.message ?? "Une erreur inconnue est survenue.",
      });
    }
  }
);

export const fetchProduits = createAsyncThunk(
  "produits/fetchAll",
  async (params?: {
    page?: number;
    limit?: number;
    nom?: string;
    marque?: string;
    categorie?: string;
  }) => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append("page", params.page.toString());
    if (params?.limit) searchParams.append("limit", params.limit.toString());
    if (params?.nom) searchParams.append("nom", params.nom);
    if (params?.marque) searchParams.append("marque", params.marque);
    if (params?.categorie) searchParams.append("categorie", params.categorie);

    const response = await api.get(`/produits?${searchParams.toString()}`);
    return response.data;
  }
);

export const fetchProduit = createAsyncThunk(
  "produits/fetchOne",
  async (id: string) => {
    const response = await api.get(`/produits/${id}`);

    return response.data;
  }
);

export const fetchFournisseurs = createAsyncThunk(
  "fournisseurs/fetchAll",
  async () => {
    const response = await api.get(`/fournisseurs`);
    return response.data;
  }
);

export const deleteProduit = createAsyncThunk(
  "produits/delete",
  async (id: string) => {
    const response = await api.delete(`/produits/${id}`);
    return response.data;
  }
);
