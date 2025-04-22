import { useEffect, useRef } from "react";
import { Client, IMessage } from "@stomp/stompjs";
import SockJS from "sockjs-client";

export interface NotificationDTO {
    id: string;
    sender: string;
    recipient: string;
    title: string;
    content: string;
    type: "info" | "warning" | "error" | "scan";
    timestamp: string;
    read: boolean;
}

interface UseNotificationsProps {
  userId: string;
  onGlobalNotification?: (n: NotificationDTO) => void;
  onPrivateNotification?: (n: NotificationDTO) => void;
}

export const useNotifications = ({
  userId,
  onGlobalNotification,
  onPrivateNotification,
}: UseNotificationsProps) => {
  const clientRef = useRef<Client | null>(null);

  useEffect(() => {
    if (!userId) return;

    const client = new Client({
      webSocketFactory: () => {
        return new SockJS(`${import.meta.env.VITE_WS_URL}/ws`);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      debug: (str) => console.log(str),
      onConnect: () => {
        console.log("✅ Conectado al WebSocket");

        // Subscripción a notificaciones privadas
        client.subscribe(`/queue/notifications/${userId}`, (message: IMessage) => {
          const notification: NotificationDTO = JSON.parse(message.body);
          console.log("📩 Notificación privada:", notification);
          onPrivateNotification?.(notification);
        });

        // Subscripción a notificaciones globales
        client.subscribe("/topic/global-notifications", (message: IMessage) => {
          const notification: NotificationDTO = JSON.parse(message.body);
          console.log("🌐 Notificación global:", notification);
          onGlobalNotification?.(notification);
        });
      },
      onStompError: (frame) => {
        console.error("❌ STOMP error", frame);
      },
    });

    client.activate();
    clientRef.current = client;

    return () => {
      client.deactivate();
    };
  }, [userId]);
};