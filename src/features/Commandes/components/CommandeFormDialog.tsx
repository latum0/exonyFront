import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Minus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import api from "@/api/axios";

// Schéma de validation Zod
const ligneCommandeSchema = z.object({
  produitId: z.string().min(1, "Le produit est requis"),
  quantite: z.number().min(1, "La quantité doit être au moins 1"),
});

// Schéma de validation pour la commande
const commandeSchema = z.object({
  dateCommande: z.string().min(1, "La date de commande est requise"),
  statut: z.enum(["EN_ATTENTE", "EN_COURS", "LIVREE", "ANNULEE"]),
  adresseLivraison: z.string().min(1, "L'adresse de livraison est requise"),
  clientId: z.number({ 
    invalid_type_error: "Le client est requis",
    required_error: "Le client est requis"
  }).min(1, "Le client est requis"),
  lignes: z.array(ligneCommandeSchema).min(1, "Au moins une ligne de commande est requise"),
});

type CommandeFormValues = z.infer<typeof commandeSchema>;

interface Client {
  id: number;
  nom: string;
  prenom: string;
  email: string;
}

interface Produit {
  id: string;
  nom: string;
  prix: number;
  quantite: number;
}

interface CommandeFormDialogProps {
  open: boolean;
  onClose: () => void;
  initialData?: CommandeResponseDto | null;
  onSubmit: (data: any) => void;
}

export const CommandeFormDialog: React.FC<CommandeFormDialogProps> = ({
  open,
  onClose,
  initialData,
  onSubmit,
}) => {
  const [formData, setFormData] = useState({
    dateCommande: new Date().toISOString().slice(0, 16),
    statut: "EN_ATTENTE",
    adresseLivraison: "",
    clientId: "",
    lignes: [] as Array<{ produitId: string; quantite: number }>,
  });

  const [newLigne, setNewLigne] = useState({ produitId: "", quantite: 1 });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [ligneErrors, setLigneErrors] = useState<Record<number, Record<string, string>>>({});
  const [clients, setClients] = useState<Client[]>([]);
  const [produits, setProduits] = useState<Produit[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      fetchClientsAndProduits();
    }
  }, [open]);

  useEffect(() => {
    if (initialData) {
      setFormData({
        dateCommande: initialData.dateCommande.slice(0, 16),
        statut: initialData.statut,
        adresseLivraison: initialData.adresseLivraison,
        clientId: initialData.clientId.toString(),
        lignes: initialData.ligne.map(l => ({
          produitId: l.produitId,
          quantite: l.quantite,
        })),
      });
    } else {
      setFormData({
        dateCommande: new Date().toISOString().slice(0, 16),
        statut: "EN_ATTENTE",
        adresseLivraison: "",
        clientId: "",
        lignes: [],
      });
    }
    setErrors({});
    setLigneErrors({});
  }, [initialData, open]);

  const fetchClientsAndProduits = async () => {
    setLoading(true);
    try {
      // Récupérer les clients
      const clientsResponse = await api.get("/clients");
      setClients(clientsResponse.data.data || clientsResponse.data);

      // Récupérer les produits
      const produitsResponse = await api.get("/produits");
      setProduits(produitsResponse.data.data || produitsResponse.data);
    } catch (error) {
      console.error("Erreur lors du chargement des données:", error);
      toast.error("Erreur de chargement", {
        description: "Impossible de charger les clients et produits",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const addLigne = () => {
    // Trouver le produit sélectionné
    const produitSelectionne = produits.find(p => p.id === newLigne.produitId);
    
    // Vérifier si la quantité demandée est disponible
    if (produitSelectionne && newLigne.quantite > produitSelectionne.quantite) {
      toast.error("Stock insuffisant", {
        description: `Quantité demandée (${newLigne.quantite}) supérieure au stock disponible (${produitSelectionne.quantite})`,
      });
      return;
    }

    const ligneValidation = ligneCommandeSchema.safeParse({
      produitId: newLigne.produitId,
      quantite: newLigne.quantite,
    });

    if (!ligneValidation.success) {
      const newErrors: Record<string, string> = {};
      ligneValidation.error.errors.forEach(error => {
        newErrors[error.path[0]] = error.message;
      });
      
      toast.error("Erreur de validation", {
        description: "Veuillez corriger les erreurs dans la ligne avant de l'ajouter",
      });
      return;
    }

    setFormData(prev => ({
      ...prev,
      lignes: [...prev.lignes, newLigne],
    }));
    setNewLigne({ produitId: "", quantite: 1 });
  };

  const removeLigne = (index: number) => {
    const ligneToRemove = formData.lignes[index];
    setFormData(prev => ({
      ...prev,
      lignes: prev.lignes.filter((_, i) => i !== index),
    }));
    
    setLigneErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[index];
      return newErrors;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const submitData = {
      dateCommande: formData.dateCommande,
      statut: formData.statut,
      adresseLivraison: formData.adresseLivraison,
      clientId: formData.clientId ? parseInt(formData.clientId) : 0,
      lignes: formData.lignes,
    };

    const validationResult = commandeSchema.safeParse(submitData);

    if (!validationResult.success) {
      const newErrors: Record<string, string> = {};
      const newLigneErrors: Record<number, Record<string, string>> = {};
      
      validationResult.error.errors.forEach(error => {
        const path = error.path.join('.');
        
        if (path.startsWith('lignes.')) {
          const pathParts = path.split('.');
          const ligneIndex = parseInt(pathParts[1]);
          const fieldName = pathParts[2];
          
          if (!isNaN(ligneIndex)) {
            if (!newLigneErrors[ligneIndex]) {
              newLigneErrors[ligneIndex] = {};
            }
            newLigneErrors[ligneIndex][fieldName] = error.message;
          }
        } else {
          newErrors[path] = error.message;
        }
      });

      setErrors(newErrors);
      setLigneErrors(newLigneErrors);
      
      toast.error("Erreur de validation", {
        description: "Veuillez corriger les erreurs dans le formulaire",
      });
      return;
    }

    setErrors({});
    setLigneErrors({});

    try {
      onSubmit(submitData);
      toast.success(initialData ? "Commande modifiée" : "Commande créée");
    } catch (error) {
      toast.error("Erreur lors de la soumission");
    }
  };

  const getClientFullName = (client: Client) => {
    return `${client.prenom} ${client.nom} (${client.email})`;
  };

  const getProduitName = (produitId: string) => {
    const produit = produits.find(p => p.id === produitId);
    return produit ? `${produit.nom} - ${produit.prix}€` : `Produit ${produitId}`;
  };

  // Fonction pour obtenir le stock disponible d'un produit
  const getStockDisponible = (produitId: string) => {
    const produit = produits.find(p => p.id === produitId);
    return produit ? produit.quantite : 0;
  };

  // Fonction pour gérer le changement de quantité
  const handleQuantiteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nouvelleQuantite = parseInt(e.target.value) || 1;
    const stockMax = newLigne.produitId ? getStockDisponible(newLigne.produitId) : 0;
    
    // Si le produit est sélectionné, limiter à la quantité disponible
    const quantiteFinale = newLigne.produitId 
      ? Math.min(Math.max(1, nouvelleQuantite), stockMax)
      : Math.max(1, nouvelleQuantite);
    
    setNewLigne(prev => ({ 
      ...prev, 
      quantite: quantiteFinale
    }));
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) {
        onClose();
      }
    }}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Modifier la commande" : "Créer une nouvelle commande"}
          </DialogTitle>
        </DialogHeader>
        
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <p>Chargement des données...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dateCommande">Date de commande *</Label>
                <Input
                  id="dateCommande"
                  name="dateCommande"
                  type="datetime-local"
                  value={formData.dateCommande}
                  onChange={handleChange}
                  className={errors.dateCommande ? "border-red-500" : ""}
                />
                {errors.dateCommande && (
                  <p className="text-sm text-red-500">{errors.dateCommande}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="statut">Statut *</Label>
                <Select
                  value={formData.statut}
                  onValueChange={(value) => handleSelectChange("statut", value)}
                >
                  <SelectTrigger className={errors.statut ? "border-red-500" : ""}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="EN_ATTENTE">En attente</SelectItem>
                    <SelectItem value="EN_COURS">En cours</SelectItem>
                    <SelectItem value="LIVREE">Livrée</SelectItem>
                    <SelectItem value="ANNULEE">Annulée</SelectItem>
                  </SelectContent>
                </Select>
                {errors.statut && (
                  <p className="text-sm text-red-500">{errors.statut}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="adresseLivraison">Adresse de livraison *</Label>
              <Input
                id="adresseLivraison"
                name="adresseLivraison"
                value={formData.adresseLivraison}
                onChange={handleChange}
                placeholder="Adresse complète de livraison"
                className={errors.adresseLivraison ? "border-red-500" : ""}
              />
              {errors.adresseLivraison && (
                <p className="text-sm text-red-500">{errors.adresseLivraison}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="clientId">Client *</Label>
              <Select
                value={formData.clientId}
                onValueChange={(value) => handleSelectChange("clientId", value)}
              >
                <SelectTrigger className={errors.clientId ? "border-red-500" : ""}>
                  <SelectValue placeholder="Sélectionner un client" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((client) => (
                    <SelectItem key={client?.id} value={client?.id?.toString()}>
                      {getClientFullName(client)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.clientId && (
                <p className="text-sm text-red-500">{errors.clientId}</p>
              )}
            </div>

            <div className="space-y-4">
              <Label>Lignes de commande *</Label>
              
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
                <div className="sm:col-span-3">
                  <Select
                    value={newLigne.produitId}
                    onValueChange={(value) => {
                      const produit = produits.find(p => p.id === value);
                      setNewLigne(prev => ({ 
                        ...prev, 
                        produitId: value,
                        // Réinitialiser la quantité à 1 ou au maximum disponible
                        quantite: 1
                      }));
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un produit" />
                    </SelectTrigger>
                    <SelectContent>
                      {produits.map((produit) => {
                        const estEnStock = produit.quantite > 0;
                        return (
                          <SelectItem 
                            key={produit.id} 
                            value={produit.id}
                            disabled={!estEnStock}
                            className={!estEnStock ? "text-red-500 opacity-50" : ""}
                          >
                            {produit.nom} - Stock: {produit.quantite}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="sm:col-span-1">
                  <Input
                    type="number"
                    placeholder="Quantité *"
                    min="1"
                    max={newLigne.produitId ? getStockDisponible(newLigne.produitId) : undefined}
                    value={newLigne.quantite}
                    onChange={handleQuantiteChange}
                    className="w-full"
                  />
                  {newLigne.produitId && (
                    <p className="text-xs text-gray-500 mt-1">
                      Max: {getStockDisponible(newLigne.produitId)}
                    </p>
                  )}
                </div>
                
                <div className="sm:col-span-1">
                  <Button 
                    type="button" 
                    onClick={addLigne} 
                    className="flex items-center gap-1 w-full justify-center"
                    disabled={!newLigne.produitId}
                  >
                    <Plus className="h-4 w-4" /> Ajouter
                  </Button>
                </div>
              </div>

              {errors.lignes && (
                <p className="text-sm text-red-500">{errors.lignes}</p>
              )}

              {formData.lignes.length > 0 && (
                <div className="border rounded-md p-4 space-y-2">
                  {formData.lignes.map((ligne, index) => {
                    const produit = produits.find(p => p.id === ligne.produitId);
                    return (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div className="flex-1">
                          <span className="text-sm block">
                            Produit: {produit ? produit.nom : `ID: ${ligne.produitId}`} - 
                            Quantité: {ligne.quantite} - 
                            Prix unitaire: {produit ? `${produit.prix}€` : 'N/A'} - 
                            Total: {produit ? `${(produit.prix * ligne.quantite).toFixed(2)}€` : 'N/A'}
                          </span>
                          {ligneErrors[index]?.produitId && (
                            <p className="text-xs text-red-500">{ligneErrors[index]?.produitId}</p>
                          )}
                          {ligneErrors[index]?.quantite && (
                            <p className="text-xs text-red-500">{ligneErrors[index]?.quantite}</p>
                          )}
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeLigne(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" type="button" onClick={onClose}>
                Annuler
              </Button>
              <Button type="submit" style={{ background: "#F8A67E" }}>
                {initialData ? "Enregistrer les modifications" : "Créer la commande"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};