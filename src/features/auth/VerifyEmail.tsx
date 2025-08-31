
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle, XCircle, MailCheck } from "lucide-react";
import useVerifyEmail from "@/hooks/useVerifyEmail";
import type { JSX } from "react/jsx-runtime";

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const verificationToken = searchParams.get("token");
  const { status, message, verifyEmail } = useVerifyEmail();
  const [isTokenPresent, setIsTokenPresent] = useState<boolean>(false);

  useEffect(() => {
    if (verificationToken) {
      setIsTokenPresent(true);
      verifyEmail(verificationToken);
    }
  }, [verificationToken, verifyEmail]);

  const handleResendEmail = (): void => {
    // Fonctionnalité pour renvoyer l'email de vérification
    console.log("Renvoyer l'email de vérification");
  };

  const getStatusIcon = (): JSX.Element => {
    switch (status) {
      case 'loading':
        return <Loader2 className="h-12 w-12 animate-spin text-[#F8A67E]" />;
      case 'success':
        return <CheckCircle className="h-12 w-12 text-green-500" />;
      case 'error':
        return <XCircle className="h-12 w-12 text-red-500" />;
      default:
        return <MailCheck className="h-12 w-12 text-gray-400" />;
    }
  };

  const getStatusMessage = (): string => {
    if (!isTokenPresent) {
      return "Aucun token de vérification trouvé";
    }
    return message;
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center text-gray-800">
            Vérification d'email
          </CardTitle>
          <CardDescription className="text-center text-gray-600">
            {isTokenPresent
              ? "Nous vérifions votre adresse email"
              : "Lien de vérification manquant"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-center">
            {getStatusIcon()}
          </div>

          <div className={`text-center text-sm font-medium rounded-lg py-3 px-4 ${status === 'loading' ? 'bg-blue-50 text-blue-700' :
              status === 'success' ? 'bg-green-50 text-green-700' :
                status === 'error' ? 'bg-red-50 text-red-700' :
                  'bg-gray-50 text-gray-700'
            }`}>
            {getStatusMessage()}
          </div>

          {status === 'success' && (
            <Button
              className="w-full bg-[#F8A67E] hover:bg-[#f79469] text-white font-semibold"
              onClick={() => window.location.href = '/'}
            >
              Se connecter
            </Button>
          )}

          {status === 'error' && (
            <div className="space-y-3">
              <Button
                className="w-full bg-[#F8A67E] hover:bg-[#f79469] text-white font-semibold"
                onClick={handleResendEmail}
              >
                Renvoyer l'email de vérification
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => window.location.href = '/login'}
              >
                Retour à la connexion
              </Button>
            </div>
          )}

          {!isTokenPresent && (
            <Button
              variant="outline"
              className="w-full"
              onClick={() => window.location.href = '/login'}
            >
              Retour à la connexion
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}