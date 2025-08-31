import React, { useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { Retour, RetourInput } from "@/hooks/useRetour";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

// Schéma de validation Zod
const retourSchema = z.object({
  dateRetour: z.string().min(1, "La date de retour est requise"),
  statutRetour: z.enum(["PENDING", "COMPLETED", "CANCELLED"], {
    required_error: "Le statut est requis",
  }),
  raisonRetour: z.string()
    .min(1, "La raison du retour est requise")
    .min(10, "La raison doit contenir au moins 10 caractères")
    .max(500, "La raison ne peut pas dépasser 500 caractères"),
  commandeId: z.string()
    .min(1, "L'ID de commande est requis")
    .regex(/^[a-zA-Z0-9-]+$/, "L'ID de commande doit être alphanumérique"),
});

type RetourFormData = z.infer<typeof retourSchema>;

interface RetourFormDialogProps {
  open: boolean;
  onClose: () => void;
  initialData?: Retour | null;
  onSubmit: (data: RetourInput) => Promise<void> | void;
}

export const RetourFormDialog: React.FC<RetourFormDialogProps> = ({
  open,
  onClose,
  initialData,
  onSubmit,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    reset,
  } = useForm<RetourFormData>({
    resolver: zodResolver(retourSchema),
    defaultValues: {
      dateRetour: new Date().toISOString().slice(0, 16),
      statutRetour: "PENDING",
      raisonRetour: "",
      commandeId: "",
    },
  });

  const formData = watch();

  useEffect(() => {
    if (initialData) {
      reset({
        dateRetour: initialData.dateRetour ? new Date(initialData.dateRetour).toISOString().slice(0, 16) : "",
        statutRetour: initialData.statutRetour as "PENDING" | "COMPLETED" | "CANCELLED",
        raisonRetour: initialData.raisonRetour || "",
        commandeId: initialData.commandeId || "",
      });
    } else {
      reset({
        dateRetour: new Date().toISOString().slice(0, 16),
        statutRetour: "PENDING",
        raisonRetour: "",
        commandeId: "",
      });
    }
  }, [initialData, open, reset]);

  const onFormSubmit = async (data: RetourFormData) => {
    try {
      // Convertir la date en format ISO complet
      const submitData: RetourInput = {
        ...data,
        dateRetour: new Date(data.dateRetour).toISOString(),
      };

      await onSubmit(submitData);
      toast.success(
        initialData ? "Retour modifié avec succès" : "Retour créé avec succès",
        {
          description: initialData 
            ? "Les modifications ont été enregistrées."
            : "Le retour a été créé avec succès.",
          duration: 3000,
        }
      );
      onClose();
    } catch (error) {
      toast.error(
        initialData ? "Erreur de modification" : "Erreur de création",
        {
          description: `Une erreur s'est produite lors de ${
            initialData ? "la modification" : "la création"
          } du retour.`,
          duration: 4000,
        }
      );
    }
  };

  const handleSelectChange = (name: keyof RetourFormData, value: string) => {
    setValue(name, value as any);
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) {
        onClose();
      }
    }}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Modifier le retour" : "Créer un retour"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dateRetour">Date de retour *</Label>
              <Input
                id="dateRetour"
                type="datetime-local"
                {...register("dateRetour")}
                className={errors.dateRetour ? "border-red-500" : ""}
              />
              {errors.dateRetour && (
                <p className="text-red-500 text-sm">{errors.dateRetour.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="statutRetour">Statut *</Label>
              <Select
                value={formData.statutRetour}
                onValueChange={(value) => handleSelectChange("statutRetour", value)}
              >
                <SelectTrigger className={errors.statutRetour ? "border-red-500" : ""}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PENDING">En attente</SelectItem>
                  <SelectItem value="COMPLETED">Complété</SelectItem>
                  <SelectItem value="CANCELLED">Annulé</SelectItem>
                </SelectContent>
              </Select>
              {errors.statutRetour && (
                <p className="text-red-500 text-sm">{errors.statutRetour.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="commandeId">ID de commande *</Label>
            <Input
              id="commandeId"
              {...register("commandeId")}
              placeholder="ID de la commande"
              className={errors.commandeId ? "border-red-500" : ""}
            />
            {errors.commandeId && (
              <p className="text-red-500 text-sm">{errors.commandeId.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="raisonRetour">Raison du retour *</Label>
            <textarea
              id="raisonRetour"
              {...register("raisonRetour")}
              rows={3}
              className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F8A67E] ${
                errors.raisonRetour ? "border-red-500" : ""
              }`}
              placeholder="Décrivez la raison du retour..."
            />
            {errors.raisonRetour && (
              <p className="text-red-500 text-sm">{errors.raisonRetour.message}</p>
            )}
            <p className="text-sm text-gray-500">
              {formData.raisonRetour.length}/500 caractères
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button 
              variant="outline" 
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Annuler
            </Button>
            <Button 
              type="submit" 
              style={{ background: "#F8A67E" }}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Traitement..." : (
                initialData ? "Enregistrer les modifications" : "Créer le retour"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};