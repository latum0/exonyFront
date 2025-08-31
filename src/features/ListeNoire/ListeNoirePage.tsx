"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/redux-hooks";
import { Button } from "@/components/ui/button";
import { Ban, Loader2 } from "lucide-react";
import UserFormDialog from "@/components/clients/add-form";

import { DataTable } from "@/components/clients/data-table";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { deleteFromBlacklist, fetchBlacklist } from "@/hooks/black-list-hook";
import { getBlacklistColumns } from "@/components/clients/black-list-columns ";
import type { BlacklistClient } from "@/store/slices/blacklist-slice";

export const ListeNoirePage = () => {
  const dispatch = useAppDispatch();
  const { clients, loading } = useAppSelector(
    (state) => state.blacklistClients
  );

  const [isAddDialogOpen, setAddDialogOpen] = useState(false);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingClientId, setDeletingClientId] = useState<number | null>(null);

  useEffect(() => {
    dispatch(fetchBlacklist());
  }, [dispatch]);

  const handleDeleteClient = (id: number) => {
    setDeletingClientId(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteClient = async () => {
    if (deletingClientId === null) return;

    try {
      await dispatch(deleteFromBlacklist(deletingClientId)).unwrap();

      toast.success("Client supprimé avec succès !", {
        description: "Le client a été retiré de la liste.",
      });

      dispatch(fetchBlacklist());
    } catch (error) {
      console.error("Error deleting client:", error);
      toast.error("Erreur lors de la suppression du client", {
        description:
          "Veuillez réessayer. Si le problème persiste, contactez le support.",
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setDeletingClientId(null);
    }
  };

  const handleFormSuccess = () => {
    dispatch(fetchBlacklist());
  };

  const columns = getBlacklistColumns({
    onDelete: handleDeleteClient,
  }) as import("@tanstack/react-table").ColumnDef<BlacklistClient, unknown>[];

  return (
    <div className="py-6 px-2">
      <div className="flex justify-between items-center mb-4 ">
        <h2 className="text-2xl font-bold gap-x-2 flex items-center text-[#F8A67E]">
          <Ban size={28} /> Gestion de la liste noir
        </h2>

        <UserFormDialog
          open={isAddDialogOpen}
          onClose={() => setAddDialogOpen(false)}
          onSuccess={handleFormSuccess}
        />
      </div>
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="size-12 animate-spin text-[#F8A67E]" />
        </div>
      ) : (
        <DataTable columns={columns} data={clients} />
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer le retrait de la liste noire</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir retirer ce client de la liste noire ? Il
              pourra à nouveau accéder aux services.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Annuler
            </Button>
            <Button variant="destructive" onClick={confirmDeleteClient}>
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ListeNoirePage;
