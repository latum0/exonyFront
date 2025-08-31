"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/redux-hooks";
import { Button } from "@/components/ui/button";
import { CogIcon, Loader2, PlusCircleIcon } from "lucide-react";
import UserFormDialog from "@/components/clients/add-form";
import {
  addToBlacklist,
  deleteClient,
  fetchClients,
} from "@/hooks/clients-hook";
import { DataTable } from "@/components/clients/data-table";
import { getClientColumns, type Client } from "@/components/clients/columns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

export const UsersPage = () => {
  const dispatch = useAppDispatch();
  const { clients, loading } = useAppSelector((state) => state.clients);

  const [isAddDialogOpen, setAddDialogOpen] = useState(false);

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingClientId, setDeletingClientId] = useState<number | null>(null);

  const [isBlacklistDialogOpen, setIsBlacklistDialogOpen] = useState(false);
  const [blacklistingClientId, setBlacklistingClientId] = useState<
    number | null
  >(null);

  useEffect(() => {
    dispatch(fetchClients());
  }, [dispatch]);

  const handleEditClient = (client: Client) => {
    setEditingClient(client);
    setIsEditDialogOpen(true);
  };

  const handleDeleteClient = (id: number) => {
    setDeletingClientId(id);
    setIsDeleteDialogOpen(true);
  };

  const handleBlacklistClient = (id: number) => {
    setBlacklistingClientId(id);
    setIsBlacklistDialogOpen(true);
  };

  const confirmDeleteClient = async () => {
    if (deletingClientId === null) return;

    try {
      await dispatch(deleteClient(deletingClientId)).unwrap();

      toast.success("Client supprimé avec succès !", {
        description: "Le client a été retiré de la liste.",
      });

      dispatch(fetchClients());
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

  const confirmBlacklistClient = async () => {
    if (blacklistingClientId === null) return;

    try {
      await dispatch(addToBlacklist(blacklistingClientId)).unwrap();

      toast.success("Client ajouté à la blacklist !", {
        description: "Le statut du client a été mis à jour.",
      });

      dispatch(fetchClients());
    } catch (error) {
      console.error("Error blacklisting client:", error);
      toast.error("Erreur lors de l'ajout à la blacklist", {
        description:
          "Veuillez réessayer. Si le problème persiste, contactez le support.",
      });
    } finally {
      setIsBlacklistDialogOpen(false);
      setBlacklistingClientId(null);
    }
  };

  const handleFormSuccess = () => {
    dispatch(fetchClients());
  };

  const columns = getClientColumns({
    onEdit: handleEditClient,
    onDelete: handleDeleteClient,
    onBlacklist: handleBlacklistClient,
  });

  return (
    <div className="py-6 px-2">
      <div className="flex justify-between items-center mb-4 ">
        <h2 className="text-[27px] font-bold gap-x-2 flex items-center text-[#F8A67E]">
          <CogIcon size={28} /> Gestion des Clients
        </h2>
        <Button
          onClick={() => setAddDialogOpen(true)}
          style={{ background: "#F8A67E", borderRadius: "8px" }}
          className=" "
        >
          <PlusCircleIcon className="w-4 h-4 mr-0.5" />
          Ajouter un client
        </Button>
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

      {/* Edit Client Dialog (now using UserFormDialog) */}
      <UserFormDialog
        open={isEditDialogOpen}
        onClose={() => {
          setIsEditDialogOpen(false);
          setEditingClient(null); // Clear editing client when dialog closes
        }}
        initialData={editingClient}
        onSuccess={handleFormSuccess}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer ce client ? Cette action est
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
            <Button variant="destructive" onClick={confirmDeleteClient}>
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Blacklist Confirmation Dialog */}
      <Dialog
        open={isBlacklistDialogOpen}
        onOpenChange={setIsBlacklistDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer l'ajout à la blacklist</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir ajouter ce client à la blacklist ? Son
              statut passera à "BLACKLISTED".
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsBlacklistDialogOpen(false)}
            >
              Annuler
            </Button>
            <Button
              variant="default"
              onClick={confirmBlacklistClient}
              style={{ background: "#F8A67E" }}
            >
              Confirmer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UsersPage;
