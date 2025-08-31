import { useState, useEffect } from "react";
import useProfile from "@/hooks/useProfile";
import useChangePassword from "@/hooks/useChangePassword";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, Phone, Shield, Settings, Key, Eye, EyeOff } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export function AccountModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { loading, error, profile } = useProfile();
  const { changePassword, isLoading: isChangingPassword, error: passwordError, isSuccess: passwordSuccess, resetState } = useChangePassword();
  const [tab, setTab] = useState("view");
  const [showPasswords, setShowPasswords] = useState({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false
  });

  const [formData, setFormData] = useState({
    name: profile?.name || "",
    email: profile?.email || "",
    phone: profile?.phone || "",
  });

  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || "",
        email: profile.email || "",
        phone: profile.phone || "",
      });
    }
  }, [profile]);

  useEffect(() => {
    if (passwordSuccess) {
      toast.success("Mot de passe changé avec succès !");
      setPasswordData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      resetState();
    }
    
    if (passwordError) {
      toast.error(passwordError);
    }
  }, [passwordSuccess, passwordError, resetState]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    
    // Réinitialiser les erreurs quand l'utilisateur modifie le formulaire
    if (passwordError) {
      resetState();
    }
  };

  const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleUpdate = () => {
    console.log("Nouvelles données :", formData);
    toast.success("Profil mis à jour avec succès !");
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }

    try {
      await changePassword({
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword,
      });
    } catch (err) {
      // L'erreur est déjà gérée dans le hook et affichée via toast
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Mon compte
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <p className="text-muted-foreground text-sm">Chargement...</p>
        ) : error ? (
          <p className="text-destructive text-sm">Erreur de chargement</p>
        ) : (
          <Tabs value={tab} onValueChange={setTab} className="w-full space-y-4">
            {/* Avatar */}
            {profile?.name && (
              <div className="flex justify-center mb-2">
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr to-[#f7b154] from-[#F8A67E] text-white flex items-center justify-center text-2xl font-bold shadow-sm">
                  {profile.name.charAt(0).toUpperCase()}
                </div>
              </div>
            )}

            {/* Tabs */}
            <TabsList className="grid w-full grid-cols-3 rounded-lg bg-muted/70 p-1 h-12">
              <TabsTrigger
                value="view"
                className="flex items-center text-sm gap-2 h-10 rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                <User size={16} /> Profil
              </TabsTrigger>
              <TabsTrigger
                value="edit"
                className="flex items-center text-sm gap-2 rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                <Settings size={16} /> Modifier
              </TabsTrigger>
              <TabsTrigger
                value="password"
                className="flex items-center text-sm gap-2 rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                <Key size={16} /> Mot de passe
              </TabsTrigger>
            </TabsList>

            {/* Affichage du profil */}
            <TabsContent value="view" className="space-y-4">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Nom</p>
                  <p>{profile?.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p>{profile?.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Téléphone</p>
                  <p>{profile?.phone || "Non fourni"}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Rôle</p>
                  <Badge variant="secondary">{profile?.role}</Badge>
                </div>
              </div>
            </TabsContent>

            {/* Modifier le profil */}
            <TabsContent value="edit" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Téléphone</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
              <Button
                onClick={handleUpdate}
                className="w-full mt-4 bg-gradient-to-r to-[#f7b154] from-[#F8A67E] text-white shadow-md hover:opacity-90"
              >
                Mettre à jour
              </Button>
            </TabsContent>

            {/* Modifier le mot de passe */}
            <TabsContent value="password">
              <form onSubmit={handlePasswordUpdate} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="oldPassword">Ancien mot de passe</Label>
                  <div className="relative">
                    <Input
                      id="oldPassword"
                      name="oldPassword"
                      type={showPasswords.oldPassword ? "text" : "password"}
                      value={passwordData.oldPassword}
                      onChange={handlePasswordChange}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1 h-7 w-7"
                      onClick={() => togglePasswordVisibility('oldPassword')}
                    >
                      {showPasswords.oldPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword">Nouveau mot de passe</Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      name="newPassword"
                      type={showPasswords.newPassword ? "text" : "password"}
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      required
                      minLength={6}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1 h-7 w-7"
                      onClick={() => togglePasswordVisibility('newPassword')}
                    >
                      {showPasswords.newPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showPasswords.confirmPassword ? "text" : "password"}
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      required
                      minLength={6}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1 h-7 w-7"
                      onClick={() => togglePasswordVisibility('confirmPassword')}
                    >
                      {showPasswords.confirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </Button>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isChangingPassword}
                  className="w-full mt-4 bg-gradient-to-r to-[#f7b154] from-[#F8A67E] text-white shadow-md hover:opacity-90 disabled:opacity-50"
                >
                  {isChangingPassword ? "Changement en cours..." : "Changer le mot de passe"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
}