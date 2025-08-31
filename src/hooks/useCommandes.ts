import { useState } from "react";
import api from "@/api/axios";

export interface CreateLigneCommandeDto {
  quantite: number;
  produitId: string;
}

export interface CreateCommandeDto {
  dateCommande?: string;
  statut: string;
  adresseLivraison: string;
  clientId: number;
  lignes: CreateLigneCommandeDto[];
}

export interface UpdateLinePatchDto {
  op: "add" | "update" | "remove";
  produitId: string;
  quantite?: number;
}

export interface UpdateCommandeDto {
  statut?: string;
  adresseLivraison?: string;
  clientId?: number;
  lignes?: UpdateLinePatchDto[];
}

export interface LigneResponseDto {
  idLigne: number;
  produitId: string;
  quantite: number;
  prixUnitaire: string;
  commandeId: string;
}

export interface CommandeResponseDto {
  idCommande: string;
  dateCommande: string;
  statut: string;
  adresseLivraison: string;
  montantTotal: string;
  clientId: number;
  ligne: LigneResponseDto[];
}

export interface CommandeListResponseDto {
  items: CommandeResponseDto[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface GetCommandesParams {
  page?: number;
  limit?: number;
  clientId?: number;
  statut?: string;
  produitId?: string;
  minTotal?: number;
  maxTotal?: number;
  dateFrom?: string;
  dateTo?: string;
  orderBy?: "dateCommande" | "montantTotal" | "clientId";
  orderDir?: "asc" | "desc";
}

interface UseCommandesReturn {
  commandes: CommandeResponseDto[];
  commande: CommandeResponseDto | null;
  meta: CommandeListResponseDto["meta"] | null;
  loading: boolean;
  error: string | null;
  getCommandes: (params?: GetCommandesParams) => Promise<void>;
  getCommande: (id: string) => Promise<void>;
  createCommande: (data: CreateCommandeDto) => Promise<CommandeResponseDto | undefined>;
  updateCommande: (id: string, data: UpdateCommandeDto) => Promise<CommandeResponseDto | undefined>;
  updateCommandeMontant: (id: string, montantTotal: string) => Promise<CommandeResponseDto | undefined>;
  deleteCommande: (id: string) => Promise<boolean>;
  resetCommande: () => void;
}

export const useCommandes = (): UseCommandesReturn => {
  const [commandes, setCommandes] = useState<CommandeResponseDto[]>([]);
  const [commande, setCommande] = useState<CommandeResponseDto | null>(null);
  const [meta, setMeta] = useState<CommandeListResponseDto["meta"] | null>(null);
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

  const getCommandes = async (params?: GetCommandesParams) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get<CommandeListResponseDto>("/commandes", { params });
      setCommandes(response.data.items);
      setMeta(response.data.meta);
      setLoading(false);
    } catch (error) {
      handleApiError(error);
    }
  };

  const getCommande = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get<CommandeResponseDto>(`/commandes/${id}`);
      setCommande(response.data);
      setLoading(false);
    } catch (error) {
      handleApiError(error);
    }
  };

  const createCommande = async (data: CreateCommandeDto) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post<CommandeResponseDto>("/commandes", data);
      setCommandes((prev) => [...prev, response.data]);
      setLoading(false);
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  };

  const updateCommande = async (id: string, data: UpdateCommandeDto) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.patch<CommandeResponseDto>(`/commandes/${id}`, data);
      setCommandes((prev) =>
        prev.map((c) => (c.idCommande === id ? response.data : c))
      );
      if (commande?.idCommande === id) {
        setCommande(response.data);
      }
      setLoading(false);
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  };

  const updateCommandeMontant = async (id: string, montantTotal: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.patch<CommandeResponseDto>(
        `/commandes/${id}/montant`,
        { montantTotal }
      );
      setCommandes((prev) =>
        prev.map((c) => (c.idCommande === id ? response.data : c))
      );
      if (commande?.idCommande === id) {
        setCommande(response.data);
      }
      setLoading(false);
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  };

  const deleteCommande = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await api.delete(`/commandes/${id}`);
      setCommandes((prev) => prev.filter((c) => c.idCommande !== id));
      if (commande?.idCommande === id) {
        setCommande(null);
      }
      setLoading(false);
      return true;
    } catch (error) {
      handleApiError(error);
      return false;
    }
  };

  const resetCommande = () => {
    setCommande(null);
  };

  return {
    commandes,
    commande,
    meta,
    loading,
    error,
    getCommandes,
    getCommande,
    createCommande,
    updateCommande,
    updateCommandeMontant,
    deleteCommande,
    resetCommande,
  };
};