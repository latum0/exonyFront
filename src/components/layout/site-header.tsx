import { useState, useEffect } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import useProfile from "@/hooks/useProfile";
import useNotifications from "@/hooks/useNotifications";
import { NavUserHeader } from "./nav-user";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, Trash2, CheckCircle, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

export function SiteHeader() {
  const { profile } = useProfile();
  const {
    notifications,
    loading,
    error,
    deleting,
    fetchNotifications,
    deleteNotification,
  } = useNotifications();

  const [unreadCount, setUnreadCount] = useState(0);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const user = {
    name: profile?.name || "",
    role: profile?.role || "",
    email: profile?.email || "",
  };

  // Charger les notifications quand le dropdown s'ouvre
  useEffect(() => {
    if (isNotificationsOpen && profile?.role === "ADMIN") {
      fetchNotifications(1, 10);
    }
  }, [isNotificationsOpen, profile?.role]);

  // Calculer le nombre de notifications non résolues
  useEffect(() => {
    if (notifications.length > 0) {
      const unresolved = notifications.filter(
        (notif) => !notif.resolved
      ).length;
      setUnreadCount(unresolved);
    } else {
      setUnreadCount(0);
    }
  }, [notifications]);

  const handleDeleteNotification = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Empêcher la fermeture du dropdown
    try {
      await deleteNotification(id);
      toast.success("Notification supprimée");
    } catch (err) {
      // L'erreur est déjà gérée dans le hook
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "OUT_OF_STOCK":
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case "LOW_STOCK":
        return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      default:
        return <Bell className="h-4 w-4 text-blue-500" />;
    }
  };

  const getNotificationLabel = (type: string) => {
    switch (type) {
      case "OUT_OF_STOCK":
        return "Rupture de stock";
      case "LOW_STOCK":
        return "Stock faible";
      default:
        return "Notification";
    }
  };

  return (
    <header className="sticky top-0 bg-[#fafafa] z-50 h-16 flex items-center shadow-sm border-b pr-4 lg:pr-6 pl-4">
      <div className="flex w-full items-center">
        <SidebarTrigger className="-ml-1" />

        <div className="flex items-center justify-end w-full gap-4">
          {/* Bouton de notifications pour les administrateurs */}
          {profile?.role === "ADMIN" && (
            <DropdownMenu
              open={isNotificationsOpen}
              onOpenChange={setIsNotificationsOpen}
            >
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative h-9 w-9 rounded-full"
                >
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <Badge
                      variant="destructive"
                      className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                    >
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-80 max-h-96 overflow-y-auto"
              >
                <div className="flex items-center justify-between p-2 border-b">
                  <h3 className="font-semibold">Notifications</h3>
                  <Badge variant="outline">
                    {notifications.length}{" "}
                    {notifications.length > 1 ? "notifs" : "notif"}
                  </Badge>
                </div>

                {loading ? (
                  <div className="p-4 text-center text-sm text-muted-foreground">
                    Chargement des notifications...
                  </div>
                ) : error ? (
                  <div className="p-4 text-center text-sm text-destructive">
                    Erreur: {error}
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="p-4 text-center text-sm text-muted-foreground">
                    Aucune notification
                  </div>
                ) : (
                  <div className="space-y-1 p-1">
                    {notifications.map((notification) => (
                      <DropdownMenuItem
                        key={notification.id}
                        className="flex flex-col items-start p-3 rounded-md cursor-pointer hover:bg-accent"
                        onClick={() => {
                          // Action quand on clique sur une notification
                          console.log("Voir détails:", notification.id);
                        }}
                      >
                        <div className="flex items-start justify-between w-full mb-2">
                          <div className="flex items-center gap-2">
                            {getNotificationIcon(notification.type)}
                            <span className="text-sm font-medium">
                              {getNotificationLabel(notification.type)}
                            </span>
                          </div>
                          {notification.resolved ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <Badge variant="outline" className="text-xs">
                              Non résolu
                            </Badge>
                          )}
                        </div>

                        <p className="text-sm text-muted-foreground mb-2">
                          {notification.message}
                        </p>

                        <div className="flex items-center justify-between w-full text-xs text-muted-foreground">
                          <span>
                            {new Date(
                              notification.createdAt
                            ).toLocaleDateString()}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={(e) =>
                              handleDeleteNotification(notification.id, e)
                            }
                            disabled={deleting.includes(notification.id)}
                          >
                            {deleting.includes(notification.id) ? (
                              <div className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
                            ) : (
                              <Trash2 className="h-3 w-3" />
                            )}
                          </Button>
                        </div>
                      </DropdownMenuItem>
                    ))}
                  </div>
                )}

                {notifications.length > 0 && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-xs text-center text-muted-foreground cursor-pointer"
                      onClick={() => {
                        // Action pour voir toutes les notifications
                        console.log("Voir toutes les notifications");
                      }}
                    >
                      Voir toutes les notifications
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          <NavUserHeader user={user} />
        </div>
      </div>
    </header>
  );
}
