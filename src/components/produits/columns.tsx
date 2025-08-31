"use client";

import type { ColumnDef } from "@tanstack/react-table";
import {
  ArrowUpDown,
  Edit,
  MoreHorizontal,
  Trash2Icon,
  Eye,
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
import { API_BASE_URL } from "@/constants/config";
import { QRCodeCell } from "./QRCodeCell";
import { Badge } from "../ui/badge";
import type { Fournisseur } from "@/features/Produits/ajouter/page";

export interface Produit {
  fournisseurs: Fournisseur;
  createdAt: string;
  idProduit: string;
  nom: string;
  description: string;
  prix: number;
  stock: number;
  remise: number;
  marque: string;
  categorie: string;
  qrCode: string;
  images: string[];
}

interface produitColumnsProps {
  onView: (produit: Produit) => void;
  onEdit: (produit: Produit) => void;
  onDelete: (id: string) => void;
}

export const getProduitColumns = ({
  onView,
  onEdit,
  onDelete,
}: produitColumnsProps): ColumnDef<Produit>[] => {
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
      cell: ({ row }) => {
        const produit = row.original;
        return (
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 relative rounded-lg overflow-hidden bg-gray-100 border">
              {produit.images && (
                <img
                  src={`${API_BASE_URL}/uploads/produits/${produit.images}`}
                  alt={produit.nom}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <div>
              <div className="font-medium">{produit.nom}</div>
              <div className="text-sm text-gray-500 truncate max-w-[200px]">
                {produit.description}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "marque",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Marque
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "categorie",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Catégorie
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "prix",
      header: "Prix",
      cell: ({ row }) => {
        const prix = row.getValue("prix") as number;
        const remise = row.getValue("remise") as number | null;

        if (remise && remise > 0) {
          const prixRemise = prix - (prix * remise) / 100;

          return (
            <div className="flex flex-col">
              <span className="text-gray-500 line-through text-sm">
                {prix.toFixed(2)} DA
              </span>
              <span className="text-lg font-semibold text-green-600">
                {prixRemise.toFixed(2)} DA
              </span>
            </div>
          );
        }

        return (
          <span className="text-base font-medium text-gray-800">
            {prix?.toFixed(2)} DA
          </span>
        );
      },
    },
    {
      accessorKey: "remise",
      header: "Remise",
      cell: ({ row }) => {
        const remise = row.getValue("remise") as number | null;

        if (remise && remise > 0) {
          return (
            <Badge
              variant="secondary"
              className="bg-purple-100 text-purple-700 border border-purple-300 px-2 py-1 rounded-md"
            >
              {remise}%
            </Badge>
          );
        }

        return <span className="text-gray-400">-</span>;
      },
    },
    {
      accessorKey: "stock",
      header: "Stock",
      cell: ({ row }) => {
        const stock = row.getValue("stock") as number;
        return (
          <span
            className={
              stock == 0
                ? "text-red-500  font-bold"
                : stock < 10
                ? "text-orange-500 font-medium"
                : ""
            }
          >
            {stock}
          </span>
        );
      },
    },
    {
      accessorKey: "qrCode",
      header: "Code QR",
      cell: ({ row }) => {
        const qrCode = row.getValue("qrCode") as string;
        return <QRCodeCell value={qrCode} />;
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const produit = row.original;
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
                onClick={() => onView(produit)}
                className="text-blue-600 hover:text-blue-600/90 cursor-pointer"
              >
                <Eye
                  size={14}
                  className="mr-2 text-blue-600 hover:text-blue-600/90"
                />
                <span className="text-blue-600 hover:text-blue-600/90">
                  Voir
                </span>
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => onEdit(produit)}
                className="text-green-600 hover:text-green-600/90 cursor-pointer"
              >
                <Edit
                  size={14}
                  className="mr-2 text-green-600 hover:text-green-600/90"
                />
                <span className="text-green-600 hover:text-green-600/90">
                  Modifier
                </span>
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => {
                  onDelete(produit.idProduit);
                }}
                className="text-red-600 hover:text-red-600/90 cursor-pointer"
              >
                <Trash2Icon
                  size={14}
                  className="mr-2 text-red-600 hover:text-red-600/90"
                />
                <span className="text-red-600 hover:text-red-600/90">
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
