// src/pages/commandes/components/CommandeDetailsModal.tsx
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, User, CreditCard, Package, Hash } from "lucide-react";

interface CommandeDetailsModalProps {
  open: boolean;
  onClose: () => void;
  commande: CommandeResponseDto | null;
}

export const CommandeDetailsModal: React.FC<CommandeDetailsModalProps> = ({
  open,
  onClose,
  commande,
}) => {
  if (!commande) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatutLabel = (statut: string) => {
    switch (statut) {
      case "EN_ATTENTE": return "En attente";
      case "EN_COURS": return "En cours";
      case "LIVREE": return "Livrée";
      case "ANNULEE": return "Annulée";
      default: return statut;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Détails de la commande</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Hash className="h-4 w-4" />
                <span>ID Commande</span>
              </div>
              <p className="text-base font-mono">{commande.idCommande}</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Calendar className="h-4 w-4" />
                <span>Date de commande</span>
              </div>
              <p className="text-base">{formatDate(commande.dateCommande)}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Package className="h-4 w-4" />
                <span>Statut</span>
              </div>
              <p className="text-base">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  commande.statut === "EN_ATTENTE" ? "bg-yellow-100 text-yellow-800" :
                  commande.statut === "EN_COURS" ? "bg-blue-100 text-blue-800" :
                  commande.statut === "LIVREE" ? "bg-green-100 text-green-800" :
                  "bg-red-100 text-red-800"
                }`}>
                  {getStatutLabel(commande.statut)}
                </span>
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <User className="h-4 w-4" />
                <span>Client ID</span>
              </div>
              <p className="text-base font-medium">{commande.clientId}</p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <MapPin className="h-4 w-4" />
              <span>Adresse de livraison</span>
            </div>
            <p className="text-base bg-gray-50 p-3 rounded-md">{commande.adresseLivraison}</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <CreditCard className="h-4 w-4" />
              <span>Montant total</span>
            </div>
            <p className="text-2xl font-bold text-green-600">
              {parseFloat(commande.montantTotal).toFixed(2)} €
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold">Lignes de commande</h4>
            {commande.ligne.map((ligne) => (
              <div key={ligne.idLigne} className="bg-gray-50 p-3 rounded-md">
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Produit:</span> {ligne.produitId}
                  </div>
                  <div>
                    <span className="font-medium">Quantité:</span> {ligne.quantite}
                  </div>
                  <div>
                    <span className="font-medium">Prix unitaire:</span> {parseFloat(ligne.prixUnitaire).toFixed(2)} €
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-4">
            <Button onClick={onClose}>Fermer</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};