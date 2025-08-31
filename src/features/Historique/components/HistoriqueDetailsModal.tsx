import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Historique } from "@/hooks/useHistorique";
import { Button } from "@/components/ui/button";
import { Calendar, User, FileText } from "lucide-react";

interface HistoriqueDetailsModalProps {
  open: boolean;
  onClose: () => void;
  historique: Historique | null;
}

export const HistoriqueDetailsModal: React.FC<HistoriqueDetailsModalProps> = ({
  open,
  onClose,
  historique,
}) => {
  if (!historique) return null;
  console.log(historique);
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Détails de l'historique</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          {/* <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Calendar className="h-4 w-4" />
                <span>ID Historique</span>
              </div>
              <p className="text-base font-medium">{historique.idHistorique}</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <User className="h-4 w-4" />
                <span>Utilisateur ID</span>
              </div>
              <p className="text-base font-medium">{historique.utilisateurId}</p>
            </div>
          </div> */}

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Calendar className="h-4 w-4" />
              <span>Date de modification</span>
            </div>
            <p className="text-base">
              {formatDate(historique.dateModification)}
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <User className="h-4 w-4" />
              <span>Acteur</span>
            </div>
            <p className="text-base font-medium">
              {historique?.utilisateur?.name}
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <FileText className="h-4 w-4" />
              <span>Description de l'action</span>
            </div>
            <p className="text-base bg-gray-50 p-3 rounded-md whitespace-pre-wrap">
              {historique.descriptionAction}
            </p>
          </div>

          {historique.createdAt && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Calendar className="h-4 w-4" />
                <span>Date de création</span>
              </div>
              <p className="text-base">{formatDate(historique.createdAt)}</p>
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
