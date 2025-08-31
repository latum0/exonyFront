import { useState } from "react";
import api from "@/api/axios";

export interface Historique {
  idHistorique: number;
  dateModification: string;
  descriptionAction: string;
  utilisateur: {
    id: number;
    name: string;
  };
  utilisateurId: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface HistoriqueFilterParams {
  page?: number;
  perPage?: number;
  acteur?: string;
  descriptionAction?: string;
  utilisateurId?: number;
  dateFrom?: string;
  dateTo?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    perPage: number;
    totalPages: number;
  };
}

interface UseHistoriqueReturn {
  historiques: Historique[];
  historique: Historique | null;
  loading: boolean;
  error: string | null;
  getHistoriques: (filters?: HistoriqueFilterParams) => Promise<void>;
  getHistorique: (id: number) => Promise<void>;
  deleteHistorique: (id: number) => Promise<boolean>;
  deleteOldHistoriques: () => Promise<number | undefined>;
  resetHistorique: () => void;
}

export const useHistorique = (): UseHistoriqueReturn => {
  const [historiques, setHistoriques] = useState<Historique[]>([]);
  const [historique, setHistorique] = useState<Historique | null>(null);
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

  const getHistoriques = async (filters: HistoriqueFilterParams = {}) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();

      if (filters.page) params.append("page", filters.page.toString());
      if (filters.perPage) params.append("perPage", filters.perPage.toString());
      if (filters.acteur) params.append("acteur", filters.acteur);
      if (filters.descriptionAction)
        params.append("descriptionAction", filters.descriptionAction);
      if (filters.utilisateurId)
        params.append("utilisateurId", filters.utilisateurId.toString());
      if (filters.dateFrom) params.append("dateFrom", filters.dateFrom);
      if (filters.dateTo) params.append("dateTo", filters.dateTo);

      const response = await api.get<PaginatedResponse<Historique>>(
        `/historiques?${params.toString()}`
      );
      setHistoriques(response.data.data);
      setLoading(false);
    } catch (error) {
      handleApiError(error);
    }
  };

  const getHistorique = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get<Historique>(`/historiques/${id}`);
      setHistorique(response.data);
      setLoading(false);
    } catch (error) {
      handleApiError(error);
    }
  };

  const deleteHistorique = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await api.delete(`/historiques/${id}`);
      setHistoriques((prev) => prev.filter((h) => h.idHistorique !== id));
      if (historique?.idHistorique === id) {
        setHistorique(null);
      }
      setLoading(false);
      return true;
    } catch (error) {
      handleApiError(error);
      return false;
    }
  };

  const deleteOldHistoriques = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.delete<{ deleted: number }>(
        "/historiques/old"
      );
      setLoading(false);
      return response.data.deleted;
    } catch (error) {
      handleApiError(error);
      return undefined;
    }
  };

  const resetHistorique = () => {
    setHistorique(null);
  };

  return {
    historiques,
    historique,
    loading,
    error,
    getHistoriques,
    getHistorique,
    deleteHistorique,
    deleteOldHistoriques,
    resetHistorique,
  };
};
