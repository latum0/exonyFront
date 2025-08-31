import { RegisterForm } from "@/components/auth/RegistserForm";
import { useNavigate } from "react-router-dom";
import {
  CardHeader,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

export default function RegisterPage() {
  const navigate = useNavigate();

  return (
    <div className="relative w-screen h-screen bg-gray-50 flex items-center justify-center overflow-hidden">
      {/* Logos flottants */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <img
            key={i}
            src="/logoexony.png"
            alt="Floating Logo"
            className="absolute w-20 h-20 opacity-30 animate-slide"
            style={{
              top: `${i * 15}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${i * 4}s`,
            }}
          />
        ))}
      </div>

      {/* Contenu au-dessus des logos */}
      <div className="relative z-10 w-full max-w-md bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
        <CardHeader className="space-y-3 text-center">
          <div className="flex flex-col items-center space-y-2">
            <img src="/logoexony.png" alt="Logo Exony" className="h-14 w-14" />
            <span className="text-3xl text-[#F8A67E] font-semibold font-poppins">
              Exony
            </span>
          </div>
          <CardDescription className="text-gray-600">
            Bienvenue sur Exony, inscrivez-vous pour continuer
          </CardDescription>
        </CardHeader>

        <CardContent>
          <RegisterForm />
        </CardContent>

        <div className="mt-6 text-center text-sm text-gray-600">
          <span>Vous avez déjà un compte ? </span>
          <button
            onClick={() => navigate("/")}
            className="text-[#F8A67E] font-medium hover:underline transition duration-200"
          >
            Connectez-vous
          </button>
        </div>
      </div>
    </div>
  );
}
