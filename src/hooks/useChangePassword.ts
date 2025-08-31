// src/hooks/useChangePassword.ts
import { useState } from "react";
import { useDispatch } from "react-redux";
import api from "@/api/axios";
import {
  changePasswordStart,
  changePasswordSuccess,
  changePasswordFailure,
} from "@/store/slices/passwordSlice";

interface ChangePasswordData {
  oldPassword: string;
  newPassword: string;
}

export default function useChangePassword() {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const changePassword = async (passwordData: ChangePasswordData) => {
    try {
      setIsLoading(true);
      setError(null);
      setIsSuccess(false);
      dispatch(changePasswordStart());

      const token = localStorage.getItem("accessToken");
      const response = await api.post("/auth/change-password", passwordData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      dispatch(changePasswordSuccess());
      setIsSuccess(true);
      return response.data;
    } catch (err: any) {
      console.error("Erreur changement mot de passe :", err);
      const errorMessage = err?.response?.data?.message || "Erreur serveur";
      setError(errorMessage);
      dispatch(changePasswordFailure(errorMessage));
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const resetState = () => {
    setError(null);
    setIsSuccess(false);
  };

  return {
    changePassword,
    isLoading,
    error,
    isSuccess,
    resetState,
  };
}