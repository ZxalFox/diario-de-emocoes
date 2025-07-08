"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, Bell, CheckCircle } from "lucide-react";
import { format } from "date-fns";

interface Notification {
  id: number;
  title: string;
  message: string;
  notification_type: string;
  read: boolean;
  created_at: string;
}

const translatedNotificationTypes: Record<string, string> = {
  weekkly_summary: "Resumo Semanal",
  entry_logged: "Anotação Registrada",
  daily_reminder: "Lembrete Diário",
  achievement: "Conquista",
  daily_checkin: "Check-in Diário",
};

export function NotificationCenter() {
  const { token } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/notifications`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setNotifications(data);
        }
      } catch (error) {
        console.error("Erro ao buscar notificações:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [token]);

  const markAsRead = async (id: number) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/notifications/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ read: true }),
        }
      );

      if (response.ok) {
        setNotifications((prev) =>
          prev.map((notif) =>
            notif.id === id ? { ...notif, read: true } : notif
          )
        );
      }
    } catch (error) {
      console.error("Erro ao marcar notificação como lida:", error);
    }
  };

  const getNotificationColor = (type: string) => {
    const colors: Record<string, string> = {
      daily_reminder: "bg-blue-100 text-blue-800",
      achievement: "bg-green-100 text-green-800",
      weekly_summary: "bg-purple-100 text-purple-800",
      daily_checkin: "bg-orange-100 text-orange-800",
    };
    return colors[type] || "bg-gray-100 text-gray-800";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Notificações</h2>
        <p className="text-gray-600">
          Fique atualizado com seu diário de emoções
        </p>
      </div>

      {notifications.length === 0 ? (
        <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
          <CardContent className="text-center py-12">
            <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">Sem notificações ainda.</p>
            <p className="text-gray-400">
              Iremos te notificar sobre atualizações importantes e conquistas!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <Card
              key={notification.id}
              className={`shadow-lg border-0 bg-white/90 backdrop-blur-sm hover:shadow-xl transition-all ${
                !notification.read ? "ring-2 ring-blue-200" : ""
              }`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Badge
                      className={getNotificationColor(
                        translatedNotificationTypes[
                          notification.notification_type
                        ]
                      )}
                    >
                      {
                        translatedNotificationTypes[
                          notification.notification_type
                        ]
                      }
                    </Badge>
                    {!notification.read && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    )}
                  </div>
                  <span className="text-sm text-gray-500">
                    {format(
                      new Date(notification.created_at),
                      "dd/MM/yyyy - HH:mm"
                    )}
                  </span>
                </div>
                <CardTitle className="text-lg">{notification.title}</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-gray-700 mb-4">{notification.message}</p>
                {!notification.read && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => markAsRead(notification.id)}
                    className="flex items-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Marcar como lida
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
