// pages/ForgotPasswordPage.tsx
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useForgotPassword } from "@/hooks/useForgotPassword";

export default function ForgotPasswordPage() {
  const { email, setEmail, loading, handleSubmit, success } =
    useForgotPassword();

  return (
    <div className="relative w-screen h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-orange-100 overflow-hidden">
      {/* Logos flottants animés */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <img
            key={i}
            src="/logoexony.png"
            alt="Floating Logo"
            className="absolute w-16 h-16 opacity-20"
            style={{
              top: `${i * 15}%`,
              left: `${Math.random() * 90}%`,
              animationDelay: `${i * 3}s`,
            }}
          />
        ))}
      </div>

      {/* Carte principale */}
      <div className="relative z-10 w-full max-w-md p-8 bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-200 space-y-6 text-center animate-fadeIn">
        {/* Logo + Titre */}
        <div className="flex flex-col items-center space-y-3">
          <div className="h-16 w-16 rounded-full bg-[#F8A67E]/20 flex items-center justify-center shadow-inner">
            <img src="/logoexony.png" alt="Logo Exony" className="h-10 w-10" />
          </div>
          <h2 className="text-2xl font-bold text-[#F8A67E]">
            Réinitialisation du mot de passe
          </h2>
          <p className="text-sm text-gray-600">
            Recevez un lien de confirmation directement par email.
          </p>
        </div>

        {success ? (
          <div className="flex flex-col items-center space-y-3">
            <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
              <svg
                className="w-6 h-6 text-green-600"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <p className="text-green-600 font-medium">
              Vérifiez votre boîte email et cliquez sur le lien pour changer
              votre mot de passe.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2 text-left">
              <Label htmlFor="email" className="text-gray-700 font-medium">
                Adresse Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="exemple@mail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="focus:ring-2 focus:ring-[#F8A67E] focus:border-[#F8A67E] transition"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[#F8A67E] hover:bg-[#f79469] text-white font-semibold py-2 rounded-lg transition transform hover:scale-[1.02]"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="w-5 h-5 animate-spin"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8z"
                    ></path>
                  </svg>
                  Envoi...
                </span>
              ) : (
                "Envoyer le lien"
              )}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
