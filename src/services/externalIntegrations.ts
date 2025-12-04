import { Appointment } from '../types';

// Interface para configurações de integração
export interface IntegrationConfig {
  googleCalendar?: {
    enabled: boolean;
    clientId: string;
    apiKey: string;
    calendarId: string;
  };
  outlook?: {
    enabled: boolean;
    clientId: string;
    tenantId: string;
  };
  smsGateway?: {
    enabled: boolean;
    provider: 'twilio' | 'aws-sns' | 'custom';
    apiKey: string;
    phoneNumber: string;
  };
  emailMarketing?: {
    enabled: boolean;
    provider: 'mailchimp' | 'sendgrid' | 'custom';
    apiKey: string;
    listId: string;
  };
  teleconsulta?: {
    enabled: boolean;
    provider: 'zoom' | 'google-meet' | 'microsoft-teams';
    apiKey: string;
    accountId?: string;
  };
}

// Interface para eventos de calendário
export interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  attendees: string[];
  location?: string;
  meetingLink?: string;
}

// Interface para SMS
export interface SMSMessage {
  to: string;
  message: string;
  appointmentId?: string;
}

// Interface para email marketing
export interface EmailCampaign {
  id: string;
  name: string;
  subject: string;
  content: string;
  recipients: string[];
  scheduledFor?: Date;
}

// Interface para teleconsulta
export interface TeleconsultaMeeting {
  id: string;
  appointmentId: string;
  meetingUrl: string;
  meetingId: string;
  password?: string;
  startTime: Date;
  duration: number;
}

class ExternalIntegrationsService {
  private config: IntegrationConfig;

  constructor() {
    this.config = this.loadConfig();
  }

  private loadConfig(): IntegrationConfig {
    const stored = localStorage.getItem('serena_integrations_config');
    return stored ? JSON.parse(stored) : {
      googleCalendar: { enabled: false, clientId: '', apiKey: '', calendarId: '' },
      outlook: { enabled: false, clientId: '', tenantId: '' },
      smsGateway: { enabled: false, provider: 'twilio', apiKey: '', phoneNumber: '' },
      emailMarketing: { enabled: false, provider: 'mailchimp', apiKey: '', listId: '' },
      teleconsulta: { enabled: false, provider: 'zoom', apiKey: '', accountId: '' }
    };
  }

  private saveConfig() {
    localStorage.setItem('serena_integrations_config', JSON.stringify(this.config));
  }

  // Configuração
  public updateConfig(newConfig: Partial<IntegrationConfig>) {
    this.config = { ...this.config, ...newConfig };
    this.saveConfig();
  }

  public getConfig(): IntegrationConfig {
    return this.config;
  }

  // Google Calendar Integration
  public async syncToGoogleCalendar(appointment: Appointment): Promise<boolean> {
    if (!this.config.googleCalendar?.enabled) {
      console.warn('Google Calendar integration is not enabled');
      return false;
    }

    try {
      const event: CalendarEvent = {
        id: `serena-${appointment.id}`,
        title: `Consulta - Paciente`,
        description: appointment.notes || 'Consulta psicológica',
        startTime: new Date(appointment.date),
        endTime: new Date(new Date(appointment.date).getTime() + appointment.duration * 60000),
        attendees: [],
        location: appointment.type === 'presencial' ? 'Consultório' : undefined,
        meetingLink: appointment.type === 'online' ? await this.generateMeetingLink(appointment) : undefined
      };

      // Simular chamada para Google Calendar API
      console.log('Syncing to Google Calendar:', event);

      // Em uma implementação real, você faria:
      // const response = await fetch(`https://www.googleapis.com/calendar/v3/calendars/${this.config.googleCalendar.calendarId}/events`, {
      //   method: 'POST',
      //   headers: {
      //     'Authorization': `Bearer ${accessToken}`,
      //     'Content-Type': 'application/json'
      //   },
      //   body: JSON.stringify(event)
      // });

      return true;
    } catch (error) {
      console.error('Error syncing to Google Calendar:', error);
      return false;
    }
  }

  // Outlook Integration
  public async syncToOutlook(appointment: Appointment): Promise<boolean> {
    if (!this.config.outlook?.enabled) {
      console.warn('Outlook integration is not enabled');
      return false;
    }

    try {
      const event: CalendarEvent = {
        id: `serena-${appointment.id}`,
        title: `Consulta - Paciente`,
        description: appointment.notes || 'Consulta psicológica',
        startTime: new Date(appointment.date),
        endTime: new Date(new Date(appointment.date).getTime() + appointment.duration * 60000),
        attendees: [],
        location: appointment.type === 'presencial' ? 'Consultório' : undefined,
        meetingLink: appointment.type === 'online' ? await this.generateMeetingLink(appointment) : undefined
      };

      console.log('Syncing to Outlook:', event);
      return true;
    } catch (error) {
      console.error('Error syncing to Outlook:', error);
      return false;
    }
  }

  // SMS Gateway
  public async sendSMS(message: SMSMessage): Promise<boolean> {
    if (!this.config.smsGateway?.enabled) {
      console.warn('SMS Gateway integration is not enabled');
      return false;
    }

    try {
      console.log('Sending SMS:', message);

      // Simular envio de SMS
      // Em uma implementação real, você faria:
      // if (this.config.smsGateway.provider === 'twilio') {
      //   const response = await fetch('https://api.twilio.com/2010-04-01/Accounts/{AccountSid}/Messages.json', {
      //     method: 'POST',
      //     headers: {
      //       'Authorization': `Basic ${btoa(`${this.config.smsGateway.apiKey}:${authToken}`)}`,
      //       'Content-Type': 'application/x-www-form-urlencoded'
      //     },
      //     body: new URLSearchParams({
      //       To: message.to,
      //       From: this.config.smsGateway.phoneNumber,
      //       Body: message.message
      //     })
      //   });
      // }

      return true;
    } catch (error) {
      console.error('Error sending SMS:', error);
      return false;
    }
  }

  // Email Marketing
  public async sendEmailCampaign(campaign: EmailCampaign): Promise<boolean> {
    if (!this.config.emailMarketing?.enabled) {
      console.warn('Email Marketing integration is not enabled');
      return false;
    }

    try {
      console.log('Sending email campaign:', campaign);

      // Simular envio de campanha
      // Em uma implementação real, você faria:
      // if (this.config.emailMarketing.provider === 'mailchimp') {
      //   const response = await fetch(`https://us1.api.mailchimp.com/3.0/campaigns`, {
      //     method: 'POST',
      //     headers: {
      //       'Authorization': `Bearer ${this.config.emailMarketing.apiKey}`,
      //       'Content-Type': 'application/json'
      //     },
      //     body: JSON.stringify({
      //       type: 'regular',
      //       recipients: { list_id: this.config.emailMarketing.listId },
      //       settings: {
      //         subject_line: campaign.subject,
      //         from_name: 'Serena Psicologia',
      //         reply_to: 'contato@serena.com'
      //       }
      //     })
      //   });
      // }

      return true;
    } catch (error) {
      console.error('Error sending email campaign:', error);
      return false;
    }
  }

  // Teleconsulta
  public async createTeleconsultaMeeting(appointment: Appointment): Promise<TeleconsultaMeeting | null> {
    if (!this.config.teleconsulta?.enabled) {
      console.warn('Teleconsulta integration is not enabled');
      return null;
    }

    try {
      const meeting: TeleconsultaMeeting = {
        id: `meeting-${appointment.id}`,
        appointmentId: appointment.id,
        meetingUrl: await this.generateMeetingLink(appointment),
        meetingId: `meeting-${Date.now()}`,
        password: this.generateMeetingPassword(),
        startTime: new Date(appointment.date),
        duration: appointment.duration
      };

      console.log('Creating teleconsulta meeting:', meeting);
      return meeting;
    } catch (error) {
      console.error('Error creating teleconsulta meeting:', error);
      return null;
    }
  }

  // Métodos auxiliares
  private async generateMeetingLink(appointment: Appointment): Promise<string> {
    const provider = this.config.teleconsulta?.provider || 'zoom';

    switch (provider) {
      case 'zoom':
        return `https://zoom.us/j/${Math.random().toString(36).substr(2, 9)}`;
      case 'google-meet':
        return `https://meet.google.com/${Math.random().toString(36).substr(2, 9)}`;
      case 'microsoft-teams':
        return `https://teams.microsoft.com/l/meetup-join/${Math.random().toString(36).substr(2, 9)}`;
      default:
        return `https://meet.example.com/${Math.random().toString(36).substr(2, 9)}`;
    }
  }

  private generateMeetingPassword(): string {
    return Math.random().toString(36).substr(2, 8).toUpperCase();
  }

  // Métodos de sincronização automática
  public async syncAppointmentToAllCalendars(appointment: Appointment): Promise<{ success: string[], failed: string[] }> {
    const results: { success: string[], failed: string[] } = { success: [], failed: [] };

    if (this.config.googleCalendar?.enabled) {
      const success = await this.syncToGoogleCalendar(appointment);
      if (success) results.success.push('Google Calendar');
      else results.failed.push('Google Calendar');
    }

    if (this.config.outlook?.enabled) {
      const success = await this.syncToOutlook(appointment);
      if (success) results.success.push('Outlook');
      else results.failed.push('Outlook');
    }

    return results;
  }

  public async sendAppointmentReminder(appointment: Appointment, patientPhone: string): Promise<boolean> {
    const message = `Lembrete: Você tem uma consulta agendada para ${new Date(appointment.date).toLocaleString('pt-BR')}. ${appointment.type === 'online' ? 'Link da consulta será enviado em breve.' : 'Local: Consultório'}`;

    return await this.sendSMS({
      to: patientPhone,
      message,
      appointmentId: appointment.id
    });
  }
}

export const externalIntegrationsService = new ExternalIntegrationsService();
