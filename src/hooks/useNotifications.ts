// src/hooks/useNotifications.ts
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import api from "@/api/axios";
import {
  fetchNotificationsStart,
  fetchNotificationsSuccess,
  fetchNotificationsFailure,
  fetchNotificationStart,
  fetchNotificationSuccess,
  fetchNotificationFailure,
  deleteNotificationStart,
  deleteNotificationSuccess,
  deleteNotificationFailure,
} from "@/store/slices/notificationsSlice";
import type { RootState } from "@/store";

export interface Notification {
  id: string;
  produitId: string;
  type: "OUT_OF_STOCK" | "LOW_STOCK" | "OTHER";
  message: string;
  createdAt: string;
  resolved: boolean;
}

export interface NotificationsResponse {
  items: Notification[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export default function useNotifications() {
  const dispatch = useDispatch();
  const { notifications, currentNotification, loading, error, deleting } =
    useSelector((state: RootState) => state.notifications);

  const [localLoading, setLocalLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  // Récupérer toutes les notifications
  const fetchNotifications = async (page: number = 1, limit: number = 25) => {
    try {
      dispatch(fetchNotificationsStart());
      setLocalLoading(true);
      setLocalError(null);

      const token = localStorage.getItem("accessToken");
      const response = await api.get<NotificationsResponse>(
        `/notifications?page=${page}&limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      dispatch(fetchNotificationsSuccess(response.data));
      return response.data;
    } catch (err: any) {
      console.error("Erreur récupération notifications :", err);
      const errorMessage = err?.response?.data?.message || "Erreur serveur";
      dispatch(fetchNotificationsFailure(errorMessage));
      setLocalError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLocalLoading(false);
    }
  };

  // Récupérer une notification par son ID
  const fetchNotification = async (id: string) => {
    try {
      dispatch(fetchNotificationStart());
      setLocalLoading(true);
      setLocalError(null);

      const token = localStorage.getItem("accessToken");
      const response = await api.get<Notification>(`/notifications/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      dispatch(fetchNotificationSuccess(response.data));
      return response.data;
    } catch (err: any) {
      console.error("Erreur récupération notification :", err);
      const errorMessage = err?.response?.data?.message || "Erreur serveur";
      dispatch(fetchNotificationFailure(errorMessage));
      setLocalError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLocalLoading(false);
    }
  };

  // Supprimer une notification
  const deleteNotification = async (id: string) => {
    try {
      dispatch(deleteNotificationStart(id));
      setLocalError(null);

      const token = localStorage.getItem("accessToken");
      const response = await api.delete(`/notifications/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      dispatch(deleteNotificationSuccess(id));
      return response.data;
    } catch (err: any) {
      console.error("Erreur suppression notification :", err);
      const errorMessage = err?.response?.data?.message || "Erreur serveur";
      dispatch(deleteNotificationFailure({ id, error: errorMessage }));
      setLocalError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Réinitialiser les erreurs
  const resetError = () => {
    setLocalError(null);
  };

  return {
    // États
    notifications: notifications.items,
    meta: notifications.meta,
    currentNotification,
    loading: loading || localLoading,
    error: error || localError,
    deleting,

    // Méthodes
    fetchNotifications,
    fetchNotification,
    deleteNotification,
    resetError,
  };
}
