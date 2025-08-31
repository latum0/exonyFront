import { useState } from "react";
import api from "@/api/axios";

// Export the interfaces so they can be used in other files
export interface Fournisseur {
  id: string;
  idFournisseur: number;
  nom: string;
  adresse: string;
  contact: string;
  telephone: string;
  email: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface FournisseurInput {
  nom: string;
  adresse: string;
  contact: string;
  telephone: string;
  email: string;
}

export interface FournisseurUpdateInput extends Partial<FournisseurInput> { }

interface UseFournisseursReturn {
  fournisseurs: Fournisseur[];
  fournisseur: Fournisseur | null;
  loading: boolean;
  error: string | null;
  getFournisseurs: () => Promise<void>;
  getFournisseur: (id: string) => Promise<void>;
  createFournisseur: (
    data: FournisseurInput
  ) => Promise<Fournisseur | undefined>;
  updateFournisseur: (
    id: string,
    data: FournisseurUpdateInput
  ) => Promise<Fournisseur | undefined>;
  deleteFournisseur: (id: string) => Promise<boolean>; // Changed from number to string
  resetFournisseur: () => void;
}

export const useFournisseurs = (): UseFournisseursReturn => {
  const [fournisseurs, setFournisseurs] = useState<Fournisseur[]>([]);
  const [fournisseur, setFournisseur] = useState<Fournisseur | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleApiError = (error: unknown) => {
    let errorMessage = "Une erreur est survenue";

    if (typeof error === "object" && error !== null) {
      if ("response" in error) {
        const axiosError = error as {
          response: { data: { message?: string } };
        };
        errorMessage = axiosError.response.data.message || errorMessage;
      } else if ("message" in error) {
        errorMessage = (error as { message: string }).message;
      }
    }

    setError(errorMessage);
    setLoading(false);
    return undefined;
  };

  const getFournisseurs = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get<{ data: Fournisseur[] }>("/fournisseurs");
      console.log(response.data.data);
      setFournisseurs(response.data.data);
      setLoading(false);
    } catch (error) {
      handleApiError(error);
    }
  };

  const getFournisseur = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get<Fournisseur>(`/fournisseurs/${id}`);
      setFournisseur(response.data);
      setLoading(false);
    } catch (error) {
      handleApiError(error);
    }
  };

  const createFournisseur = async (data: FournisseurInput) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post<Fournisseur>("/fournisseurs", data);
      setFournisseurs((prev) => [...prev, response.data]);
      setLoading(false);
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  };

  const updateFournisseur = async (
    id: string,
    data: FournisseurUpdateInput
  ) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.patch<Fournisseur>(
        `/fournisseurs/${id}`,
        data
      );
      setFournisseurs((prev) =>
        prev.map((f) => (f.id === id ? response.data : f))
      );
      if (fournisseur?.id === id) {
        setFournisseur(response.data);
      }
      setLoading(false);
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  };

  // Fixed: Changed parameter type from number to string to match interface
  const deleteFournisseur = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await api.delete(`/fournisseurs/${id}`);
      // Use string comparison for id, and idFournisseur for number comparison
      setFournisseurs((prev) => prev.filter((f) => f.id !== id));
      if (fournisseur?.id === id) {
        setFournisseur(null);
      }
      setLoading(false);
      return true;
    } catch (error) {
      handleApiError(error);
      return false;
    }
  };

  const resetFournisseur = () => {
    setFournisseur(null);
  };

  return {
    fournisseurs,
    fournisseur,
    loading,
    error,
    getFournisseurs,
    getFournisseur,
    createFournisseur,
    updateFournisseur,
    deleteFournisseur,
    resetFournisseur,
  };
};