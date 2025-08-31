import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner"; // AJOUT: Import de toast

interface DeleteConfirmationModalProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  itemName?: string;
}

export const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  open,
  onConfirm,
  onCancel,
  itemName = "cet élément",
}) => {
  
  const handleConfirm = () => {
    try {
      onConfirm();
      toast.success("Suppression réussie", { // AJOUT: Toast de succès
        description: `${itemName} a été supprimé avec succès`,
      });
    } catch (error) {
      toast.error("Erreur de suppression", { // AJOUT: Toast d'erreur
        description: `Une erreur est survenue lors de la suppression de ${itemName}`,
      });
    }
  };

  const handleCancel = () => {
    onCancel();
    toast.info("Annulation", { // AJOUT: Toast d'information
      description: "Suppression annulée",
    });
  };

  return (
    <Dialog open={open} onOpenChange={handleCancel}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmation de suppression</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p>Êtes-vous sûr de vouloir supprimer {itemName} ? Cette action est irréversible.</p>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleCancel}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={handleConfirm}>
              Confirmer
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};