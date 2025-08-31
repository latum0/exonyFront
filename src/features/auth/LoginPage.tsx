import {
  Card, CardHeader, CardDescription,
  CardContent, CardFooter,
} from "@/components/ui/card";
import LoginForm from "@/components/auth/LoginForm";
import useLogin from "@/hooks/useLogin";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const { login } = useLogin();
  const navigate = useNavigate();

  const handleLogin = async (formData: any) => {
    try {
      await login(formData);
    } catch (error: any) {
      alert(error.message);
    }
  };

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

      {/* Card au-dessus des logos */}
      <Card className="relative z-10 w-full max-w-md mx-auto p-8 rounded-2xl shadow-lg border border-gray-200">
        <CardHeader className="space-y-3 text-center">
          <div className="flex flex-col items-center space-y-2">
            <img src="/logoexony.png" alt="Logo Exony" className="h-14 w-14" />
            <span className="text-3xl text-[#F8A67E] font-semibold font-poppins">
              Exony
            </span>
          </div>
          <CardDescription className="text-gray-600">
            Insérez vos informations pour accéder à votre compte
          </CardDescription>
        </CardHeader>

        <CardContent>
          <LoginForm onSubmit={handleLogin} />
        </CardContent>

        <CardFooter className="flex flex-col items-center mt-4 space-y-2">
          {/* <p className="text-sm text-gray-600">
            Vous n'avez pas de compte ?{" "}
            <button
              onClick={() => navigate("/register")}
              className="text-[#F8A67E] font-medium hover:underline transition duration-200"
            >
              Inscrivez-vous
            </button>
          </p> */}
          <button
            onClick={() => navigate("/forgot-password")}
            className="text-sm text-[#F8A67E] hover:underline"
          >
            Mot de passe oublié ?
          </button>
        </CardFooter>
      </Card>
    </div>
  );
}



