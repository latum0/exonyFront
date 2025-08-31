// src/hooks/useVerifyEmail.ts
import { useState, useCallback } from 'react';
import api from '@/api/axios';

export type VerifyEmailState = {
  status: 'idle' | 'loading' | 'success' | 'error';
  message: string;
};

export default function useVerifyEmail() {
  const [state, setState] = useState<VerifyEmailState>({
    status: 'idle',
    message: '',
  });

  const verifyEmail = useCallback(async (verificationToken: string) => {
    try {
      setState({ status: 'loading', message: 'Vérification en cours...' });

      const response = await api.post("/auth/verify-email", { 
        token: verificationToken 
      });

      if (response.status >= 200 && response.status < 300) {
        setState({
          status: 'success',
          message: response.data.message || 'Email vérifié avec succès!',
        });
      } else {
        throw new Error(response.data.message || "Réponse inattendue du serveur");
      }
    } catch (error: any) {
      let errorMessage = "Erreur lors de la vérification";
      
      if (error.response) {
        if (error.response.status === 400) {
          errorMessage = "Token invalide ou expiré";
        } else if (error.response.data?.message) {
          errorMessage = error.response.data.message;
        }
      } else {
        errorMessage = error.message || errorMessage;
      }

      setState({ status: 'error', message: errorMessage });
    }
  }, []);

  return {
    ...state,
    verifyEmail
  };
}