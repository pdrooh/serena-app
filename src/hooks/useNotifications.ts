import { useState, useEffect } from 'react';
import { notificationService, NotificationConfig, ReminderSettings } from '../services/notificationService';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<NotificationConfig[]>([]);
  const [settings, setSettings] = useState<ReminderSettings>(notificationService.getReminderSettings());

  useEffect(() => {
    // Carregar notificações iniciais
    setNotifications(notificationService.getNotifications());
    setSettings(notificationService.getReminderSettings());

    // Atualizar notificações periodicamente
    const interval = setInterval(() => {
      setNotifications(notificationService.getNotifications());
    }, 30000); // A cada 30 segundos

    return () => clearInterval(interval);
  }, []);

  const createNotification = (
    title: string,
    message: string,
    scheduledFor: Date,
    method: 'browser' | 'email' | 'sms' | 'whatsapp' = 'browser'
  ) => {
    notificationService.createCustomNotification(title, message, scheduledFor, method);
    setNotifications(notificationService.getNotifications());
  };

  const markAsRead = (notificationId: string) => {
    notificationService.markAsRead(notificationId);
    setNotifications(notificationService.getNotifications());
  };

  const deleteNotification = (notificationId: string) => {
    notificationService.deleteNotification(notificationId);
    setNotifications(notificationService.getNotifications());
  };

  const clearAllNotifications = () => {
    notificationService.clearAllNotifications();
    setNotifications([]);
  };

  const updateSettings = (newSettings: Partial<ReminderSettings>) => {
    notificationService.updateReminderSettings(newSettings);
    setSettings(notificationService.getReminderSettings());
  };

  const requestPermission = () => {
    return notificationService.requestNotificationPermission();
  };

  const unreadCount = notifications.filter(n => !n.sent).length;

  return {
    notifications,
    settings,
    unreadCount,
    createNotification,
    markAsRead,
    deleteNotification,
    clearAllNotifications,
    updateSettings,
    requestPermission
  };
};

