import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import {
  Bell,
  BellRing,
  Settings,
  Trash2,
  Check,
  Clock,
  Calendar,
  CreditCard,
  Gift,
  AlertTriangle,
  Info,
  X
} from 'lucide-react';
import { theme } from '../../styles/theme';
import { notificationService, NotificationConfig, ReminderSettings } from '../../services/notificationService';

const NotificationCenterContainer = styled.div`
  position: relative;
`;

const NotificationButton = styled.button<{ hasUnread: boolean }>`
  position: relative;
  background: ${theme.colors.surface};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.spacing.md};
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: ${theme.colors.background};
    border-color: ${theme.colors.primary};
  }

  ${props => props.hasUnread && `
    border-color: ${theme.colors.status.warning};
    background: ${theme.colors.status.warning}10;
  `}
`;

const NotificationBadge = styled.div`
  position: absolute;
  top: -4px;
  right: -4px;
  background: ${theme.colors.status.error};
  color: white;
  border-radius: ${theme.borderRadius.full};
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: ${theme.typography.weights.bold};
`;

const NotificationPanel = styled.div<{ isOpen: boolean }>`
  position: absolute;
  top: 100%;
  right: 0;
  width: 400px;
  max-height: 500px;
  background: ${theme.colors.surface};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.lg};
  box-shadow: ${theme.shadows.lg};
  z-index: 1000;
  transform: ${props => props.isOpen ? 'translateY(0)' : 'translateY(-10px)'};
  opacity: ${props => props.isOpen ? 1 : 0};
  visibility: ${props => props.isOpen ? 'visible' : 'hidden'};
  transition: all 0.2s ease;

  @media (max-width: ${theme.breakpoints.mobile}) {
    width: 320px;
    right: -50px;
  }
`;

const PanelHeader = styled.div`
  padding: ${theme.spacing.lg};
  border-bottom: 1px solid ${theme.colors.border};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const PanelTitle = styled.h3`
  font-size: ${theme.typography.sizes.lg};
  font-weight: ${theme.typography.weights.semibold};
  color: ${theme.colors.text.primary};
  margin: 0;
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
`;

const PanelActions = styled.div`
  display: flex;
  gap: ${theme.spacing.sm};
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  color: ${theme.colors.text.secondary};
  cursor: pointer;
  padding: ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.sm};
  transition: all 0.2s ease;

  &:hover {
    background: ${theme.colors.background};
    color: ${theme.colors.text.primary};
  }
`;

const NotificationList = styled.div`
  max-height: 350px;
  overflow-y: auto;
`;

const NotificationItem = styled.div<{ isUnread: boolean }>`
  padding: ${theme.spacing.lg};
  border-bottom: 1px solid ${theme.colors.border};
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;

  &:hover {
    background: ${theme.colors.background};
  }

  ${props => props.isUnread && `
    background: ${theme.colors.primary}05;
    border-left: 3px solid ${theme.colors.primary};
  `}

  &:last-child {
    border-bottom: none;
  }
`;

const NotificationHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${theme.spacing.sm};
`;

const NotificationTitle = styled.h4`
  font-size: ${theme.typography.sizes.base};
  font-weight: ${theme.typography.weights.medium};
  color: ${theme.colors.text.primary};
  margin: 0;
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
`;

const NotificationTime = styled.span`
  font-size: ${theme.typography.sizes.sm};
  color: ${theme.colors.text.secondary};
`;

const NotificationMessage = styled.p`
  font-size: ${theme.typography.sizes.sm};
  color: ${theme.colors.text.secondary};
  margin: 0;
  line-height: 1.4;
`;

const NotificationActions = styled.div`
  display: flex;
  gap: ${theme.spacing.sm};
  margin-top: ${theme.spacing.sm};
`;

const NotificationIcon = styled.div<{ type: string }>`
  width: 24px;
  height: 24px;
  border-radius: ${theme.borderRadius.sm};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 12px;

  ${props => {
    switch (props.type) {
      case 'appointment':
        return `background: ${theme.colors.primary};`;
      case 'payment':
        return `background: ${theme.colors.status.warning};`;
      case 'birthday':
        return `background: ${theme.colors.status.success};`;
      default:
        return `background: ${theme.colors.text.secondary};`;
    }
  }}
`;

const EmptyState = styled.div`
  padding: ${theme.spacing.xl};
  text-align: center;
  color: ${theme.colors.text.secondary};
`;

const EmptyIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: ${theme.borderRadius.full};
  background: ${theme.colors.background};
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto ${theme.spacing.md};
  color: ${theme.colors.text.secondary};
`;

const SettingsModal = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  opacity: ${props => props.isOpen ? 1 : 0};
  visibility: ${props => props.isOpen ? 'visible' : 'hidden'};
  transition: all 0.2s ease;
`;

const SettingsContent = styled.div`
  background: ${theme.colors.surface};
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing.xl};
  width: 90%;
  max-width: 500px;
  max-height: 80vh;
  overflow-y: auto;
`;

const SettingsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${theme.spacing.lg};
`;

const SettingsTitle = styled.h2`
  font-size: ${theme.typography.sizes.xl};
  font-weight: ${theme.typography.weights.semibold};
  color: ${theme.colors.text.primary};
  margin: 0;
`;

const SettingsSection = styled.div`
  margin-bottom: ${theme.spacing.lg};
`;

const SectionTitle = styled.h3`
  font-size: ${theme.typography.sizes.lg};
  font-weight: ${theme.typography.weights.medium};
  color: ${theme.colors.text.primary};
  margin: 0 0 ${theme.spacing.md} 0;
`;

const SettingItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${theme.spacing.md} 0;
  border-bottom: 1px solid ${theme.colors.border};

  &:last-child {
    border-bottom: none;
  }
`;

const SettingLabel = styled.label`
  font-size: ${theme.typography.sizes.base};
  color: ${theme.colors.text.primary};
  cursor: pointer;
`;

const ToggleSwitch = styled.input`
  width: 44px;
  height: 24px;
  background: ${theme.colors.border};
  border-radius: 12px;
  position: relative;
  cursor: pointer;
  appearance: none;
  transition: all 0.2s ease;

  &:checked {
    background: ${theme.colors.primary};
  }

  &:before {
    content: '';
    position: absolute;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: white;
    top: 2px;
    left: 2px;
    transition: all 0.2s ease;
  }

  &:checked:before {
    transform: translateX(20px);
  }
`;

const NotificationCenter: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationConfig[]>([]);
  const [settings, setSettings] = useState<ReminderSettings>(notificationService.getReminderSettings());

  useEffect(() => {
    // Carregar notificações
    setNotifications(notificationService.getNotifications());

    // Solicitar permissão para notificações
    notificationService.requestNotificationPermission();

    // Atualizar notificações a cada 30 segundos
    const interval = setInterval(() => {
      setNotifications(notificationService.getNotifications());
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const unreadCount = notifications.filter(n => !n.sent).length;

  const handleNotificationClick = (notification: NotificationConfig) => {
    if (!notification.sent) {
      notificationService.markAsRead(notification.id);
      setNotifications(notificationService.getNotifications());
    }
  };

  const handleDeleteNotification = (notificationId: string) => {
    notificationService.deleteNotification(notificationId);
    setNotifications(notificationService.getNotifications());
  };

  const handleClearAll = () => {
    notificationService.clearAllNotifications();
    setNotifications([]);
    toast.success('Todas as notificações foram removidas');
  };

  const handleSettingsChange = (key: string, value: any) => {
    const newSettings = { ...settings };

    if (key.includes('.')) {
      const [section, field] = key.split('.');
      if (section === 'appointmentReminder') {
        newSettings.appointmentReminder = {
          ...newSettings.appointmentReminder,
          [field]: value
        };
      } else if (section === 'paymentReminder') {
        newSettings.paymentReminder = {
          ...newSettings.paymentReminder,
          [field]: value
        };
      } else if (section === 'birthdayReminder') {
        newSettings.birthdayReminder = {
          ...newSettings.birthdayReminder,
          [field]: value
        };
      }
    } else {
      (newSettings as any)[key] = value;
    }

    setSettings(newSettings);
    notificationService.updateReminderSettings(newSettings);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'appointment':
        return <Calendar size={16} />;
      case 'payment':
        return <CreditCard size={16} />;
      case 'birthday':
        return <Gift size={16} />;
      default:
        return <Info size={16} />;
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Agora';
    if (minutes < 60) return `${minutes}m atrás`;
    if (hours < 24) return `${hours}h atrás`;
    return `${days}d atrás`;
  };

  return (
    <NotificationCenterContainer>
      <NotificationButton
        hasUnread={unreadCount > 0}
        onClick={() => setIsOpen(!isOpen)}
      >
        {unreadCount > 0 ? <BellRing size={20} /> : <Bell size={20} />}
        {unreadCount > 0 && <NotificationBadge>{unreadCount}</NotificationBadge>}
      </NotificationButton>

      <NotificationPanel isOpen={isOpen}>
        <PanelHeader>
          <PanelTitle>
            <Bell size={20} />
            Notificações
          </PanelTitle>
          <PanelActions>
            <ActionButton onClick={() => setIsSettingsOpen(true)}>
              <Settings size={16} />
            </ActionButton>
            {notifications.length > 0 && (
              <ActionButton onClick={handleClearAll}>
                <Trash2 size={16} />
              </ActionButton>
            )}
            <ActionButton onClick={() => setIsOpen(false)}>
              <X size={16} />
            </ActionButton>
          </PanelActions>
        </PanelHeader>

        <NotificationList>
          {notifications.length === 0 ? (
            <EmptyState>
              <EmptyIcon>
                <Bell size={24} />
              </EmptyIcon>
              <p>Nenhuma notificação</p>
            </EmptyState>
          ) : (
            notifications
              .sort((a, b) => b.scheduledFor.getTime() - a.scheduledFor.getTime())
              .map((notification) => (
                <NotificationItem
                  key={notification.id}
                  isUnread={!notification.sent}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <NotificationHeader>
                    <NotificationTitle>
                      <NotificationIcon type={notification.type}>
                        {getNotificationIcon(notification.type)}
                      </NotificationIcon>
                      {notification.title}
                    </NotificationTitle>
                    <NotificationTime>
                      {formatTime(notification.scheduledFor)}
                    </NotificationTime>
                  </NotificationHeader>
                  <NotificationMessage>
                    {notification.message}
                  </NotificationMessage>
                  <NotificationActions>
                    {!notification.sent && (
                      <ActionButton
                        onClick={(e) => {
                          e.stopPropagation();
                          handleNotificationClick(notification);
                        }}
                      >
                        <Check size={14} />
                      </ActionButton>
                    )}
                    <ActionButton
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteNotification(notification.id);
                      }}
                    >
                      <Trash2 size={14} />
                    </ActionButton>
                  </NotificationActions>
                </NotificationItem>
              ))
          )}
        </NotificationList>
      </NotificationPanel>

      <SettingsModal isOpen={isSettingsOpen}>
        <SettingsContent>
          <SettingsHeader>
            <SettingsTitle>Configurações de Notificações</SettingsTitle>
            <ActionButton onClick={() => setIsSettingsOpen(false)}>
              <X size={20} />
            </ActionButton>
          </SettingsHeader>

          <SettingsSection>
            <SectionTitle>Lembretes de Consultas</SectionTitle>
            <SettingItem>
              <SettingLabel>Ativar lembretes</SettingLabel>
              <ToggleSwitch
                type="checkbox"
                checked={settings.appointmentReminder.enabled}
                onChange={(e) => handleSettingsChange('appointmentReminder.enabled', e.target.checked)}
              />
            </SettingItem>
            <SettingItem>
              <SettingLabel>Minutos antes da consulta</SettingLabel>
              <input
                type="number"
                value={settings.appointmentReminder.timeBefore}
                onChange={(e) => handleSettingsChange('appointmentReminder.timeBefore', parseInt(e.target.value))}
                min="5"
                max="1440"
                style={{
                  width: '80px',
                  padding: '4px 8px',
                  border: `1px solid ${theme.colors.border}`,
                  borderRadius: theme.borderRadius.sm,
                  fontSize: theme.typography.sizes.sm
                }}
              />
            </SettingItem>
          </SettingsSection>

          <SettingsSection>
            <SectionTitle>Lembretes de Pagamentos</SectionTitle>
            <SettingItem>
              <SettingLabel>Ativar lembretes</SettingLabel>
              <ToggleSwitch
                type="checkbox"
                checked={settings.paymentReminder.enabled}
                onChange={(e) => handleSettingsChange('paymentReminder.enabled', e.target.checked)}
              />
            </SettingItem>
            <SettingItem>
              <SettingLabel>Dias após vencimento</SettingLabel>
              <input
                type="number"
                value={settings.paymentReminder.daysAfter}
                onChange={(e) => handleSettingsChange('paymentReminder.daysAfter', parseInt(e.target.value))}
                min="1"
                max="30"
                style={{
                  width: '80px',
                  padding: '4px 8px',
                  border: `1px solid ${theme.colors.border}`,
                  borderRadius: theme.borderRadius.sm,
                  fontSize: theme.typography.sizes.sm
                }}
              />
            </SettingItem>
          </SettingsSection>

          <SettingsSection>
            <SectionTitle>Lembretes de Aniversário</SectionTitle>
            <SettingItem>
              <SettingLabel>Ativar lembretes</SettingLabel>
              <ToggleSwitch
                type="checkbox"
                checked={settings.birthdayReminder.enabled}
                onChange={(e) => handleSettingsChange('birthdayReminder.enabled', e.target.checked)}
              />
            </SettingItem>
            <SettingItem>
              <SettingLabel>Dias antes do aniversário</SettingLabel>
              <input
                type="number"
                value={settings.birthdayReminder.daysBefore}
                onChange={(e) => handleSettingsChange('birthdayReminder.daysBefore', parseInt(e.target.value))}
                min="1"
                max="7"
                style={{
                  width: '80px',
                  padding: '4px 8px',
                  border: `1px solid ${theme.colors.border}`,
                  borderRadius: theme.borderRadius.sm,
                  fontSize: theme.typography.sizes.sm
                }}
              />
            </SettingItem>
          </SettingsSection>
        </SettingsContent>
      </SettingsModal>
    </NotificationCenterContainer>
  );
};

export default NotificationCenter;
