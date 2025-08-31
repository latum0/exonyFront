"use client";

import { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Edit2Icon, Plus, PlusCircle, X } from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClient, updateClient } from "@/hooks/clients-hook";
import { useAppDispatch } from "@/hooks/redux-hooks";
import { toast } from "sonner";

export const ClientStatut = z.enum(["ACTIVE", "BLACKLISTED"]);

const clientSchema = z.object({
  nom: z.string().min(1, "Le nom est requis"),
  prenom: z.string().min(1, "Le prénom est requis"),
  adresse: z.string().min(1, "L'adresse est requise"),
  email: z.string().email("Email invalide"),
  numeroTelephone: z
    .string()
    .regex(
      /^\+213[5-7][0-9]{8}$/,
      "Le numéro doit être au format algérien : +213XXXXXXXXX"
    ),
  commentaires: z
    .array(
      z.object({
        contenu: z.string().optional(),
      })
    )
    .optional(),
  statut: ClientStatut,
});

type FormValues = z.infer<typeof clientSchema>;

type User = {
  idClient?: number;
  nom: string;
  prenom: string;
  adresse: string;
  email: string;
  numeroTelephone: string;
  commentaires?: {
    contenu: string;
  }[];
  statut: z.infer<typeof ClientStatut>;
};

type Props = {
  open: boolean;
  onClose: () => void;
  initialData?: User | null;
  onSuccess?: () => void;
};

export interface ClientFormValues {
  nom: string;
  prenom: string;
  adresse: string;
  email: string;
  numeroTelephone: string;
  commentaires?: {
    contenu: string;
  }[];
  statut: "ACTIVE" | "BLACKLISTED";
}

const UserFormDialog = ({ open, onClose, initialData, onSuccess }: Props) => {
  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      nom: "",
      prenom: "",
      email: "",
      numeroTelephone: "",
      adresse: "",
      commentaires: [{ contenu: "" }],
      statut: "ACTIVE",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "commentaires",
  });

  useEffect(() => {
    if (initialData) {
      reset({
        nom: initialData.nom,
        prenom: initialData.prenom,
        adresse: initialData.adresse,
        email: initialData.email,
        numeroTelephone: initialData.numeroTelephone,
        statut: initialData.statut,
        commentaires:
          initialData.commentaires && initialData.commentaires.length > 0
            ? initialData.commentaires
            : [{ contenu: "" }],
      });
    } else {
      reset({
        nom: "",
        prenom: "",
        email: "",
        numeroTelephone: "",
        adresse: "",
        commentaires: [{ contenu: "" }],
        statut: "ACTIVE",
      });
    }
  }, [initialData, reset]);

  const onSubmit = async (data: FormValues) => {
    const payload = {
      ...data,
      statut: data.statut,
      commentaires: data.commentaires
        ? data.commentaires.map((c) => ({
          contenu: c.contenu ?? "",
        }))
        : undefined,
    };

    try {
      if (initialData?.idClient) {
        const result = await dispatch(
          updateClient({ id: initialData.idClient, data: payload })
        ).unwrap();

        // Type-safe access to result properties
        if (result && typeof result === 'object') {

          toast.success("Client modifié avec succès !", {
            description: `Le client ${payload.nom} ${payload.prenom} a été mis à jour.`,
          });
        }
      } else {
        const result = await dispatch(createClient(payload)).unwrap();

        // Type-safe access to result properties
        if (result && typeof result === 'object') {

          toast.success("Client créé avec succès !", {
            description: `Le client ${payload.nom} ${payload.prenom} a été ajouté.`,
          });
        }
      }
      onClose();
      onSuccess?.();
    } catch (err: unknown) {
      // Proper error typing
      let errorMessage = "Une erreur inconnue est survenue.";
      let errorStatus: number | undefined;

      if (err && typeof err === 'object') {
        const error = err as any; // Type assertion for error handling
        errorMessage = error?.data?.message || error?.message || errorMessage;
        errorStatus = error?.status;
      }

      if (errorStatus === 409) {
        toast.error("Erreur de conflit", {
          description: errorMessage,
        });
      } else {
        toast.error("Erreur lors de la soumission du client", {
          description: errorMessage,
        });
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] p-6">
        <DialogHeader>
          <DialogTitle className="text-center w-full">
            {initialData ? (
              <span className="flex items-center ">
                <Edit2Icon className="inline-block mr-1.5" /> Modifier le client
              </span>
            ) : (
              <span className="flex items-center j">
                <PlusCircle className="inline-block mr-1.5" /> Ajouter un client
              </span>
            )}
          </DialogTitle>
        </DialogHeader>
        <SelectSeparator className="my-2 mt-1" />
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nom">Nom</Label>
              <Input
                id="nom"
                {...register("nom")}
                placeholder="Dupont"
                className="focus-visible:ring-orange-300 h-10"
              />
              {errors.nom && (
                <p className="text-sm text-red-500">{errors.nom.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="prenom">Prénom</Label>
              <Input
                id="prenom"
                {...register("prenom")}
                placeholder="Jean"
                className="focus-visible:ring-orange-300 h-10"
              />
              {errors.prenom && (
                <p className="text-sm text-red-500">{errors.prenom.message}</p>
              )}
            </div>
            <div className="space-y-2 col-span-full">
              <Label htmlFor="adresse">Adresse</Label>
              <Input
                id="adresse"
                {...register("adresse")}
                placeholder="123 Rue Exemple, Alger"
                className="focus-visible:ring-orange-300 h-10"
              />
              {errors.adresse && (
                <p className="text-sm text-red-500">{errors.adresse.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...register("email")}
                placeholder="jean.dupont@example.com"
                className="focus-visible:ring-orange-300 h-10"
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="numeroTelephone">Téléphone</Label>
              <Input
                id="numeroTelephone"
                {...register("numeroTelephone")}
                placeholder="+213612345678"
                className="focus-visible:ring-orange-300 h-10"
              />
              {errors.numeroTelephone && (
                <p className="text-sm text-red-500">
                  {errors.numeroTelephone.message}
                </p>
              )}
            </div>
          </div>
          {initialData && (
            <div className="space-y-2">
              <Label htmlFor="statut">Statut</Label>
              <Select
                onValueChange={(value) =>
                  setValue("statut", value as z.infer<typeof ClientStatut>)
                }
                value={watch("statut")}
              >
                <SelectTrigger className="w-full focus-visible:ring-orange-300">
                  <SelectValue placeholder="Sélectionner un statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVE">Actif</SelectItem>
                  <SelectItem value="BLACKLISTED">Blacklisté</SelectItem>
                </SelectContent>
              </Select>
              {errors.statut && (
                <p className="text-sm text-red-500">{errors.statut.message}</p>
              )}
            </div>
          )}
          <div className="space-y-2">
            <div className="w-full flex justify-between items-center">
              <Label>Commentaires</Label>
              <Button
                type="button"
                variant="outline"
                onClick={() => append({ contenu: "" })}
                className="w-fit text-orange-600 border-orange-300 hover:bg-orange-50 hover:text-[#F8A67E] rounded-md"
              >
                <Plus className="mr-2 h-4 w-4" />
                Ajouter un commentaire
              </Button>
            </div>
            {fields.map((field, index) => (
              <div key={field.id} className="flex items-center gap-2">
                <Textarea
                  {...register(`commentaires.${index}.contenu`)}
                  placeholder={`Commentaire ${index + 1}`}
                  className="flex-1 min-h-[60px] focus-visible:ring-orange-300"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => remove(index)}
                  className="text-red-500 hover:text-red-700"
                  aria-label={`Supprimer le commentaire ${index + 1}`}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            {errors.commentaires && (
              <p className="text-sm text-red-500">
                {errors.commentaires?.message}
              </p>
            )}
          </div>
          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant={"ghost"}
              onClick={onClose}
              style={{ background: "#F5F5F5", borderRadius: "8px" }}
              className="text-gray-600 bg-neutral-100"
            >
              Annuler
            </Button>
            <Button
              type="submit"
              className="bg-[#F8A67E] hover:bg-orange-600"
              style={{ background: "#F8A67E", borderRadius: "8px" }}
            >
              {initialData ? "Mettre à jour" : "Créer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UserFormDialog;