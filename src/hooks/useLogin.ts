// src/hooks/useLogin.ts
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setTokens } from "@/store/slices/authSlice";
import api from "@/api/axios";

export default function useLogin() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const login = async (formData: { email: string; password: string }) => {
    try {
      const response = await api.post("/auth/login", {
        email: formData.email,
        password: formData.password,
      });

      const { accessToken, refreshToken, user } = response.data;

      // Stockage dans localStorage
      localStorage.setItem("accessToken", accessToken);
      // localStorage.setItem("refreshToken", refreshToken);

      dispatch(
        setTokens({
          accessToken,
          refreshToken,
        })
      );

      navigate("/dashboard");
    } catch (error: any) {
      console.error("Login failed", error.response?.data || error.message);

      let errorMessage = "Échec de la connexion. Vérifiez vos identifiants.";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      throw new Error(errorMessage);
    }
  };

  return { login };
}
