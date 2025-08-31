"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal, Unlock } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
  onDelete: (id: number) => void;
}

export const getBlacklistColumns = ({
  onDelete,
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
                onClick={() => {
                  onDelete(client.idClient);
                }}
                className="text-red-600 hover:text-red-600/90 cursor-pointer"
              >
                <Unlock
                  size={14}
                  className="mr-2 text-red-600 hover:text-red-600/90"
                />
                <span className=" text-red-600 hover:text-red-600/90 ">
                  {" "}
                  Retirer
                </span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
};
