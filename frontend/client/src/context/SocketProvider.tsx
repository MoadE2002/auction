import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useAuthContext } from '../hooks/useAuthContext';
import axiosInstance from '../apicalls/axiosInstance';
import { Notification, NotificationResponse, NotifType } from '../constants/types';

interface SocketContextType {
  isConnected: boolean;
  notifications: {
    unread: Notification[];
    read: Notification[];
  };
  markNotificationAsRead: (notificationId: string) => Promise<void>;
  clearNotifications: () => Promise<void>;
  fetchNotifications: () => Promise<void>;
}

const SocketContext = createContext<SocketContextType | null>(null);

const transformNotifications = (response: NotificationResponse) => {
  const notifications = response.data.content.map((notif) => ({
    _id: notif.id.toString(),
    user: notif.userId.toString(),
    type: notif.type,
    message: notif.message,
    isRead: notif.read,
    createdAt: new Date(notif.timestamp),
    auctionId: notif.auctionId
  }));

  return {
    unread: notifications.filter(n => !n.isRead),
    read: notifications.filter(n => n.isRead)
  };
};

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuthContext();
  const [client, setClient] = useState<Client | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [notifications, setNotifications] = useState<{
    unread: Notification[];
    read: Notification[];
  }>({
    unread: [],
    read: []
  });

  const fetchNotifications = useCallback(async () => {
    if (!user?._id) return;

    try {
      const response = await axiosInstance.get<NotificationResponse>('/notifications');
      const transformedNotifications = transformNotifications(response);
      setNotifications(transformedNotifications);
      console.log('Fetched notifications:', transformedNotifications);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  }, [user]);

  const markNotificationAsRead = useCallback(async (notificationId: string) => {
    try {
      await axiosInstance.post(`/notifications/${notificationId}/read`);
      
      setNotifications(prev => {
        const notificationToMove = prev.unread.find(n => n._id === notificationId);
        if (!notificationToMove) return prev;

        return {
          unread: prev.unread.filter(n => n._id !== notificationId),
          read: [{ ...notificationToMove, isRead: true }, ...prev.read]
        };
      });
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  }, []);

  const clearNotifications = useCallback(async () => {
    if (!user?._id) return;

    try {
      await axiosInstance.delete(`/notifications/${user._id}`);
      setNotifications({ unread: [], read: [] });
    } catch (error) {
      console.error('Failed to clear notifications:', error);
    }
  }, [user]);

  useEffect(() => {
    if (user?.token && user?._id) {
      const wsUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8082'}/ws`;
      
      const newClient = new Client({
        webSocketFactory: () => new SockJS(wsUrl),
        connectHeaders: {
          Authorization: `Bearer ${user.token}`,
        },
        debug: (str) => {
          console.debug('WebSocket debug:', str);
        },
        onConnect: () => {
          console.log('WebSocket connected');
          setIsConnected(true);
          
          newClient.subscribe(`/topic/notifications/${user._id}`, (message) => {
            console.log('Received WebSocket message:', message.body);
            try {
              const notification: Notification = JSON.parse(message.body);
              setNotifications(prev => ({
                unread: [notification, ...prev.unread],
                read: prev.read
              }));
            } catch (error) {
              console.error('Failed to parse notification:', error);
            }
          });
        },
        onDisconnect: () => {
          console.log('WebSocket disconnected');
          setIsConnected(false);
        },
        onStompError: (frame) => {
          console.error('STOMP error:', frame);
        },
        reconnectDelay: 5000,
      });

      newClient.activate();
      setClient(newClient);
      fetchNotifications();

      return () => {
        if (newClient.active) {
          newClient.deactivate();
        }
      };
    }
  }, [user, fetchNotifications]);

  const contextValue: SocketContextType = {
    isConnected,
    notifications,
    markNotificationAsRead,
    clearNotifications,
    fetchNotifications
  };

  return (
    <SocketContext.Provider value={contextValue}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (context === null) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};