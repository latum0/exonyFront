import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  PlusCircleIcon,
  CogIcon,
  PencilIcon,
  TrashIcon,
  Eye,
  FactoryIcon,
} from "lucide-react";
import { useFournisseurs } from "@/hooks/useFournisseurs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FournisseurFormDialog } from "./components/FournisseurFormDialog";
import { DeleteConfirmationModal } from "./components/DeleteConfirmationModal";
import { FournisseurDetailsModal } from "./components/FournisseurDetailsModal";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const FournisseursPage = () => {
  const {
    fournisseurs = [],
    fournisseur,
    loading,
    error,
    getFournisseurs,
    getFournisseur,
    createFournisseur,
    updateFournisseur,
    deleteFournisseur,
    resetFournisseur,
  } = useFournisseurs();

  const [isDialogOpen, setDialogOpen] = useState(false);
  const [selectedFournisseur, setSelectedFournisseur] =
    useState<Fournisseur | null>(null);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [fournisseurToDelete, setFournisseurToDelete] =
    useState<Fournisseur | null>(null);
  const [isViewDialogOpen, setViewDialogOpen] = useState(false);
  const [globalFilter, setGlobalFilter] = useState("");
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5,
  });

  const filteredFournisseurs = Array.isArray(fournisseurs)
    ? fournisseurs.filter(
        (f) =>
          f.nom?.toLowerCase().includes(globalFilter.toLowerCase()) ||
          f.contact?.toLowerCase().includes(globalFilter.toLowerCase()) ||
          f.email?.toLowerCase().includes(globalFilter.toLowerCase()) ||
          f.telephone?.includes(globalFilter)
      )
    : [];

  const pageCount = Math.ceil(
    filteredFournisseurs.length / pagination.pageSize
  );
  const paginatedFournisseurs = filteredFournisseurs.slice(
    pagination.pageIndex * pagination.pageSize,
    (pagination.pageIndex + 1) * pagination.pageSize
  );
  const handleGetFournisseurs = async () => {
    try {
      await getFournisseurs();
    } catch (error) {
      setDataError(true);
    }
  };

  useEffect(() => {
    handleGetFournisseurs();
  }, []);
  const handleCreateFournisseur = async (data: FournisseurInput) => {
    await createFournisseur(data);
    setDialogOpen(false);
    getFournisseurs();
  };

  const handleUpdateFournisseur = async (data: FournisseurInput) => {
    if (selectedFournisseur) {
      await updateFournisseur(
        selectedFournisseur.idFournisseur.toString(),
        data
      );
      setDialogOpen(false);
      setSelectedFournisseur(null);
      getFournisseurs();
    }
  };

  const handleViewDetails = async (idFournisseur: number) => {
    // Changé de string à number
    try {
      await getFournisseur(idFournisseur.toString()); // Convertir en string pour l'URL
      setViewDialogOpen(true);
    } catch (error) {
      console.error("Erreur lors de la récupération des détails:", error);
    }
  };

  const handleDeleteClick = (fournisseur: Fournisseur) => {
    setFournisseurToDelete(fournisseur);
    setDeleteDialogOpen(true);
  };

 const confirmDelete = async () => {
  if (fournisseurToDelete) {
    await deleteFournisseur(fournisseurToDelete.idFournisseur); // ← Utiliser idFournisseur
    setDeleteDialogOpen(false);
    setFournisseurToDelete(null);
    getFournisseurs();
  }
};

  const handleEdit = (fournisseur: Fournisseur) => {
    setSelectedFournisseur({
      idFournisseur: fournisseur.idFournisseur,
      nom: fournisseur.nom,
      adresse: fournisseur.adresse,
      contact: fournisseur.contact,
      telephone: fournisseur.telephone,
      email: fournisseur.email,
    });
    setDialogOpen(true);
  };
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-[27px]  font-bold gap-x-2 flex items-center text-[#F8A67E]">
          <FactoryIcon size={28} /> Gestion des fournisseurs
        </h2>
        <Button
          onClick={() => {
            setSelectedFournisseur(null);
            setDialogOpen(true);
          }}
          style={{ background: "#F8A67E", borderRadius: "8px" }}
          className="h-9"
        >
          <PlusCircleIcon className="w-4 h-4 mr-[3px]" />
          Ajouter un fournisseur
        </Button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="w-full">
        <div className="flex items-center py-4 gap-2">
          <Input
            placeholder="Rechercher ..."
            value={globalFilter}
            onChange={(e) => {
              setGlobalFilter(e.target.value);
              setPagination((prev) => ({ ...prev, pageIndex: 0 }));
            }}
            className="max-w-sm border-gray-300 rounded-md shadow-sm bg-neutral-50"
          />
        </div>

        <div className="rounded-lg border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <Table className="min-w-full">
              <TableHeader className="bg-gray-100">
                <TableRow>
                  <TableHead className="text-gray-700 font-semibold py-3 px-4 whitespace-nowrap">
                    Nom
                  </TableHead>
                  <TableHead className="text-gray-700 font-semibold py-3 px-4 whitespace-nowrap">
                    Contact
                  </TableHead>
                  <TableHead className="text-gray-700 font-semibold py-3 px-4 whitespace-nowrap">
                    Téléphone
                  </TableHead>
                  <TableHead className="text-gray-700 font-semibold py-3 px-4 whitespace-nowrap">
                    Email
                  </TableHead>
                  <TableHead className="text-gray-700 font-semibold py-3 px-4 whitespace-nowrap">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center py-10 text-lg text-gray-400 italic"
                    >
                      Chargement...
                    </TableCell>
                  </TableRow>
                ) : paginatedFournisseurs.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="h-24 text-center text-gray-500"
                    >
                      {globalFilter
                        ? "Aucun résultat trouvé"
                        : "Aucun fournisseur enregistré"}
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedFournisseurs.map((f, index) => (
                    <TableRow
                      key={f.id}
                      className={
                        index % 2 === 0
                          ? "bg-white hover:bg-gray-50"
                          : "bg-gray-50 hover:bg-gray-100"
                      }
                    >
                      <TableCell className="py-3 px-4 whitespace-nowrap">
                        {f.nom}
                      </TableCell>
                      <TableCell className="py-3 px-4 whitespace-nowrap">
                        {f.contact}
                      </TableCell>
                      <TableCell className="py-3 px-4 whitespace-nowrap">
                        {f.telephone}
                      </TableCell>
                      <TableCell className="py-3 px-4 whitespace-nowrap">
                        {f.email}
                      </TableCell>
                      <TableCell className="py-3 px-4 whitespace-nowrap">
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-green-600 hover:text-green-600/90 "
                            onClick={() => handleEdit(f)}
                          >
                            <PencilIcon className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-[#2c97f5]  hover:text-[#2c97f5]"
                            onClick={() => handleViewDetails(f.idFournisseur)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-500  hover:text-red-500"
                            onClick={() => handleDeleteClick(f)}
                          >
                            <TrashIcon className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        <div className="flex items-center justify-between px-2 py-4">
          <div className="flex-1 text-sm text-muted-foreground">
            {filteredFournisseurs.length} fournisseur(s) trouvé(s)
          </div>
          <div className="flex items-center space-x-6 lg:space-x-8">
            <div className="flex items-center space-x-1">
              <p className="text-sm font-medium">Lignes par page</p>
              <Select
                value={`${pagination.pageSize}`}
                onValueChange={(value) => {
                  setPagination((prev) => ({
                    ...prev,
                    pageSize: Number(value),
                    pageIndex: 0,
                  }));
                }}
              >
                <SelectTrigger className="h-8 w-fit">
                  <SelectValue className="text-sm mr-1" />
                </SelectTrigger>
                <SelectContent side="top">
                  {[5, 10, 20, 25, 30, 40, 50].map((pageSize) => (
                    <SelectItem key={pageSize} value={`${pageSize}`}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex w-[100px] items-center justify-center text-sm font-medium">
              Page {pagination.pageIndex + 1} sur {pageCount}
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                className="size-8 bg-transparent hover:bg-gray-100"
                onClick={() =>
                  setPagination((prev) => ({
                    ...prev,
                    pageIndex: Math.max(prev.pageIndex - 1, 0),
                  }))
                }
                disabled={pagination.pageIndex === 0}
              >
                <span className="sr-only">Aller à la page précédente</span>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="size-8 bg-transparent hover:bg-gray-100"
                onClick={() =>
                  setPagination((prev) => ({
                    ...prev,
                    pageIndex: Math.min(prev.pageIndex + 1, pageCount - 1),
                  }))
                }
                disabled={pagination.pageIndex >= pageCount - 1}
              >
                <span className="sr-only">Aller à la page suivante</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <FournisseurFormDialog
        open={isDialogOpen}
        onClose={() => {
          setDialogOpen(false);
          setSelectedFournisseur(null);
        }}
        initialData={selectedFournisseur}
        onSubmit={
          selectedFournisseur
            ? handleUpdateFournisseur
            : handleCreateFournisseur
        }
      />

      <DeleteConfirmationModal
        open={isDeleteDialogOpen}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteDialogOpen(false)}
        itemName={fournisseurToDelete?.nom || "ce fournisseur"}
      />

      <FournisseurDetailsModal
        open={isViewDialogOpen}
        onClose={() => {
          setViewDialogOpen(false);
          resetFournisseur();
        }}
        fournisseur={fournisseur}
      />
    </div>
  );
};

export default FournisseursPage;
