
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircleIcon, CogIcon, PencilIcon, TrashIcon, Eye, Undo2 } from "lucide-react";
import { useRetour } from "@/hooks/useRetour";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RetourFormDialog } from "./components/RetourFormDialog";
import { DeleteConfirmationModal } from "./components/DeleteConfirmationModal";
import { RetourDetailsModal } from "./components/RetourDetailsModal";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const RetoursPage = () => {
  const {
    retours = [],
    retour,
    loading,
    error,
    getRetours,
    getRetour,
    createRetour,
    updateRetour,
    deleteRetour,
    filterRetours,
    resetRetour,
  } = useRetour();

  const [isDialogOpen, setDialogOpen] = useState(false);
  const [selectedRetour, setSelectedRetour] = useState<Retour | null>(null);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [retourToDelete, setRetourToDelete] = useState<Retour | null>(null);
  const [isViewDialogOpen, setViewDialogOpen] = useState(false);
  const [globalFilter, setGlobalFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5,
  });

  const filteredRetours = Array.isArray(retours) 
    ? retours.filter(r =>
        (r.raisonRetour?.toLowerCase().includes(globalFilter.toLowerCase()) ||
         r.commandeId?.toLowerCase().includes(globalFilter.toLowerCase()) ||
         r.statutRetour?.toLowerCase().includes(globalFilter.toLowerCase())) &&
        (statusFilter === "all" || r.statutRetour === statusFilter)
      )
    : [];

  const pageCount = Math.ceil(filteredRetours.length / pagination.pageSize);
  const paginatedRetours = filteredRetours.slice(
    pagination.pageIndex * pagination.pageSize,
    (pagination.pageIndex + 1) * pagination.pageSize
  );

  const handleGetRetours = async () => {
    try {
      await getRetours();
    } catch (error) {
      console.error("Erreur lors du chargement des retours:", error);
    }
  };

  useEffect(() => {
    handleGetRetours();
  }, []);

  const handleCreateRetour = async (data: RetourInput) => {
    await createRetour(data);
    setDialogOpen(false);
    handleGetRetours();
  };

  const handleUpdateRetour = async (data: RetourInput) => {
    if (selectedRetour) {
      await updateRetour(selectedRetour.idRetour, data);
      setDialogOpen(false);
      setSelectedRetour(null);
      handleGetRetours();
    }
  };

  const handleViewDetails = async (idRetour: number) => {
    try {
      await getRetour(idRetour);
      setViewDialogOpen(true);
    } catch (error) {
      console.error("Erreur lors de la récupération des détails:", error);
    }
  };

  const handleDeleteClick = (retour: Retour) => {
    setRetourToDelete(retour);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (retourToDelete) {
      await deleteRetour(retourToDelete.idRetour);
      setDeleteDialogOpen(false);
      setRetourToDelete(null);
      handleGetRetours();
    }
  };

  const handleEdit = (retour: Retour) => {
    setSelectedRetour({
      idRetour: retour.idRetour,
      dateRetour: retour.dateRetour,
      statutRetour: retour.statutRetour,
      raisonRetour: retour.raisonRetour,
      commandeId: retour.commandeId
    });
    setDialogOpen(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold gap-x-2 flex items-center text-[#F8A67E]">
          <Undo2 size={28} /> Gestion des retours
        </h2>
        <Button
          onClick={() => {
            setSelectedRetour(null);
            setDialogOpen(true);
          }}
          style={{ background: "#F8A67E", borderRadius: "8px" }}
        >
          <PlusCircleIcon className="w-4 h-4 mr-[3px]" />
          Ajouter
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
            placeholder="Rechercher par raison, commande ou statut..."
            value={globalFilter}
            onChange={(e) => {
              setGlobalFilter(e.target.value);
              setPagination(prev => ({ ...prev, pageIndex: 0 }));
            }}
            className="max-w-sm border-gray-300 rounded-md shadow-sm bg-neutral-50"
          />
          <Select
            value={statusFilter}
            onValueChange={(value) => {
              setStatusFilter(value);
              setPagination(prev => ({ ...prev, pageIndex: 0 }));
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrer par statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              <SelectItem value="PENDING">En attente</SelectItem>
              <SelectItem value="COMPLETED">Complété</SelectItem>
              <SelectItem value="CANCELLED">Annulé</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="rounded-lg border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <Table className="min-w-full">
              <TableHeader className="bg-gray-100">
                <TableRow>
                  <TableHead className="text-gray-700 font-semibold py-3 px-4 whitespace-nowrap">
                    Date retour
                  </TableHead>
                  <TableHead className="text-gray-700 font-semibold py-3 px-4 whitespace-nowrap">
                    Statut
                  </TableHead>
                  <TableHead className="text-gray-700 font-semibold py-3 px-4 whitespace-nowrap">
                    Raison
                  </TableHead>
                  <TableHead className="text-gray-700 font-semibold py-3 px-4 whitespace-nowrap">
                    Commande ID
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
                ) : paginatedRetours.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="h-24 text-center text-gray-500"
                    >
                      {globalFilter || statusFilter !== "all" ? "Aucun résultat trouvé" : "Aucun retour enregistré"}
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedRetours.map((r, index) => (
                    <TableRow
                      key={r.idRetour}
                      className={index % 2 === 0 ? "bg-white hover:bg-gray-50" : "bg-gray-50 hover:bg-gray-100"}
                    >
                      <TableCell className="py-3 px-4 whitespace-nowrap">
                        {formatDate(r.dateRetour)}
                      </TableCell>
                      <TableCell className="py-3 px-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          r.statutRetour === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                          r.statutRetour === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {r.statutRetour}
                        </span>
                      </TableCell>
                      <TableCell className="py-3 px-4 whitespace-nowrap">
                        {r.raisonRetour}
                      </TableCell>
                      <TableCell className="py-3 px-4 whitespace-nowrap">
                        {r.commandeId}
                      </TableCell>
                      <TableCell className="py-3 px-4 whitespace-nowrap">
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-[#F8A67E] border-[#F8A67E] hover:bg-[#F8A67E]/10"
                            onClick={() => handleEdit(r)}
                          >
                            <PencilIcon className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-[#F8A67E] border-[#F8A67E] hover:bg-[#F8A67E]/10"
                            onClick={() => handleViewDetails(r.idRetour)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-500 border-red-500 hover:bg-red-500/10"
                            onClick={() => handleDeleteClick(r)}
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
            {filteredRetours.length} retour(s) trouvé(s)
          </div>
          <div className="flex items-center space-x-6 lg:space-x-8">
            <div className="flex items-center space-x-1">
              <p className="text-sm font-medium">Lignes par page</p>
              <Select
                value={`${pagination.pageSize}`}
                onValueChange={(value) => {
                  setPagination(prev => ({
                    ...prev,
                    pageSize: Number(value),
                    pageIndex: 0
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
                onClick={() => setPagination(prev => ({
                  ...prev,
                  pageIndex: Math.max(prev.pageIndex - 1, 0)
                }))}
                disabled={pagination.pageIndex === 0}
              >
                <span className="sr-only">Aller à la page précédente</span>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="size-8 bg-transparent hover:bg-gray-100"
                onClick={() => setPagination(prev => ({
                  ...prev,
                  pageIndex: Math.min(prev.pageIndex + 1, pageCount - 1)
                }))}
                disabled={pagination.pageIndex >= pageCount - 1}
              >
                <span className="sr-only">Aller à la page suivante</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <RetourFormDialog
        open={isDialogOpen}
        onClose={() => {
          setDialogOpen(false);
          setSelectedRetour(null);
        }}
        initialData={selectedRetour}
        onSubmit={selectedRetour ? handleUpdateRetour : handleCreateRetour}
      />

      <DeleteConfirmationModal
        open={isDeleteDialogOpen}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteDialogOpen(false)}
        itemName={retourToDelete ? `le retour #${retourToDelete.idRetour}` : "ce retour"}
      />

      <RetourDetailsModal
        open={isViewDialogOpen}
        onClose={() => {
          setViewDialogOpen(false);
          resetRetour();
        }}
        retour={retour}
      />
    </div>
  );
};

export default RetoursPage;