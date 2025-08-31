import { useState, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, User, Phone } from "lucide-react";

export function RegisterForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: ""
  });

  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.id]: e.target.value }));
    setError(""); // Reset error when typing
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    // TODO: API call
    console.log("Données d'inscription :", form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 mt-8 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-center text-gray-800">Créer un compte</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Nom complet */}
        <div className="space-y-1.5">
          <Label htmlFor="name">Nom complet</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="name"
              type="text"
              placeholder="Nom complet"
              className="pl-10"
              required
              value={form.name}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <Label htmlFor="email">Adresse e-mail</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="email"
              type="email"
              placeholder="Email"
              className="pl-10"
              required
              value={form.email}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Téléphone */}
        <div className="space-y-1.5">
          <Label htmlFor="phone">Numéro de téléphone</Label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="phone"
              type="tel"
              placeholder="06 XX XX XX XX"
              className="pl-10"
              required
              value={form.phone}
              onChange={handleChange}
            />
          </div>
        </div>


        {/* Mot de passe */}
        <div className="space-y-1.5">
          <Label htmlFor="password">Mot de passe</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="password"
              type="password"
              placeholder="Mot de passe"
              className="pl-10"
              required
              value={form.password}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Confirmation mot de passe */}
        <div className="md:col-span-2 space-y-1.5">
          <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Confirmer le mot de passe"
              className="pl-10"
              required
              value={form.confirmPassword}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      {/* Message d’erreur */}
      {error && (
        <p className="text-sm text-red-500 font-medium text-center">{error}</p>
      )}

      {/* Bouton de soumission */}
      <Button
        type="submit"
         style={{background:"#F8A67E"}}  
         className="w-full bg-[#F8A67E] hover:bg-[#f78d60] text-white font-semibold transition-colors duration-200"
      >
        S’inscrire
      </Button>
    </form>
  );
}
