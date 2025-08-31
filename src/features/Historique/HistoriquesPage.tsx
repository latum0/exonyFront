import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { HistoryIcon, TrashIcon, Eye, Filter, RotateCcw } from "lucide-react";
import { useHistorique, type Historique } from "@/hooks/useHistorique";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DeleteConfirmationModal } from "./components/DeleteConfirmationModal";
import { HistoriqueDetailsModal } from "./components/HistoriqueDetailsModal";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const HistoriquesPage = () => {
  const {
    historiques = [],
    historique,
    loading,
    error,
    getHistoriques,
    getHistorique,
    deleteHistorique,
    deleteOldHistoriques,
    resetHistorique,
  } = useHistorique();

  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [historiqueToDelete, setHistoriqueToDelete] =
    useState<Historique | null>(null);
  const [isViewDialogOpen, setViewDialogOpen] = useState(false);
  const [globalFilter, setGlobalFilter] = useState("");
  const [filters, setFilters] = useState({
    acteur: "",
    descriptionAction: "",
    dateFrom: "",
    dateTo: "",
  });
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const filteredHistoriques = Array.isArray(historiques)
    ? historiques.filter(
        (h) =>
          h.utilisateur?.name
            ?.toLowerCase()
            .includes(globalFilter.toLowerCase()) ||
          h.descriptionAction
            ?.toLowerCase()
            .includes(globalFilter.toLowerCase())
      )
    : [];

  const pageCount = Math.ceil(filteredHistoriques.length / pagination.pageSize);
  const paginatedHistoriques = filteredHistoriques.slice(
    pagination.pageIndex * pagination.pageSize,
    (pagination.pageIndex + 1) * pagination.pageSize
  );

  const handleGetHistoriques = async () => {
    try {
      await getHistoriques({
        page: pagination.pageIndex + 1,
        perPage: pagination.pageSize,
        ...filters,
      });
    } catch (error) {
      console.error("Erreur lors du chargement des historiques:", error);
    }
  };

  useEffect(() => {
    handleGetHistoriques();
  }, [filters, pagination.pageIndex, pagination.pageSize]);

  const handleViewDetails = async (idHistorique: number) => {
    try {
      await getHistorique(idHistorique);
      setViewDialogOpen(true);
    } catch (error) {
      console.error("Erreur lors de la récupération des détails:", error);
    }
  };

  const handleDeleteClick = (historique: Historique) => {
    setHistoriqueToDelete(historique);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (historiqueToDelete) {
      await deleteHistorique(historiqueToDelete.idHistorique);
      setDeleteDialogOpen(false);
      setHistoriqueToDelete(null);
      handleGetHistoriques();
    }
  };

  const handleCleanOld = async () => {
    const deletedCount = await deleteOldHistoriques();
    if (deletedCount !== undefined) {
      alert(`${deletedCount} ancien(s) historique(s) supprimé(s)`);
      handleGetHistoriques();
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const applyFilters = () => {
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    handleGetHistoriques();
  };

  const clearFilters = () => {
    setFilters({
      acteur: "",
      descriptionAction: "",
      dateFrom: "",
      dateTo: "",
    });
    setGlobalFilter("");
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold gap-x-2 flex items-center text-[#F8A67E]">
          <HistoryIcon size={28} /> Historique des activités
        </h2>
        <Button
          onClick={handleCleanOld}
          variant="outline"
          className="text-red-500 hover:text-red-600 border-red-500 hover:bg-red-500/10"
        >
          <TrashIcon className="w-4 h-4 mr-2" />
          Nettoyer les anciens
        </Button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Filtres avancés */}
      <div className="bg-gray-50 p-4 rounded-lg mb-4 border">
        <h3 className="font-semibold mb-3 text-gray-700">Filtres avancés</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Acteur
            </label>
            <Input
              placeholder="Filtrer par acteur"
              value={filters.acteur}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, acteur: e.target.value }))
              }
              className="border-gray-300  bg-white/50"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Description
            </label>
            <Input
              placeholder="Filtrer par description"
              value={filters.descriptionAction}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  descriptionAction: e.target.value,
                }))
              }
              className="border-gray-300 bg-white/50"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Date début
            </label>
            <Input
              type="date"
              value={filters.dateFrom}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, dateFrom: e.target.value }))
              }
              className="border-gray-300 bg-white/50"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Date fin
            </label>
            <Input
              type="date"
              value={filters.dateTo}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, dateTo: e.target.value }))
              }
              className="border-gray-300 bg-white/50"
            />
          </div>
        </div>
        <div className="flex gap-2 mt-3">
          <Button
            onClick={applyFilters}
            className="bg-[#F8A67E] hover:bg-[#F8A67E]/90"
          >
            <Filter className="w-4 h-4 mr-2" />
            Appliquer les filtres
          </Button>
          <Button variant="outline" onClick={clearFilters}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Réinitialiser
          </Button>
        </div>
      </div>

      <div className="w-full">
        <div className="flex items-center py-4 gap-2">
          {/* <Input
            placeholder="Rechercher par acteur ou description..."
            value={globalFilter}
            onChange={(e) => {
              setGlobalFilter(e.target.value);
              setPagination((prev) => ({ ...prev, pageIndex: 0 }));
            }}
            className="max-w-sm border-gray-300 rounded-md shadow-sm bg-neutral-50"
          /> */}
        </div>

        <div className="rounded-lg border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <Table className="min-w-full">
              <TableHeader className="bg-gray-100">
                <TableRow>
                  <TableHead className="text-gray-700 font-semibold py-3 px-4 whitespace-nowrap">
                    Date
                  </TableHead>
                  <TableHead className="text-gray-700 font-semibold py-3 px-4 whitespace-nowrap">
                    Acteur
                  </TableHead>
                  <TableHead className="text-gray-700 font-semibold py-3 px-4 whitespace-nowrap">
                    Description
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
                ) : paginatedHistoriques.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="h-24 text-center text-gray-500"
                    >
                      {globalFilter || Object.values(filters).some((f) => f)
                        ? "Aucun résultat trouvé"
                        : "Aucun historique enregistré"}
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedHistoriques.map((h, index) => (
                    <TableRow
                      key={h.idHistorique}
                      className={
                        index % 2 === 0
                          ? "bg-white hover:bg-gray-50"
                          : "bg-gray-50 hover:bg-gray-100"
                      }
                    >
                      <TableCell className="py-3 px-4 whitespace-nowrap">
                        {formatDate(h.dateModification)}
                      </TableCell>
                      <TableCell className="py-3 px-4 whitespace-nowrap">
                        {h.utilisateur?.name}
                      </TableCell>
                      <TableCell className="py-3 px-4">
                        <div
                          className="max-w-md truncate"
                          title={h.descriptionAction}
                        >
                          {h.descriptionAction}
                        </div>
                      </TableCell>

                      <TableCell className="py-3 px-4 whitespace-nowrap">
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-[#2c97f5]  hover:text-[#2c97f5]"
                            onClick={() => handleViewDetails(h.idHistorique)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-500  hover:text-red-500"
                            onClick={() => handleDeleteClick(h)}
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
            {filteredHistoriques.length} historique(s) trouvé(s)
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

      <DeleteConfirmationModal
        open={isDeleteDialogOpen}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteDialogOpen(false)}
        itemName={
          historiqueToDelete
            ? `l'historique #${historiqueToDelete.idHistorique}`
            : "cet historique"
        }
      />

      <HistoriqueDetailsModal
        open={isViewDialogOpen}
        onClose={() => {
          setViewDialogOpen(false);
          resetHistorique();
        }}
        historique={historique}
      />
    </div>
  );
};

export default HistoriquesPage;
