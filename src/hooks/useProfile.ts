// src/hooks/useProfile.ts
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProfileStart,
  fetchProfileSuccess,
  fetchProfileFailure,
} from "@/store/slices/profileSlice";
import api from "@/api/axios";

import type { RootState } from "@/store";

export default function useProfile() {
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector((state: RootState) => state.profile);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        dispatch(fetchProfileStart());

        const token = localStorage.getItem("accessToken");
        const response = await api.get("/auth/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        dispatch(fetchProfileSuccess(response.data.data));
      } catch (err: any) {
        console.error("Erreur récupération profil :", err);
        dispatch(fetchProfileFailure(err?.response?.data?.message || "Erreur serveur"));
      }
    };

    fetchProfile();
  }, [dispatch]);

  return { profile: data, loading, error };
}
