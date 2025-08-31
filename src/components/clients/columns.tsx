"use client";

import type { ColumnDef } from "@tanstack/react-table";
import {
  ArrowUpDown,
  Copy,
  Edit,
  MoreHorizontal,
  Trash2Icon,
  Ban,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

export interface Client {
  idClient: number;
  nom: string;
  prenom: string;
  adresse: string;
  email: string;
  numeroTelephone: string;
  statut: "ACTIVE" | "BLACKLISTED";
}

interface ClientColumnsProps {
  onEdit: (client: Client) => void;
  onDelete: (id: number) => void;
  onBlacklist: (id: number) => void;
}

export const getClientColumns = ({
  onEdit,
  onDelete,
  onBlacklist,
}: ClientColumnsProps): ColumnDef<Client>[] => {
  return [
    {
      accessorKey: "nom",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Nom
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "prenom",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Prénom
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "adresse",
      header: "Adresse",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "numeroTelephone",
      header: "Téléphone",
    },
    {
      accessorKey: "statut",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Statut
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const status = row.getValue("statut") as string;
        return (
          <span
            className={`px-2 py-1 rounded-md text-xs font-medium ${
              status === "ACTIVE"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {status === "ACTIVE" ? "Actif" : "Blacklisté"}
          </span>
        );
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const client = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-8 w-8 p-0 bg-none text-gray-500 hover:bg-gray-100"
              >
                <span className="sr-only">Ouvrir le menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-blue-600 hover:text-blue-600/90 cursor-pointer"
                onClick={() => {
                  navigator.clipboard.writeText(client.email);
                  toast.success("Email copié !", {
                    description: client.email,
                    duration: 2000,
                  });
                }}
              >
                <Copy
                  size={14}
                  className="mr-2 text-blue-600 hover:text-blue-600/90 "
                />
                <span className=" text-blue-600 hover:text-blue-600/90 ">
                  {" "}
                  Copier l'email
                </span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onEdit(client)}
                className="text-green-600 hover:text-green-600/90 cursor-pointer"
              >
                <Edit
                  size={14}
                  className="mr-2 text-green-600 hover:text-green-600/90"
                />
                <span className=" text-green-600 hover:text-green-600/90 ">
                  {" "}
                  Modifier
                </span>
              </DropdownMenuItem>
              {client.statut === "ACTIVE" && (
                <DropdownMenuItem
                  onClick={() => onBlacklist(client.idClient)}
                  className="text-orange-600 hover:text-orange-600/90 cursor-pointer"
                >
                  <Ban
                    size={14}
                    className="mr-2 text-orange-600 hover:text-orange-600/90 "
                  />

                  <span className=" text-orange-600 hover:text-orange-600/90 ">
                    {" "}
                    Ajouter au blacklist
                  </span>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                onClick={() => {
                  onDelete(client.idClient);
                }}
                className="text-red-600 hover:text-red-600/90 cursor-pointer"
              >
                <Trash2Icon
                  size={14}
                  className="mr-2 text-red-600 hover:text-red-600/90"
                />
                <span className=" text-red-600 hover:text-red-600/90 ">
                  {" "}
                  Supprimer
                </span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
};
