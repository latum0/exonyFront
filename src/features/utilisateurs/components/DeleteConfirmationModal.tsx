// components/DeleteConfirmationModal.tsx
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onConfirm: () => Promise<void> | void;
  onCancel: () => void;
  userName?: string;
  userType?: string;
}

const DeleteConfirmationModal: React.FC<Props> = ({ 
  open, 
  onConfirm, 
  onCancel, 
  userName, 
  userType = "utilisateur" 
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirm = async () => {
    setIsDeleting(true);
    try {
      await onConfirm();
      toast.success("Suppression réussie", {
        description: `L'${userType} ${userName} a été supprimé avec succès.`
      });
    } catch (err: any) {
      // Extraction du message d'erreur
      const errorMessage =
        err?.response?.data?.message ||
        err?.data?.message ||
        err?.message ||
        `Une erreur est survenue lors de la suppression de l'${userType}.`;
      
      // Gestion spécifique des erreurs de conflit
      if (err?.response?.status === 409 || err?.status === 409) {
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
          <DialogDescription>
            Êtes-vous sûr de vouloir supprimer l'utilisateur <strong>{userName}</strong> ? Cette action est irréversible.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex justify-end gap-2">
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
            style={{ background: "#F8A67E" }}
            disabled={isDeleting}
          >
            {isDeleting ? "Suppression..." : "Supprimer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteConfirmationModal;