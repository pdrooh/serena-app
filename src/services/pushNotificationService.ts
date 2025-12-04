// Serviço para notificações push do navegador
export const requestPermission = async (): Promise<NotificationPermission> => {
  if (!('Notification' in window)) {
    console.warn('Este navegador não suporta notificações');
    return 'denied';
  }

  if (Notification.permission === 'granted') {
    return 'granted';
  }

  if (Notification.permission === 'denied') {
    return 'denied';
  }

  const permission = await Notification.requestPermission();
  return permission;
};

export const sendNotification = (title: string, options?: NotificationOptions): void => {
  if (Notification.permission === 'granted') {
    new Notification(title, options);
  } else {
    console.warn('Permissão para notificações não foi concedida');
  }
};

