import { useState } from 'react';
import api from "@/api/axios";

export interface Retour {
  idRetour: number;
  dateRetour: string;
  statutRetour: string;
  raisonRetour: string;
  commandeId: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface RetourInput {
  dateRetour: string;
  statutRetour: string;
  raisonRetour: string;
  commandeId: string;
}

export interface RetourUpdateInput extends Partial<RetourInput> {}

export interface RetourFilterParams {
  page?: number;
  perPage?: number;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
  statutRetour?: string;
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

interface UseRetourReturn {
  retours: Retour[];
  retour: Retour | null;
  loading: boolean;
  error: string | null;
  getRetours: (page?: number, perPage?: number, dateFrom?: string, dateTo?: string, search?: string) => Promise<void>;
  getRetour: (id: number) => Promise<void>;
  createRetour: (data: RetourInput) => Promise<Retour | undefined>;
  updateRetour: (id: number, data: RetourUpdateInput) => Promise<Retour | undefined>;
  deleteRetour: (id: number) => Promise<boolean>;
  filterRetours: (filters: RetourFilterParams) => Promise<void>;
  resetRetour: () => void;
}

export const useRetour = (): UseRetourReturn => {
  const [retours, setRetours] = useState<Retour[]>([]);
  const [retour, setRetour] = useState<Retour | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleApiError = (error: unknown) => {
    let errorMessage = "Une erreur est survenue";
    
    if (typeof error === 'object' && error !== null) {
      if ('response' in error) {
        const axiosError = error as { response: { data: { message?: string } } };
        errorMessage = axiosError.response.data.message || errorMessage;
      } else if ('message' in error) {
        errorMessage = (error as { message: string }).message;
      }
    }

    setError(errorMessage);
    setLoading(false);
    return undefined;
  };

  const getRetours = async (page: number = 1, perPage: number = 25, dateFrom?: string, dateTo?: string, search?: string) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('perPage', perPage.toString());
      if (dateFrom) params.append('dateFrom', dateFrom);
      if (dateTo) params.append('dateTo', dateTo);
      if (search) params.append('search', search);

      const response = await api.get<PaginatedResponse<Retour>>(`/retours?${params.toString()}`);
      setRetours(response.data.data);
      setLoading(false);
    } catch (error) {
      handleApiError(error);
    }
  };

  const getRetour = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get<Retour>(`/retours/${id}`);
      setRetour(response.data);
      setLoading(false);
    } catch (error) {
      handleApiError(error);
    }
  };

  const createRetour = async (data: RetourInput) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post<Retour>('/retours', data);
      setRetours(prev => [...prev, response.data]);
      setLoading(false);
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  };

  const updateRetour = async (id: number, data: RetourUpdateInput) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.patch<Retour>(`/retours/${id}`, data);
      setRetours(prev =>
        prev.map(r => (r.idRetour === id ? response.data : r))
      );
      if (retour?.idRetour === id) {
        setRetour(response.data);
      }
      setLoading(false);
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  };

  const deleteRetour = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await api.delete(`/retours/${id}`);
      setRetours(prev => prev.filter(r => r.idRetour !== id));
      if (retour?.idRetour === id) {
        setRetour(null);
      }
      setLoading(false);
      return true;
    } catch (error) {
      handleApiError(error);
      return false;
    }
  };

  const filterRetours = async (filters: RetourFilterParams) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post<PaginatedResponse<Retour>>('/retours/filter', filters);
      setRetours(response.data.data);
      setLoading(false);
    } catch (error) {
      handleApiError(error);
    }
  };

  const resetRetour = () => {
    setRetour(null);
  };

  return {
    retours,
    retour,
    loading,
    error,
    getRetours,
    getRetour,
    createRetour,
    updateRetour,
    deleteRetour,
    filterRetours,
    resetRetour,
  };
};