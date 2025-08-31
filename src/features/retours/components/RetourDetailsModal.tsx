
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { Retour } from "@/hooks/useRetour";
import { Button } from "@/components/ui/button";

interface RetourDetailsModalProps {
  open: boolean;
  onClose: () => void;
  retour: Retour | null;
}

export const RetourDetailsModal: React.FC<RetourDetailsModalProps> = ({
  open,
  onClose,
  retour,
}) => {
  if (!retour) return null;

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
          <DialogTitle>Détails du retour</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium text-sm text-gray-500">ID:</h3>
              <p className="text-base">{retour.idRetour}</p>
            </div>
            <div>
              <h3 className="font-medium text-sm text-gray-500">Statut:</h3>
              <p className="text-base">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  retour.statutRetour === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                  retour.statutRetour === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {retour.statutRetour}
                </span>
              </p>
            </div>
          </div>

          <div>
            <h3 className="font-medium text-sm text-gray-500">Date de retour:</h3>
            <p className="text-base">{formatDate(retour.dateRetour)}</p>
          </div>

          <div>
            <h3 className="font-medium text-sm text-gray-500">ID de commande:</h3>
            <p className="text-base">{retour.commandeId}</p>
          </div>

          <div>
            <h3 className="font-medium text-sm text-gray-500">Raison du retour:</h3>
            <p className="text-base whitespace-pre-wrap">{retour.raisonRetour}</p>
          </div>

          {retour.createdAt && (
            <div>
              <h3 className="font-medium text-sm text-gray-500">Date de création:</h3>
              <p className="text-base">{formatDate(retour.createdAt)}</p>
            </div>
          )}

          {retour.updatedAt && retour.updatedAt !== retour.createdAt && (
            <div>
              <h3 className="font-medium text-sm text-gray-500">Dernière modification:</h3>
              <p className="text-base">{formatDate(retour.updatedAt)}</p>
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