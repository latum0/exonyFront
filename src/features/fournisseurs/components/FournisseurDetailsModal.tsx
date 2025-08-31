import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { Fournisseur } from "@/hooks/useFournisseurs";
import { Button } from "@/components/ui/button";
import { Building, MapPin, Phone, Mail, Calendar, User, Hash } from "lucide-react";

interface FournisseurDetailsModalProps {
  open: boolean;
  onClose: () => void;
  fournisseur: Fournisseur | null;
}

export const FournisseurDetailsModal: React.FC<FournisseurDetailsModalProps> = ({
  open,
  onClose,
  fournisseur,
}) => {
  if (!fournisseur) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Détails du fournisseur</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
          
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Building className="h-4 w-4" />
                <span>Nom</span>
              </div>
              <p className="text-base font-medium">{fournisseur.nom}</p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <MapPin className="h-4 w-4" />
              <span>Adresse</span>
            </div>
            <p className="text-base bg-gray-50 p-3 rounded-md">{fournisseur.adresse}</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <User className="h-4 w-4" />
              <span>Contact</span>
            </div>
            <p className="text-base">{fournisseur.contact}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Phone className="h-4 w-4" />
                <span>Téléphone</span>
              </div>
              <p className="text-base font-medium">{fournisseur.telephone}</p>
            </div>
           
          </div>
           <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Mail className="h-4 w-4" />
                <span>Email</span>
              </div>
              <p className="text-base font-medium">{fournisseur.email}</p>
            </div>

          {fournisseur.createdAt && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Calendar className="h-4 w-4" />
                <span>Date de création</span>
              </div>
              <p className="text-base">{formatDate(fournisseur.createdAt)}</p>
            </div>
          )}

          <div className="flex justify-end pt-4">
            <Button onClick={onClose}>Fermer</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};