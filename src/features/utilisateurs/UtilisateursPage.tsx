import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/redux-hooks";

import { Button } from "@/components/ui/button";
import { PlusCircleIcon, UsersIcon } from "lucide-react";
import { UserTable } from "./components/UserTable";
import UserFormDialog from "./components/UserFormDialog";

import { fetchUsers } from "@/hooks/usersHooks";
export const UsersPage = () => {
  const dispatch = useAppDispatch();
  const { users, loading } = useAppSelector((state) => state.users);
  const [isDialogOpen, setDialogOpen] = useState(false);
  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  return (
    <div className="p-6 ">
      <div className="flex justify-between items-center mb-4 ">
        <h2 className="text-[27px]  font-bold gap-x-2  flex items-center text-[#F8A67E]">
          <UsersIcon size={28} /> Gestion des utilisateurs
        </h2>
        <Button
          onClick={() => setDialogOpen(true)}
          style={{ background: "#F8A67E", borderRadius: "8px" }}
        >
          <PlusCircleIcon className="w-4 h-4 mr-[3px]" />
          Ajouter un utilisateur
        </Button>

        <UserFormDialog
          open={isDialogOpen}
          onClose={() => setDialogOpen(false)}
        />
      </div>
      <UserTable users={users} loading={loading} />
    </div>
  );
};

export default UsersPage;
