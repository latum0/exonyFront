"use client";

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Edit3,
  Package,
  ChevronDown,
  ChevronUp,
  Calendar,
  Tag,
  Building2,
  QrCode,
  Truck,
  Loader2,
} from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";
import { fetchProduit } from "@/hooks/produits-hook";
import type { AppDispatch, RootState } from "@/store";
import { API_BASE_URL } from "@/constants/config";
import type { Fournisseur } from "../ajouter/page";

export default function ProduitDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  const { produit, loading, error } = useSelector(
    (state: RootState) => state.produits
  );

  useEffect(() => {
    if (id) {
      dispatch(fetchProduit(id));
    }
  }, [id, dispatch]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <Loader2 className="w-16 h-16 text-[#F8A67E] animate-spin mx-auto" />
            <div className="absolute inset-0 w-16 h-16 border-4 border-[#F8A67E]/20 rounded-full mx-auto"></div>
          </div>
          <p className="mt-4 text-slate-600 font-medium">
            Chargement du produit...
          </p>
        </div>
      </div>
    );
  }

  if (!produit || error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-20 h-20 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-10 h-10 text-slate-500" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">
            Produit introuvable
          </h2>
          <p className="text-slate-600">
            Le produit que vous recherchez n'existe pas ou a été supprimé.
          </p>
        </div>
      </div>
    );
  }

  const hasDiscount = produit.remise && produit.remise > 0;
  const discountedPrice = hasDiscount
    ? produit.prix - (produit.prix * produit.remise) / 100
    : produit.prix;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const fournisseursArray = Array.isArray(produit.fournisseurs)
    ? produit.fournisseurs
    : produit.fournisseurs
      ? [produit.fournisseurs]
      : [];
  const fournisseursLength = fournisseursArray.length;


  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto p-6 py-8">
        <div className="flex flex-col xl:flex-row gap-8 mb-8">
          {/* Images Section - Left 45% */}
          <div className="xl:w-[45%]">
            {/* Main Image */}
            <div className="bg-slate-50 rounded-2xl shadow-md overflow-hidden mb-4 border border-slate-200/50">
              {produit.images && produit.images.length > 0 ? (
                <img
                  src={`${API_BASE_URL}/uploads/produits/${produit.images[selectedImageIndex]}`}
                  alt={produit.nom}
                  className="w-full h-96 object-cover"
                />
              ) : (
                <div className="w-full h-96 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                  <Package className="w-16 h-16 text-slate-400" />
                </div>
              )}
            </div>

            {/* Thumbnail Images */}
            {produit.images && produit.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 ">
                {produit.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20  ml-0.5 mt-0.5 rounded-xl overflow-hidden border-2 transition-all duration-200 ${selectedImageIndex === index
                      ? "border-[#F8A67E] shadow-lg scale-105"
                      : "border-slate-200 hover:border-[#F8A67E]/50"
                      }`}
                  >
                    <img
                      src={`${API_BASE_URL}/uploads/produits/${image}`}
                      alt={`${produit.nom} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Basic Info Section - Right 55% */}
          <div className="xl:w-[55%] space-y-6">
            {/* Edit Button */}
            <div className="flex justify-end">
              <button
                onClick={() =>
                  navigate(`/produits/${produit.idProduit}/modifier`)
                }
                className="flex items-center gap-2 px-4 py-2 bg-[#F8A67E] text-white rounded-md hover:bg-[#F8A67E]/90 transition-colors "
              >
                <Edit3 className="w-4 h-4" />
                Modifier
              </button>
            </div>

            {/* Product Name */}
            <h1 className="text-4xl font-bold text-slate-800 leading-tight">
              {produit.nom}
            </h1>

            {/* Price Section */}
            <div className="flex items-center gap-4">
              {hasDiscount ? (
                <>
                  <div className="text-3xl font-bold text-[#F8A67E]">
                    {discountedPrice.toFixed(2)} DA
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg text-slate-500 line-through">
                      {produit.prix} DA
                    </span>
                    <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-sm font-semibold">
                      -{produit.remise}%
                    </span>
                  </div>
                </>
              ) : (
                <div className="text-3xl font-bold text-[#F8A67E]">
                  {produit.prix} DA
                </div>
              )}
            </div>
            {/* Description */}
            <div className="bg-slate-50/50 rounded-2xl p-4  border border-slate-200/50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                  <Tag className="w-5 h-5 text-[#F8A67E]" />
                  Description
                </h3>
                <button
                  onClick={() =>
                    setIsDescriptionExpanded(!isDescriptionExpanded)
                  }
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  {isDescriptionExpanded ? (
                    <ChevronUp className="w-5 h-5 text-slate-600" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-600" />
                  )}
                </button>
              </div>
              <p
                className={`text-slate-600 leading-relaxed transition-all ${isDescriptionExpanded ? "" : "line-clamp-3"
                  }`}
              >
                {produit.description}
              </p>
            </div>
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/50">
              {/* Ligne icône + texte */}
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-[#F8A67E]/20 rounded-lg flex items-center justify-center">
                  <QrCode className="w-5 h-5 text-[#F8A67E]" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                    QR Code
                  </h3>
                </div>
              </div>

              {/* QR code en dessous */}
              {produit.qrCode && (
                <div className="mt-4 flex justify-center">
                  <QRCodeCanvas
                    value={produit.qrCode}
                    size={200}
                    bgColor="#ffffff"
                    fgColor="#000000"
                    className="rounded-md border border-slate-300 p-2 bg-white"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Product Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Brand */}
            <div className="bg-slate-50 rounded-xl p-4  border border-slate-200/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Marque</p>
                  <p className="font-semibold text-slate-800">
                    {produit.marque}
                  </p>
                </div>
              </div>
            </div>

            {/* Category */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Tag className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Catégorie</p>
                  <p className="font-semibold text-slate-800">
                    {produit.categorie}
                  </p>
                </div>
              </div>
            </div>

            {/* Stock */}
            <div className="bg-slate-50 rounded-xl p-4  border border-slate-200/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Package className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Stock</p>
                  <p className="font-semibold text-slate-800">
                    {produit.stock} unités
                  </p>
                </div>
              </div>
            </div>

            {/* QR Code */}
          </div>

          {/* Suppliers */}
          {produit.fournisseurs && fournisseursArray.length > 0 && (
            <div className="bg-slate-50 rounded-2xl p-6  border border-slate-200/50">
              <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <Truck className="w-5 h-5 text-[#F8A67E]" />
                Fournisseurs
              </h3>
              <div className="flex flex-wrap gap-3">
                {
                  fournisseursArray.map(
                    (fournisseur: Fournisseur, index: number) => (
                      <div
                        key={index}
                        className="px-4 py-2 bg-gradient-to-r from-[#F8A67E]/10 to-[#F8A67E]/5 border border-[#F8A67E]/20 rounded-xl"
                      >
                        <span className="text-slate-700 font-medium">
                          {fournisseur.nom || `Fournisseur ${index + 1}`}
                        </span>
                      </div>
                    )
                  )}
              </div>
            </div>
          )}

          {/* Created Date */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/50 max-w-md">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-slate-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Date de création</p>
                <p className="font-semibold text-slate-800">
                  {formatDate(produit.createdAt)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
