import { PencilIcon, TrashIcon, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppDispatch } from "@/hooks/redux-hooks";
import { deleteUser } from "@/hooks/usersHooks";
import UserFormDialog from "./UserFormDialog";
import UserDetailsModal from "./UserDetailsModal";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import { getUserById } from "@/hooks/usersHooks";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  permissions: string[];
}

interface UserTableProps {
  users: User[];
  loading: boolean;
}

export const UserTable: React.FC<UserTableProps> = ({ users, loading }) => {
  const dispatch = useAppDispatch();
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [isViewDialogOpen, setViewDialogOpen] = useState(false);
  const [detailedUser, setDetailedUser] = useState<User | null>(null);
  const [globalFilter, setGlobalFilter] = useState("");
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5,
  });

 const filteredUsers = users.filter(user => {
  try {
    // Validation des données
    if (!user || typeof user !== 'object') return false;
    
    const name = user.name ? String(user.name) : "";
    const email = user.email ? String(user.email) : "";
    const phone = user.phone ? String(user.phone) : "";
    const permissions = Array.isArray(user.permissions) ? user.permissions : [];
    
    const searchTerm = globalFilter.toLowerCase();
    
    return (
      name.toLowerCase().includes(searchTerm) ||
      email.toLowerCase().includes(searchTerm) ||
      phone.includes(globalFilter) ||
      permissions.join(", ").toLowerCase().includes(searchTerm)
    );
  } catch (error) {
    console.error("Erreur lors du filtrage de l'utilisateur:", user, error);
    return false;
  }
});
  const pageCount = Math.ceil(filteredUsers.length / pagination.pageSize);
  const paginatedUsers = filteredUsers.slice(
    pagination.pageIndex * pagination.pageSize,
    (pagination.pageIndex + 1) * pagination.pageSize
  );

  const handleViewDetails = async (id: number) => {
    try {
      const actionResult = await dispatch(getUserById(id));
      if (getUserById.fulfilled.match(actionResult)) {
        setDetailedUser(actionResult.payload);
        setViewDialogOpen(true);
      } else {
        console.error("Erreur lors de la récupération utilisateur");
      }
    } catch (error) {
      console.error("Erreur lors de l'affichage du détail :", error);
    }
  };

  const handleDeleteClick = (user: User) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (userToDelete) {
      dispatch(deleteUser(userToDelete.id));
      setDeleteDialogOpen(false);
      setUserToDelete(null);
    }
  };

  const cancelDelete = () => {
    setDeleteDialogOpen(false);
    setUserToDelete(null);
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setDialogOpen(true);
  };

  return (
    <div className="w-full">
      <div className="flex items-center py-4 gap-2">
        <Input
          placeholder="Rechercher ..."
          value={globalFilter}
          onChange={(e) => {
            setGlobalFilter(e.target.value);
            setPagination(prev => ({ ...prev, pageIndex: 0 }));
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
                  Email
                </TableHead>
                <TableHead className="text-gray-700 font-semibold py-3 px-4 whitespace-nowrap">
                  Téléphone
                </TableHead>
                <TableHead className="text-gray-700 font-semibold py-3 px-4 whitespace-nowrap">
                  Permissions
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
              ) : paginatedUsers.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="h-24 text-center text-gray-500"
                  >
                    {globalFilter ? "Aucun résultat trouvé" : "Aucun utilisateur enregistré"}
                  </TableCell>
                </TableRow>
              ) : (
                paginatedUsers.map((user, index) => (
                  <TableRow
                    key={user.id}
                    className={index % 2 === 0 ? "bg-white hover:bg-gray-50" : "bg-gray-50 hover:bg-gray-100"}
                  >
                    <TableCell className="py-3 px-4 whitespace-nowrap font-medium text-gray-900">
                      {user.name}
                    </TableCell>
                    <TableCell className="py-3 px-4 whitespace-nowrap text-gray-700">
                      {user.email}
                    </TableCell>
                    <TableCell className="py-3 px-4 whitespace-nowrap text-gray-700">
                      {user.phone}
                    </TableCell>
                    <TableCell className="py-3 px-4 whitespace-nowrap text-gray-600 text-sm italic">
                      {user.permissions ? user.permissions.join(", ") : "Aucune permission"}
                    </TableCell>
                    <TableCell className="py-3 px-4 whitespace-nowrap">
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                                                      className="text-green-600 hover:text-green-600/90 "
                          onClick={() => handleEdit(user)}
                        >
                          <PencilIcon className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                           className="text-[#2c97f5]  hover:text-[#2c97f5]"
                          onClick={() => handleViewDetails(user.id)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                         className="text-red-500  hover:text-red-500"
                          onClick={() => handleDeleteClick(user)}
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
          {filteredUsers.length} utilisateur(s) trouvé(s)
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

      <UserFormDialog
        open={isDialogOpen}
        onClose={() => {
          setDialogOpen(false);
          setSelectedUser(null);
        }}
        initialData={selectedUser}
      />

      <DeleteConfirmationModal
        open={isDeleteDialogOpen}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        userName={userToDelete?.name}
      />

      <UserDetailsModal
        user={detailedUser}
        isOpen={!!detailedUser}
        onClose={() => setDetailedUser(null)}
      />
    </div>
  );
};