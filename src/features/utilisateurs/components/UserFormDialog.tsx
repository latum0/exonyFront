import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAppDispatch } from "@/hooks/redux-hooks";
import { Check } from "lucide-react";
import { createUser } from "@/hooks/usersHooks";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { updatePermissions } from "@/hooks/usersHooks";
import { toast } from "sonner";

const PERMISSIONS = ["ADMIN", "AGENT_DE_STOCK", "CONFIRMATEUR", "SAV"] as const;

const schema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  email: z.string().email("Email invalide"),
  phone: z.string().min(1, "Téléphone requis"),
  password: z
    .string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères")
    .regex(/[A-Z]/, "Le mot de passe doit contenir au moins une majuscule")
    .regex(/[a-z]/, "Le mot de passe doit contenir au moins une minuscule")
    .regex(/[0-9]/, "Le mot de passe doit contenir au moins un chiffre")
    .regex(
      /[^A-Za-z0-9]/,
      "Le mot de passe doit contenir au moins un caractère spécial"
    )
    .optional()
    .or(z.literal("")),
  permissions: z
    .array(z.enum(PERMISSIONS))
    .nonempty("Sélectionnez au moins une permission"),
});

type FormValues = z.infer<typeof schema>;

type User = {
  id?: number;
  name: string;
  email: string;
  phone: string;
  permissions: string[];
};

type Props = {
  open: boolean;
  onClose: () => void;
  initialData?: User | null;
  onSuccess?: () => void;
};

const UserFormDialog = ({ open, onClose, initialData, onSuccess }: Props) => {
  const dispatch = useAppDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      permissions: [],
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name,
        email: initialData.email,
        phone: initialData.phone,
        password: "",
        permissions: initialData.permissions as FormValues["permissions"],
      });
    } else {
      reset();
    }
  }, [initialData, reset]);

  const permissions = watch("permissions");

  const togglePermission = (perm: (typeof PERMISSIONS)[number]) => {
    const current = permissions.includes(perm);
    const updated = current
      ? permissions.filter((p) => p !== perm)
      : [...permissions, perm];
    setValue("permissions", updated);
  };

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      if (initialData?.id) {
        await dispatch(
          updatePermissions({ id: initialData.id, permissions: data.permissions })
        ).unwrap();
        toast.success("Permissions mises à jour avec succès !", {
          description: `Les permissions de ${data.name} ont été modifiées.`,
        });
      } else {
        await dispatch(createUser(data)).unwrap();
        toast.success("Utilisateur créé avec succès !", {
          description: `L'utilisateur ${data.name} a été ajouté.`,
        });
      }
      onClose();
      onSuccess?.();
    } catch (err: any) {
      console.error("Erreur lors de la soumission:", err);
      
      // Extraction du message d'erreur
      const errorMessage =
        err?.payload?.message || // Pour les erreurs rejectWithValue de Redux
        err?.response?.data?.message ||
        err?.data?.message ||
        err?.message ||
        "Une erreur inconnue est survenue.";

      // Gestion spécifique des erreurs de conflit
      if (err?.payload?.status === 409 || err?.response?.status === 409 || err?.status === 409) {
        toast.error("Erreur de conflit", {
          description: errorMessage,
        });
      } else {
        toast.error(`Erreur lors de ${initialData ? "la modification" : "l'ajout"} de l'utilisateur`, {
          description: errorMessage,
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) {
        onClose();
      }
    }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Modifier l'utilisateur" : "Ajouter un utilisateur"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {initialData ? (
            // 🔧 Mode modification : n'afficher que les permissions
            <>
              <div>
                <Label className="block mb-2">Permissions</Label>
                <div className="flex flex-wrap gap-2">
                  {PERMISSIONS.map((perm) => {
                    const checked = permissions.includes(perm);
                    return (
                      <label
                        key={perm}
                        onClick={() => togglePermission(perm)}
                        className={`cursor-pointer px-3 py-2 rounded-full text-sm flex items-center gap-1
                border transition duration-200
                ${
                  checked
                    ? "bg-orange-100 border-orange-500 text-orange-700"
                    : "bg-[#F3F5F6] border-gray-300 text-gray-700 hover:bg-gray-200"
                }
              `}
                      >
                        {checked && (
                          <Check className="w-4 h-4 text-orange-600" />
                        )}
                        {perm}
                      </label>
                    );
                  })}
                </div>
                {errors.permissions && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.permissions.message}
                  </p>
                )}
              </div>
            </>
          ) : (
            // ➕ Mode création : tout le formulaire
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name" className="mb-1 block">
                    Nom
                  </Label>
                  <Input
                    {...register("name")}
                    placeholder="John Doe"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="email" className="mb-1 block">
                    Email
                  </Label>
                  <Input
                    type="email"
                    {...register("email")}
                    placeholder="john@example.com"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="phone" className="mb-1 block">
                    Téléphone
                  </Label>
                  <Input
                    {...register("phone")}
                    placeholder="+213..."
                    className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.phone.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="password" className="mb-1 block">
                    Mot de passe
                  </Label>
                  <Input
                    type="password"
                    {...register("password")}
                    placeholder="Aa@123456"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                  />
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.password.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <Label className="block mb-2">Permissions</Label>
                <div className="flex flex-wrap gap-2">
                  {PERMISSIONS.map((perm) => {
                    const checked = permissions.includes(perm);
                    return (
                      <label
                        key={perm}
                        onClick={() => togglePermission(perm)}
                        className={`cursor-pointer px-3 py-2 rounded-full text-sm flex items-center gap-1
                border transition duration-200
                ${
                  checked
                    ? "bg-orange-100 border-orange-500 text-orange-700"
                    : "bg-[#F3F5F6] border-gray-300 text-gray-700 hover:bg-gray-200"
                }
              `}
                      >
                        {checked && (
                          <Check className="w-4 h-4 text-orange-600" />
                        )}
                        {perm}
                      </label>
                    );
                  })}
                </div>
                {errors.permissions && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.permissions.message}
                  </p>
                )}
              </div>
            </>
          )}

          <div className="flex justify-end space-x-2">
            <Button 
              type="button" 
              variant="outline" 
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
              {isSubmitting ? "Traitement..." : (initialData ? "Mettre à jour" : "Créer")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UserFormDialog;