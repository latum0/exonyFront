/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";

import { useAppDispatch, useAppSelector } from "@/hooks/redux-hooks";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Package, PlusCircleIcon, Loader2, Filter, X } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { fetchProduits, deleteProduit } from "@/hooks/produits-hook";
import { getProduitColumns, type Produit } from "@/components/produits/columns";
import { DataTable } from "@/components/produits/data-table";
import { useNavigate } from "react-router-dom";

export default function ProduitsPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { produits, loading, pagination } = useAppSelector(
    (state) => state.produits
  );

  // Filters state
  const [filters, setFilters] = useState({
    nom: "",
    marque: "",
    categorie: "",
  });
  const [appliedFilters, setAppliedFilters] = useState({
    nom: "",
    marque: "",
    categorie: "",
  });

  // Dialog states
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingProductId, setDeletingProductId] = useState<string | null>(
    null
  );

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(
      fetchProduits({
        page: currentPage,
        limit: 10,
        ...appliedFilters,
      })
    );
  }, [dispatch, currentPage, appliedFilters]);

  const handleView = (produit: Produit) => {
    navigate(`/produits/${produit.idProduit}`);
  };

  const handleEdit = (produit: Produit) => {
    navigate(`/produits/${produit.idProduit}/modifier`);
  };

  const handleDelete = (id: string) => {
    setDeletingProductId(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (deletingProductId === null) return;

    try {
      await dispatch(deleteProduit(deletingProductId)).unwrap();
      toast.success("Produit supprimé avec succès !");
      // dispatch(
      //   fetchProduits({
      //     page: currentPage,
      //     limit: 10,
      //     ...appliedFilters,
      //   })
      // );
    } catch (error: any) {
      toast.error("Erreur lors de la suppression du produit", {
        description: error.message || "Une erreur inconnue est survenue.",
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setDeletingProductId(null);
    }
  };

  const applyFilters = () => {
    setAppliedFilters(filters);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({ nom: "", marque: "", categorie: "" });
    setAppliedFilters({ nom: "", marque: "", categorie: "" });
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const columns = getProduitColumns({
    onView: handleView,
    onEdit: handleEdit,
    onDelete: handleDelete,
  });

  return (
    <div className="min-h-screen  py-6 px-4">
      <div className="max-w-7xl mx-auto ">
        {/* Header Card */}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Package className="w-8 h-8 text-[#F8A67E]" />
            <h2 className="text-[27px] font-bold gap-x-2 flex items-center text-[#F8A67E]">
              Gestion des produits
            </h2>
          </div>
          <Button
            className="bg-[#F8A67E] hover:bg-[#F8A67E]/90  "
            onClick={() => navigate("/produits/ajouter")}
          >
            <PlusCircleIcon className="w-5 h-5 mr-0.5" />
            Ajouter un produit
          </Button>
        </div>

        {/* Filters Card */}
        <Card className="bg-[#fbfbfb] mt-5">
          <CardContent className="">
            <div className="flex flex-col gap-y-1.5">
              <div className="w-full flex items-start justify-between">
                <h2 className="font-semibold w-fit text-xl text-nowrap text-gray-700">
                  Filtres avancés
                </h2>
                <div className="flex items-end justify-end gap-2 w-full">
                  <Button
                    onClick={applyFilters}
                    className="bg-[#F8A67E] hover:bg-[#F8A67E]/90 h-10"
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    Appliquer les filtres
                  </Button>
                  <Button
                    onClick={clearFilters}
                    variant="outline"
                    className=" h-10 bg-none hover:bg-gray-100"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Effacer les filtres
                  </Button>
                </div>
              </div>
              <div className="flex items-center gap-4 flex-1 mt-2">
                <Input
                  placeholder="Rechercher par nom..."
                  value={filters.nom}
                  onChange={(e) =>
                    setFilters({ ...filters, nom: e.target.value })
                  }
                  className="max-w-xs  h-11 bg-white/50"
                />
                <Input
                  placeholder="Rechercher par marque..."
                  value={filters.marque}
                  onChange={(e) =>
                    setFilters({ ...filters, marque: e.target.value })
                  }
                  className="max-w-xs h-11 bg-white/50"
                />
                <Input
                  placeholder="Rechercher par catégorie..."
                  value={filters.categorie}
                  onChange={(e) =>
                    setFilters({ ...filters, categorie: e.target.value })
                  }
                  className="max-w-xs bg-white/50 h-11"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Table Card */}
        <Card className="border-none shadow-none px-0">
          <CardContent className="">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-[#F8A67E]" />
              </div>
            ) : (
              <DataTable
                columns={columns}
                data={produits}
                pagination={pagination}
                onPageChange={handlePageChange}
              />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer ce produit ? Cette action est
              irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Annuler
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
