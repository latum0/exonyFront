import { Routes, Route } from "react-router-dom";
import LoginPage from "@/features/auth/LoginPage";
import RegisterPage from "@/features/auth/RegisterPage";
import ForgotPasswordPage from "@/features/auth/ForgotPasswordPage";
import DashboardLayout from "@/layout/DashboardLayout";
import DashboardPage from "@/features/dashboard/DashboardPage";
import FournisseursPage from "@/features/fournisseurs/FournisseursPage";
import UtilisateursPage from "@/features/utilisateurs/UtilisateursPage";
import CommandesPage from "@/features/Commandes/CommandesPage";
import ListeNoirePage from "@/features/ListeNoire/ListeNoirePage";
import PrivateRoute from "@/components/PrivateRoute";
import Clients from "@/features/Clients/client";
import Produits from "@/features/Produits/produits";
import ResetPasswordPage from "@/features/auth/ResetPasswordPage";

import RetoursPage from "@/features/retours/RetoursPage";
import HistoriquesPage from "@/features/Historique/HistoriquesPage";

import AjouterProduitPage from "@/features/Produits/ajouter/page";
import ProduitDetailPage from "@/features/Produits/[id]/detailsPage";
import ModifierProduitPage from "@/features/Produits/[id]/modifier/editPage";
import VerifyEmail from "@/features/auth/VerifyEmail";


export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
<Route path="/verify-email" element={<VerifyEmail />} />
      <Route element={<PrivateRoute />}>
        <Route path="/" element={<DashboardLayout />}>
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="fournisseurs" element={<FournisseursPage />} />
          <Route path="utilisateurs" element={<UtilisateursPage />} />
          <Route path="commandes" element={<CommandesPage />} />
          <Route path="liste-noire" element={<ListeNoirePage />} />
          <Route path="client" element={<Clients />} />

           <Route path="Retours" element={<RetoursPage />} />
        <Route path="historique" element={<HistoriquesPage />} />


          <Route path="produits" element={<Produits />} />
          <Route path="/produits/ajouter" element={<AjouterProduitPage />} />
          <Route path="/produits/:id" element={<ProduitDetailPage />} />

          <Route
            path="/produits/:id/modifier"
            element={<ModifierProduitPage />}
          />

        </Route>
      </Route>
    </Routes>
  );
}
