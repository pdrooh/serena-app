import { toast } from 'react-toastify';
import { NotificationConfig, ReminderSettings } from '../types';
import { requestPermission, sendNotification } from './pushNotificationService';

class NotificationService {
  private notifications: NotificationConfig[] = [];
  private reminderSettings: ReminderSettings = {
    appointmentReminder: {
      enabled: true,
      timeBefore: 30, // minutos antes
      methods: ['browser', 'email']
    },
    paymentReminder: {
      enabled: true,
      daysAfter: 3, // dias após vencimento
      methods: ['email', 'sms']
    },
    birthdayReminder: {
      enabled: true,
      daysBefore: 1, // dias antes do aniversário
      methods: ['email', 'whatsapp']
    }
  };

  constructor() {
    this.loadNotifications();
    this.loadSettings();
    this.startNotificationScheduler();
  }

  // Carregar notificações do localStorage
  private loadNotifications(): void {
    const saved = localStorage.getItem('serena_notifications');
    if (saved) {
      this.notifications = JSON.parse(saved).map((n: any) => ({
        ...n,
        scheduledFor: new Date(n.scheduledFor)
      }));
    }
  }

  // Salvar notificações no localStorage
  private saveNotifications(): void {
    localStorage.setItem('serena_notifications', JSON.stringify(this.notifications));
  }

  // Carregar configurações do localStorage
  private loadSettings(): void {
    const saved = localStorage.getItem('serena_reminder_settings');
    if (saved) {
      this.reminderSettings = JSON.parse(saved);
    }
  }

  // Salvar configurações no localStorage
  private saveSettings(): void {
    localStorage.setItem('serena_reminder_settings', JSON.stringify(this.reminderSettings));
  }

  // Iniciar agendador de notificações
  private startNotificationScheduler(): void {
    // Verificar notificações a cada minuto
    setInterval(() => {
      this.checkScheduledNotifications();
    }, 60000);
  }

  // Verificar notificações agendadas
  private checkScheduledNotifications(): void {
    const now = new Date();
    const dueNotifications = this.notifications.filter(
      n => !n.sent && n.scheduledFor <= now
    );

    dueNotifications.forEach(notification => {
      this.sendNotification(notification);
      notification.sent = true;
    });

    if (dueNotifications.length > 0) {
      this.saveNotifications();
    }
  }

  // Criar notificação
  private createNotification(
    type: NotificationConfig['type'],
    title: string,
    message: string,
    scheduledFor: Date,
    patientId?: string,
    method: NotificationConfig['method'] = 'browser'
  ): void {
    const notification: NotificationConfig = {
      id: `${type}_${Date.now()}`,
      type,
      title,
      message,
      scheduledFor,
      patientId,
      sent: false,
      method,
      priority: type === 'payment' ? 'high' : 'medium'
    };

    this.notifications.push(notification);
    this.saveNotifications();
  }

  // Enviar notificação
  private sendNotification(notification: NotificationConfig): void {
    switch (notification.method) {
      case 'browser':
        this.sendBrowserNotification(notification);
        break;
      case 'email':
        this.sendEmailNotification(notification);
        break;
      case 'sms':
        this.sendSMSNotification(notification);
        break;
      case 'whatsapp':
        this.sendWhatsAppNotification(notification);
        break;
    }
  }

  // Enviar notificação do navegador
  private sendBrowserNotification(notification: NotificationConfig): void {
    if (Notification.permission === 'granted') {
      sendNotification(notification.title, {
        body: notification.message,
        icon: '/favicon.ico',
        tag: notification.id
      });
    } else {
      toast.info(notification.message, {
        position: 'top-right',
        autoClose: 5000
      });
    }
  }

  // Enviar notificação por email
  private sendEmailNotification(notification: NotificationConfig): void {
    console.log('Enviando email:', notification);
    // Implementar integração com serviço de email
  }

  // Enviar notificação por SMS
  private sendSMSNotification(notification: NotificationConfig): void {
    console.log('Enviando SMS:', notification);
    // Implementar integração com gateway SMS
  }

  // Enviar notificação por WhatsApp
  private sendWhatsAppNotification(notification: NotificationConfig): void {
    console.log('Enviando WhatsApp:', notification);
    // Implementar integração com WhatsApp Business API
  }

  // Métodos públicos
  public getNotifications(): NotificationConfig[] {
    return this.notifications;
  }

  public getReminderSettings(): ReminderSettings {
    return this.reminderSettings;
  }

  public updateReminderSettings(settings: Partial<ReminderSettings>): void {
    this.reminderSettings = { ...this.reminderSettings, ...settings };
    this.saveSettings();
  }

  // Criar lembrete de consulta
  public createAppointmentReminder(appointment: any, patientName: string): void {
    if (!this.reminderSettings.appointmentReminder.enabled) return;

    const appointmentDate = new Date(appointment.date);
    const reminderTime = new Date(appointmentDate.getTime() - this.reminderSettings.appointmentReminder.timeBefore * 60000);

    const notification: NotificationConfig = {
      id: `appointment_${appointment.id}_${Date.now()}`,
      type: 'appointment',
      title: 'Lembrete de Consulta',
      message: `Consulta com ${patientName} em ${this.reminderSettings.appointmentReminder.timeBefore} minutos`,
      scheduledFor: reminderTime,
      patientId: appointment.patientId,
      sent: false,
      method: this.reminderSettings.appointmentReminder.methods[0],
      priority: 'medium'
    };

    this.notifications.push(notification);
    this.saveNotifications();
  }

  // Criar lembrete de pagamento
  public createPaymentReminder(payment: any, patientName: string): void {
    if (!this.reminderSettings.paymentReminder.enabled) return;

    const dueDate = new Date(payment.dueDate);
    const reminderDate = new Date(dueDate.getTime() + this.reminderSettings.paymentReminder.daysAfter * 24 * 60 * 60 * 1000);

    const notification: NotificationConfig = {
      id: `payment_${payment.id}_${Date.now()}`,
      type: 'payment',
      title: 'Lembrete de Pagamento',
      message: `Pagamento de ${patientName} em atraso há ${this.reminderSettings.paymentReminder.daysAfter} dias`,
      scheduledFor: reminderDate,
      patientId: payment.patientId,
      sent: false,
      method: this.reminderSettings.paymentReminder.methods[0],
      priority: 'high'
    };

    this.notifications.push(notification);
    this.saveNotifications();
  }

  // Criar lembrete de aniversário
  public createBirthdayReminder(patient: any): void {
    if (!this.reminderSettings.birthdayReminder.enabled) return;

    const notification: NotificationConfig = {
      id: `birthday_${patient.id}_${Date.now()}`,
      type: 'birthday',
      title: 'Aniversário do Paciente',
      message: `Hoje é o aniversário de ${patient.name}! Considere enviar uma mensagem de felicitações.`,
      scheduledFor: new Date(),
      patientId: patient.id,
      sent: false,
      method: this.reminderSettings.birthdayReminder.methods[0],
      priority: 'medium'
    };

    this.notifications.push(notification);
    this.saveNotifications();
  }

  // Método para solicitar permissão de notificações
  public async requestNotificationPermission(): Promise<NotificationPermission> {
    return await requestPermission();
  }

  // Método para criar notificação customizada
  public createCustomNotification(
    title: string,
    message: string,
    scheduledFor: Date,
    method: 'browser' | 'email' | 'sms' | 'whatsapp' = 'browser'
  ): void {
    const notification: NotificationConfig = {
      id: `custom_${Date.now()}`,
      type: 'custom',
      title,
      message,
      scheduledFor,
      sent: false,
      method,
      priority: 'medium'
    };

    this.notifications.push(notification);
    this.saveNotifications();
  }

  public markAsRead(notificationId: string): void {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.sent = true;
      this.saveNotifications();
    }
  }

  public deleteNotification(notificationId: string): void {
    this.notifications = this.notifications.filter(n => n.id !== notificationId);
    this.saveNotifications();
  }

  public clearAllNotifications(): void {
    this.notifications = [];
    this.saveNotifications();
  }
}

// Exportar os tipos junto com o serviço
export type { NotificationConfig, ReminderSettings };
export const notificationService = new NotificationService();
