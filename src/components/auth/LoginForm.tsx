// src/components/auth/LoginForm.jsx
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { User, Lock, Eye, EyeOff } from "lucide-react";
import type { FormEvent, ChangeEvent } from 'react';

interface LoginFormProps {
  onSubmit: (data: any) => void; // Or use proper type
}

export default function LoginForm({ onSubmit }: LoginFormProps) {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      console.log("Signing in with", formData);
      if (onSubmit) {
        await onSubmit(formData);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        {/* Champ username */}
        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-sm font-medium text-gray-700">
            Email
          </Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="email"
              name="email"
              placeholder="Entrez votre Email"
              className="pl-10 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#F8A67E] focus:border-[#F8A67E] transition duration-200"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Champ mot de passe */}
        <div className="space-y-1.5">
          <Label htmlFor="password" className="text-sm font-medium text-gray-700">
            Mot de passe
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Entrez votre mot de passe"
              className="pl-10 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#F8A67E] focus:border-[#F8A67E] transition duration-200"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-0 top-1/2 transform -translate-y-1/2 px-3 py-2 hover:bg-transparent"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-gray-400" />
              ) : (
                <Eye className="h-4 w-4 text-gray-400" />
              )}
              <span className="sr-only">
                {showPassword ? "Cacher le mot de passe" : "Afficher le mot de passe"}
              </span>
            </Button>
          </div>
        </div>
      </div>

      {/* Bouton submit */}
      <Button
        type="submit"
        className="w-full bg-[#F8A67E] hover:bg-[#f79469] text-white font-semibold rounded-md transition duration-200"
        disabled={loading}
        style={{ background: "#F8A67E" }}
      >
        {loading ? "Connexion..." : "Se connecter"}
      </Button>
    </form>

  );
}
