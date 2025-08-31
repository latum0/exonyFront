import React, { useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { Fournisseur, FournisseurInput } from "@/hooks/useFournisseurs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

// Schéma de validation Zod avec règles spécifiques pour l'Algérie
const fournisseurSchema = z.object({
  nom: z.string()
    .min(1, "Le nom est requis")
    .max(100, "Le nom ne doit pas dépasser 100 caractères")
    .regex(/^[a-zA-ZÀ-ÿ0-9\s\-&.,']+$/, "Le nom contient des caractères invalides"),
  
  adresse: z.string()
    .min(1, "L'adresse est requise")
    .max(200, "L'adresse ne doit pas dépasser 200 caractères"),
  
  contact: z.string()
    .min(1, "Le contact est requis")
    .max(100, "Le contact ne doit pas dépasser 100 caractères")
    .regex(/^[a-zA-ZÀ-ÿ\s\-]+$/, "Le contact ne doit contenir que des lettres et espaces"),
  
  telephone: z.string()
    .min(1, "Le téléphone est requis")
    .regex(/^(\+213[5-7][0-9]{8}|0[5-7][0-9]{8})$/, 
      "Le numéro doit commencer par 0 ou +213 et être suivi de 9 chiffres valides (05, 06, ou 07)"),
  
  email: z.string()
    .min(1, "L'email est requis")
    .email("Format d'email invalide")
    .max(100, "L'email ne doit pas dépasser 100 caractères")
    .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Format d'email invalide"),
});

type FormValues = z.infer<typeof fournisseurSchema>;

interface FournisseurFormDialogProps {
  open: boolean;
  onClose: () => void;
  initialData?: Fournisseur | null;
  onSubmit: (data: FournisseurInput) => Promise<void>;
  isSubmitting?: boolean;
}

export const FournisseurFormDialog: React.FC<FournisseurFormDialogProps> = ({
  open,
  onClose,
  initialData,
  onSubmit,
  isSubmitting = false,
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(fournisseurSchema),
    defaultValues: {
      nom: "",
      adresse: "",
      contact: "",
      telephone: "",
      email: "",
    },
  });

  useEffect(() => {
    if (initialData) {
      setValue("nom", initialData.nom || "");
      setValue("adresse", initialData.adresse || "");
      setValue("contact", initialData.contact || "");
      setValue("telephone", initialData.telephone || "");
      setValue("email", initialData.email || "");
    } else {
      reset();
    }
  }, [initialData, setValue, reset, open]);

  const handleFormSubmit = async (data: FormValues) => {
    try {
      await onSubmit(data);
      
      // Succès
      toast.success(initialData ? "Fournisseur modifié avec succès !" : "Fournisseur créé avec succès !", {
        description: `Le fournisseur ${data.nom} a été ${initialData ? "mis à jour" : "ajouté"}.`,
      });
      
      onClose();
      reset();
    } catch (err: any) {
      // Extraction du message d'erreur
      const errorMessage =
        err?.data?.message ||
        err?.message ||
        "Une erreur inconnue est survenue.";
      
      // Gestion spécifique des erreurs de conflit
      if (err?.status === 409) {
        toast.error("Erreur de conflit", {
          description: errorMessage,
        });
      } else {
        toast.error(`Erreur lors de ${initialData ? "la modification" : "l'ajout"} du fournisseur`, {
          description: errorMessage,
        });
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) {
        onClose();
        reset();
      }
    }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-[#F8A67E]">
            {initialData ? "Modifier le fournisseur" : "Ajouter un fournisseur"}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nom" className="font-medium">Nom *</Label>
              <Input
                id="nom"
                {...register("nom")}
                placeholder="Ex: Société ABC SARL"
                className="w-full rounded-md border-gray-300 focus:ring-2 focus:ring-orange-300"
              />
              {errors.nom && (
                <p className="text-sm text-red-500 mt-1">{errors.nom.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact" className="font-medium">Contact *</Label>
              <Input
                id="contact"
                {...register("contact")}
                placeholder="Ex: Responsable Commercial"
                className="w-full rounded-md border-gray-300 focus:ring-2 focus:ring-orange-300"
              />
              {errors.contact && (
                <p className="text-sm text-red-500 mt-1">{errors.contact.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="adresse" className="font-medium">Adresse *</Label>
              <Input
                id="adresse"
                {...register("adresse")}
                placeholder="Ex: 123 Rue Principale, Alger"
                className="w-full rounded-md border-gray-300 focus:ring-2 focus:ring-orange-300"
              />
              {errors.adresse && (
                <p className="text-sm text-red-500 mt-1">{errors.adresse.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="telephone" className="font-medium">Téléphone *</Label>
              <Input
                id="telephone"
                {...register("telephone")}
                placeholder="Ex: 0550123456 ou +213550123456"
                className="w-full rounded-md border-gray-300 focus:ring-2 focus:ring-orange-300"
              />
              {errors.telephone && (
                <p className="text-sm text-red-500 mt-1">{errors.telephone.message}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Format: 0XX XXXXXXX ou +213XX XXXXXXX (05, 06, ou 07)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="font-medium">Email *</Label>
              <Input
                id="email"
                type="email"
                {...register("email")}
                placeholder="Ex: contact@societe.dz"
                className="w-full rounded-md border-gray-300 focus:ring-2 focus:ring-orange-300"
              />
              {errors.email && (
                <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button 
              variant="outline" 
              type="button"
              onClick={() => {
                onClose();
                reset();
              }}
              className="px-4 py-2"
              disabled={isSubmitting}
            >
              Annuler
            </Button>
            <Button 
              type="submit" 
              style={{ background: "#F8A67E" }}
              className="px-4 py-2 text-white hover:bg-orange-600"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Traitement..." : (initialData ? "Modifier" : "Créer")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};