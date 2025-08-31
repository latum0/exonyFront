/* eslint-disable @typescript-eslint/ban-ts-comment */
"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAppDispatch, useAppSelector } from "@/hooks/redux-hooks";
import {
  updateProduit,
  fetchProduit,
  type EditProduitFormValues,
  fetchFournisseurs,
} from "@/hooks/produits-hook";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MultiSelect } from "@/components/ui/multi-select";
import {
  ArrowLeft,
  Upload,
  X,
  Package,
  DollarSign,
  ImageIcon,
  Users,
  Loader2,
} from "lucide-react";
import { z } from "zod";
import { useNavigate, useParams } from "react-router-dom";
import type { Fournisseur } from "../../ajouter/page";
import { API_BASE_URL } from "@/constants/config";

export const editProduitSchema = z.object({
  nom: z
    .string()
    .min(1, "Le nom est requis")
    .max(100, "Le nom ne peut pas dépasser 100 caractères"),
  description: z
    .string()
    .min(1, "La description est requise")
    .max(500, "La description ne peut pas dépasser 500 caractères"),
  prix: z.number().min(0.01, "Le prix doit être supérieur à 0"),
  stock: z.number().int().min(0, "Le stock ne peut pas être négatif"),
  remise: z
    .number()
    .min(0, "La remise ne peut pas être négative")
    .max(100, "La remise ne peut pas dépasser 100%"),
  marque: z
    .string()
    .min(1, "La marque est requise")
    .max(50, "La marque ne peut pas dépasser 50 caractères"),
  categorie: z
    .string()
    .min(1, "La catégorie est requise")
    .max(50, "La catégorie ne peut pas dépasser 50 caractères"),
  images: z.array(z.instanceof(File)),
  keepImages: z.array(z.string()),
  fournisseurs: z
    .array(z.number().int().positive())
    .min(1, "Au moins un fournisseur est requis"),
});

export type EditProduitFormData = z.infer<typeof editProduitSchema>;

export default function ModifierProduitPage() {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [keptImages, setKeptImages] = useState<string[]>([]);

  const { fournisseurs } = useAppSelector((state) => state.produits);
  const { produit, loading } = useAppSelector((state) => state.produits);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<EditProduitFormData>({
    resolver: zodResolver(editProduitSchema),
    defaultValues: {
      images: [],
      keepImages: [],
      fournisseurs: [],
    },
  });

  useEffect(() => {
    if (id) {
      dispatch(fetchProduit(id));
    }

    dispatch(fetchFournisseurs());
  }, [dispatch, id]);

  useEffect(() => {
    if (produit && produit.idProduit) {
      reset({
        nom: produit.nom || "",
        description: produit.description || "",
        prix: produit.prix || 0,
        stock: produit.stock || 0,
        remise: produit.remise || 0,
        marque: produit.marque || "",
        categorie: produit.categorie || "",
        images: [],
        keepImages: produit.images || [],
        fournisseurs:
          Array.isArray(produit.fournisseurs)
            ? produit.fournisseurs.map((f: Fournisseur) => f.idFournisseur)
            : produit.fournisseurs
              ? [produit.fournisseurs.idFournisseur]
              : [],
      });

      setKeptImages(produit.images || []);
    }
  }, [produit, reset]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newImages = [...selectedImages, ...files];
    setSelectedImages(newImages);
    setValue("images", newImages);
  };

  const removeNewImage = (index: number) => {
    const newImages = selectedImages.filter((_, i) => i !== index);
    setSelectedImages(newImages);
    setValue("images", newImages);
  };

  const removeKeptImage = (imageName: string) => {
    const newKeptImages = keptImages.filter((img) => img !== imageName);
    setKeptImages(newKeptImages);
    setValue("keepImages", newKeptImages);
  };

  const selectedFournisseurs = watch("fournisseurs");

  const fournisseurOptions = fournisseurs?.map((f) => ({
    label: f.nom,
    value: String(f.idFournisseur),
  }));

  const handleFournisseursChange = (selected: string[]) => {
    setValue(
      "fournisseurs",
      selected.map((id) => Number.parseInt(id))
    );
  };

  const onSubmit = async (data: EditProduitFormData) => {
    if (!id) return;

    setIsSubmitting(true);
    try {
      const submitData: EditProduitFormValues = {
        ...data,
        keepImages: keptImages,
      };

      await dispatch(updateProduit({ id, data: submitData })).unwrap();
      toast.success("Produit modifié avec succès!");
      navigate(`/produits/${id}`);
    } catch (error) {
      toast.error("Erreur lors de la modification du produit", {
        //@ts-expect-error
        description: error.message || "Une erreur inconnue est survenue.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading && !produit?.idProduit) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-[#F8A67E]" />
          <p className="text-slate-600">Chargement du produit...</p>
        </div>
      </div>
    );
  }

  if (!loading && !produit?.idProduit) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <Package className="w-16 h-16 mx-auto mb-4 text-slate-400" />
          <h2 className="text-xl font-semibold text-slate-700 mb-2">
            Produit non trouvé
          </h2>
          <p className="text-slate-500 mb-4">
            Le produit que vous cherchez n'existe pas.
          </p>
          <Button onClick={() => navigate("/produits")} variant="outline">
            Retour aux produits
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen  py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="mb-6 text-slate-600 hover:text-slate-800 border-slate-200 hover:bg-white/80"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>
          <div className="  border border-white/20 ">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Modifier le produit
            </h1>
            <p className="text-slate-600">
              Modifiez les informations de votre produit
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Informations générales - takes 2 columns on xl screens */}
            <div className="xl:col-span-2">
              <Card className="  bg-neutral-50 backdrop-blur-sm border-white/20 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl text-[#F8A67E] flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    Informations générales
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label
                        htmlFor="nom"
                        className="text-slate-700 font-medium"
                      >
                        Nom du produit *
                      </Label>
                      <Input
                        id="nom"
                        {...register("nom")}
                        placeholder="Ex: Nike Air Max"
                        className={
                          errors.nom
                            ? "border-red-400 h-11 bg-white/80 focus:bg-white"
                            : "h-11 bg-white/80 focus:bg-white border-slate-200"
                        }
                      />
                      {errors.nom && (
                        <p className="text-sm text-red-500">
                          {errors.nom.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="marque"
                        className="text-slate-700 font-medium"
                      >
                        Marque *
                      </Label>
                      <Input
                        id="marque"
                        {...register("marque")}
                        placeholder="Ex: Nike"
                        className={
                          errors.marque
                            ? "border-red-400 h-11 bg-white/80 focus:bg-white"
                            : "h-11 bg-white/80 focus:bg-white border-slate-200"
                        }
                      />
                      {errors.marque && (
                        <p className="text-sm text-red-500">
                          {errors.marque.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="description"
                      className="text-slate-700 font-medium"
                    >
                      Description *
                    </Label>
                    <Textarea
                      id="description"
                      {...register("description")}
                      placeholder="Décrivez votre produit..."
                      rows={4}
                      className={
                        errors.description
                          ? "border-red-400 bg-white/80 focus:bg-white resize-none"
                          : "bg-white/80 focus:bg-white border-slate-200 resize-none"
                      }
                    />
                    {errors.description && (
                      <p className="text-sm text-red-500">
                        {errors.description.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="categorie"
                      className="text-slate-700 font-medium"
                    >
                      Catégorie *
                    </Label>
                    <Input
                      id="categorie"
                      {...register("categorie")}
                      placeholder="Ex: Chaussures"
                      className={
                        errors.categorie
                          ? "border-red-400 bg-white/80 focus:bg-white h-11"
                          : "bg-white/80 focus:bg-white h-11 border-slate-200"
                      }
                    />
                    {errors.categorie && (
                      <p className="text-sm text-red-500">
                        {errors.categorie.message}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="xl:col-span-1">
              <Card className="  bg-neutral-50 backdrop-blur-sm border-white/20 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl text-[#F8A67E] flex items-center gap-2">
                    <ImageIcon className="w-5 h-5" />
                    Images
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {keptImages.length > 0 && (
                    <div>
                      <Label className="text-sm text-slate-600 mb-2 block">
                        Images actuelles
                      </Label>
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        {keptImages.map((imageName, index) => (
                          <div key={index} className="relative group">
                            <div className="aspect-square rounded-lg overflow-hidden bg-slate-100 border border-slate-200">
                              <img
                                src={`${API_BASE_URL}/uploads/produits/${imageName}`}
                                alt={`Image ${index + 1}`}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                              />
                            </div>
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              className="absolute -top-2 -right-2 w-7 h-7 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                              onClick={() => removeKeptImage(imageName)}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center bg-slate-50/50 hover:bg-slate-50/80 transition-colors">
                    <div className="w-16 h-16 mx-auto mb-4 bg-[#F8A67E]/10 rounded-full flex items-center justify-center">
                      <Upload className="w-8 h-8 text-[#F8A67E]" />
                    </div>
                    <Label
                      htmlFor="images"
                      className="cursor-pointer flex flex-col"
                    >
                      <span className="text-[#F8A67E] hover:text-[#F8A67E]/80 font-medium">
                        Ajouter de nouvelles images
                      </span>
                      <br />
                      <span className="text-slate-500 text-sm">
                        ou glissez-déposez vos images
                      </span>
                    </Label>
                    <Input
                      id="images"
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </div>

                  {selectedImages.length > 0 && (
                    <div>
                      <Label className="text-sm text-slate-600 mb-2 block">
                        Nouvelles images
                      </Label>
                      <div className="grid grid-cols-2 gap-3">
                        {selectedImages.map((file, index) => (
                          <div key={index} className="relative group">
                            <div className="aspect-square rounded-lg overflow-hidden bg-slate-100 border border-slate-200">
                              <img
                                src={
                                  URL.createObjectURL(file) ||
                                  "/placeholder.svg"
                                }
                                alt={`Preview ${index + 1}`}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                              />
                            </div>
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              className="absolute -top-2 -right-2 w-7 h-7 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                              onClick={() => removeNewImage(index)}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {errors.images && (
                    <p className="text-sm text-red-500">
                      {errors.images.message}
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Prix et stock */}
          <Card className="  bg-neutral-50 backdrop-blur-sm border-white/20 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl text-[#F8A67E] flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Prix et stock
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="prix" className="text-slate-700 font-medium">
                    Prix (€) *
                  </Label>
                  <Input
                    id="prix"
                    type="number"
                    step="0.01"
                    {...register("prix", { valueAsNumber: true })}
                    placeholder="120.50"
                    className={
                      errors.prix
                        ? "border-red-400 bg-white/80 focus:bg-white h-11"
                        : "bg-white/80 focus:bg-white h-11 border-slate-200"
                    }
                  />
                  {errors.prix && (
                    <p className="text-sm text-red-500">
                      {errors.prix.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="stock" className="text-slate-700 font-medium">
                    Stock *
                  </Label>
                  <Input
                    id="stock"
                    type="number"
                    {...register("stock", { valueAsNumber: true })}
                    placeholder="50"
                    className={
                      errors.stock
                        ? "border-red-400 bg-white/80 focus:bg-white h-11"
                        : "bg-white/80 focus:bg-white h-11 border-slate-200"
                    }
                  />
                  {errors.stock && (
                    <p className="text-sm text-red-500">
                      {errors.stock.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="remise"
                    className="text-slate-700 font-medium"
                  >
                    Remise (%) *
                  </Label>
                  <Input
                    id="remise"
                    type="number"
                    {...register("remise", { valueAsNumber: true })}
                    placeholder="10"
                    className={
                      errors.remise
                        ? "border-red-400 bg-white/80 focus:bg-white h-11"
                        : "bg-white/80 focus:bg-white h-11 border-slate-200"
                    }
                  />
                  {errors.remise && (
                    <p className="text-sm text-red-500">
                      {errors.remise.message}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="  bg-neutral-50 backdrop-blur-sm border-white/20 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl text-[#F8A67E] flex items-center gap-2">
                <Users className="w-5 h-5" />
                Fournisseurs *
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label className="text-slate-700 font-medium">
                  Sélectionnez les fournisseurs
                </Label>
                <MultiSelect
                  options={fournisseurOptions}
                  selected={selectedFournisseurs.map(String)}
                  onChange={handleFournisseursChange}
                  placeholder="Choisissez un ou plusieurs fournisseurs"
                  className="border-slate-200"
                />
                {errors.fournisseurs && (
                  <p className="text-sm text-red-500">
                    {errors.fournisseurs.message}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(-1)}
              disabled={isSubmitting}
              className="border-slate-200 text-slate-600 hover:bg-white/80"
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#F8A67E] hover:bg-[#F8A67E]/90 text-white shadow-lg hover:shadow-xl transition-all"
            >
              {isSubmitting ? "Modification..." : "Modifier le produit"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
