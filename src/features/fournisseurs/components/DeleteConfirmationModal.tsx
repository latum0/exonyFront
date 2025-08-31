import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface DeleteConfirmationModalProps {
  open: boolean;
  onConfirm: () => Promise<void> | void;
  onCancel: () => void;
  itemName?: string;
  itemType?: string;
}

export const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  open,
  onConfirm,
  onCancel,
  itemName = "cet élément",
  itemType = "élément"
}) => {
  const [isDeleting, setIsDeleting] = React.useState(false);

  const handleConfirm = async () => {
    setIsDeleting(true);
    try {
      await onConfirm();
      toast.success("Suppression réussie", {
        description: `${itemName} a été supprimé avec succès.`
      });
    } catch (err: any) {
      // Extraction du message d'erreur
      const errorMessage =
        err?.data?.message ||
        err?.message ||
        `Une erreur est survenue lors de la suppression de ${itemType}.`;
      
      // Gestion spécifique des erreurs de conflit
      if (err?.status === 409) {
        toast.error("Erreur de conflit", {
          description: errorMessage,
        });
      } else {
        toast.error("Erreur de suppression", {
          description: errorMessage,
        });
      }
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) {
        onCancel();
      }
    }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmation de suppression</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p>Êtes-vous sûr de vouloir supprimer {itemName} ? Cette action est irréversible.</p>
          <div className="flex justify-end gap-2">
            <Button 
              variant="outline" 
              onClick={onCancel}
              disabled={isDeleting}
            >
              Annuler
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleConfirm}
              disabled={isDeleting}
            >
              {isDeleting ? "Suppression..." : "Confirmer"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};