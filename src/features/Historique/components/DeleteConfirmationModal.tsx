import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner"; // ou import toast from "react-hot-toast";

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
    onConfirm();
    toast.success("Suppression réussie", {
      description: `${itemName} a été supprimé avec succès.`,
      duration: 3000,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onCancel}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmation de suppression</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p>Êtes-vous sûr de vouloir supprimer {itemName} ? Cette action est irréversible.</p>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onCancel}>
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