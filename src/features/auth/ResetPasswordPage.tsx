import { toast } from "sonner";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import api from "@/api/axios";

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await api.post("/auth/reset-password", {
        token,
        newPassword,
      });

      toast.success("Mot de passe réinitialisé avec succès !");
      setTimeout(() => navigate("/"), 500);
    } catch (err: any) {
      setError(err.response?.data?.message || "Une erreur s’est produite.");
      toast.error(err.response?.data?.message || "Une erreur s’est produite.");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-gray-50">
        <p className="text-red-500 font-semibold">
          Token invalide ou manquant.
        </p>
      </div>
    );
  }

  return (
    <div className="relative w-screen h-screen flex items-center justify-center bg-gray-50 overflow-hidden">
      {/* Logos flottants */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <img
            key={i}
            src="/logoexony.png"
            alt="Floating Logo"
            className="absolute w-20 h-20 opacity-30 "
            style={{
              top: `${i * 15}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${i * 4}s`,
            }}
          />
        ))}
      </div>

      {/* Formulaire */}
      <form
        onSubmit={handleSubmit}
        className="relative z-10 w-full max-w-md p-8 bg-white rounded-2xl shadow-lg border border-gray-200 space-y-6"
      >
        <div className="flex flex-col items-center space-y-2">
          <img src="/logoexony.png" alt="Logo Exony" className="h-14 w-14" />
          <h2 className="text-2xl font-semibold text-[#F8A67E]">
            Réinitialiser le mot de passe
          </h2>
        </div>

        <p className="text-sm text-gray-600 text-center">
          Saisissez votre nouveau mot de passe ci-dessous.
        </p>

        <div className="space-y-2">
          <Label htmlFor="newPassword">Nouveau mot de passe</Label>
          <Input
            id="newPassword"
            type="password"
            placeholder="Votre nouveau mot de passe"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            className="focus:ring-[#F8A67E] focus:border-[#F8A67E]"
          />
        </div>

        <Button
          type="submit"
          disabled={loading}
          style={{ background: "#F8A67E" }}
          className="w-full hover:bg-[#f79469] text-white font-semibold rounded-md"
        >
          {loading ? "Réinitialisation..." : "Réinitialiser"}
        </Button>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
      </form>
    </div>
  );
}
